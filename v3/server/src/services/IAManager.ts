import { EstadoSistema, Senha, ConfiguracoesGerais, ConfiguracaoRoteamento, TipoSenha } from '../../../shared/types';
import { StateManager } from './StateManager';

export class IAManager {
  private stateManager: StateManager;

  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;
  }

  /**
   * Orquestra a decisão da próxima senha a ser chamada, aplicando JSED, Fairness e WRR.
   * Considera mlHint do cliente se válido.
   * @param estado O estado atual do sistema.
   * @param senhasEspera A lista de senhas atualmente em espera.
   * @param mlHint Sugestão de senha da IA do cliente.
   * @returns A senha sugerida para chamada ou null se nenhuma senha for elegível.
   */
  public chamarProximaSenha(
    estado: EstadoSistema,
    senhasEspera: Senha[],
    mlHint?: { numeroPrevisto: string; score: number; source?: 'onnx' | 'fallback' }
  ): Senha | null {
    const agora = Date.now();
    const configRoteamento = estado.configuracoes.roteamento;

    // Resetar o estado do WRR ativo no início de cada ciclo de decisão
    estado.wrrAtivo = false;

    // 1) Correções v3.2: tempo limite no topo
    let elegiveis = this.reordenarFilaPorTempoLimite(senhasEspera);
    const apenasTempoLimite = elegiveis.filter(s => s.tempoLimiteAtingido);
    if (apenasTempoLimite.length > 0) {
      elegiveis = apenasTempoLimite;
    }
    if (elegiveis.length === 0) return null;

    // 2) WRR leve: se trigger ativo, executar uma rodada e sair
    if (this.wrrShouldRun(estado, configRoteamento)) {
      const senhaWRR = this.escolherPorWRR(elegiveis, estado, configRoteamento.wrr.weights);
      if (senhaWRR) {
        estado.wrrAtivo = true; // Sinaliza que o WRR está ativo
        this.registrarDecisao('wrr', senhaWRR.numero, 1.0, 'WRR ativado por desbalanceamento');
        return senhaWRR;
      }
    }

    // 3) JSED + fairness + fast-service
    let melhor: { senha: Senha; score: number } | null = null;
    const jsedScores: { senha: Senha; score: number }[] = [];

    for (const s of elegiveis) {
      const tEsperaMs = this.tempoEsperaAtualMs(s, agora);
      const tServicoMs = this.estimativaServicoMs(s, estado);
      const wBase = this.pesoPorTipo(s.tipo, configRoteamento.jsedWeights);
      const wAging = 1 + configRoteamento.wfq.alphaAging * Math.min(tEsperaMs / 60000 / configRoteamento.wfq.agingWindowMin, configRoteamento.wfq.slowdownMax);
      const wFast = (tServicoMs <= configRoteamento.fast.msLimit) ? configRoteamento.fast.boost : 1;
      const wEff = wBase * wAging * wFast;
      const sed = (tEsperaMs + tServicoMs) / wEff;
      jsedScores.push({ senha: s, score: sed });

      if (!melhor || sed < melhor.score) {
        melhor = { senha: s, score: sed };
      }
    }

    // Ordenar jsedScores para verificar top-3
    jsedScores.sort((a, b) => a.score - b.score);
    const top3JSED = jsedScores.slice(0, 3).map(item => item.senha.numero);

    let senhaFinal: Senha | null = melhor?.senha || elegiveis[0];
    let decisaoSource: 'jsed_fair_wrr' | 'mlHint-desempate' = 'jsed_fair_wrr';
    let decisaoConfianca = melhor?.score ? 1 / melhor.score : 0; // Inverso do SED como confiança

    // 4) Considerar mlHint se válido e no top-3 JSED
    if (mlHint && mlHint.numeroPrevisto && top3JSED.includes(mlHint.numeroPrevisto)) {
      const mlSenha = elegiveis.find(s => s.numero === mlHint.numeroPrevisto);
      if (mlSenha) {
        senhaFinal = mlSenha;
        decisaoSource = 'mlHint-desempate';
        decisaoConfianca = mlHint.score;
        this.registrarDecisao(decisaoSource, senhaFinal.numero, decisaoConfianca, `ML Hint aceito (source: ${mlHint.source})`, top3JSED);
        return senhaFinal;
      }
    }

    this.registrarDecisao(decisaoSource, senhaFinal?.numero || 'N/A', decisaoConfianca, 'Decisão JSED/Fairness/WRR', top3JSED);
    return senhaFinal;
  }

  /**
   * Reordena a fila colocando senhas com tempo limite atingido no início.
   * @param fila A fila de senhas original.
   * @returns A fila reordenada.
   */
  private reordenarFilaPorTempoLimite(fila: Senha[]): Senha[] {
    const comTempoLimite = fila.filter(s => s.tempoLimiteAtingido).sort((a, b) => (a.timestampTempoLimite || 0) - (b.timestampTempoLimite || 0));
    const semTempoLimite = fila.filter(s => !s.tempoLimiteAtingido);
    return [...comTempoLimite, ...semTempoLimite];
  }

  /**
   * Verifica se o WRR leve deve ser ativado.
   * @param estado O estado atual do sistema.
   * @param configRoteamento As configurações de roteamento.
   * @returns True se o WRR deve ser ativado, false caso contrário.
   */
  private wrrShouldRun(estado: EstadoSistema, configRoteamento: ConfiguracaoRoteamento): boolean {
    const wrrConfig = configRoteamento.wrr;

    // Só ativa o WRR se tivermos um número mínimo de chamadas para analisar
    if (estado.totalChamadasRecente < wrrConfig.windowCalls) {
      return false;
    }

    // Calcula a soma total dos pesos para normalização
    const totalWeights = Object.values(wrrConfig.weights).reduce((sum, weight) => sum + weight, 0);

    for (const tipo of ['prioridade', 'contratual', 'normal'] as TipoSenha[]) {
      const chamadasTipo = estado.chamadasPorTipoRecente[tipo] || 0;
      const pesoTipo = wrrConfig.weights[tipo];

      // Proporção esperada para este tipo
      const proporcaoEsperada = pesoTipo / totalWeights;

      // Proporção real de chamadas para este tipo
      const proporcaoReal = chamadasTipo / estado.totalChamadasRecente;

      // Verifica se há um desbalanceamento significativo
      if (Math.abs(proporcaoReal - proporcaoEsperada) > wrrConfig.enableThreshold) {
        console.log(`[IAManager] WRR ativado: Desbalanceamento detectado para ${tipo}. Real: ${proporcaoReal.toFixed(2)}, Esperado: ${proporcaoEsperada.toFixed(2)}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Escolhe uma senha usando o algoritmo Weighted Round Robin.
   * @param elegiveis As senhas elegíveis.
   * @param weights Os pesos para cada tipo de senha.
   * @returns A senha escolhida pelo WRR.
   */
  private escolherPorWRR(elegiveis: Senha[], estado: EstadoSistema, weights: { prioridade: number; contratual: number; normal: number }): Senha | null {
    if (elegiveis.length === 0) {
      return null;
    }

    const totalWeights = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    if (totalWeights === 0) {
      // Se todos os pesos forem zero, retorna a primeira senha elegível (comportamento padrão)
      return elegiveis[0];
    }

    const tiposOrdenadosPorDesbalanceamento: { tipo: TipoSenha; score: number }[] = [];
    for (const tipo of ['prioridade', 'contratual', 'normal'] as TipoSenha[]) {
      const chamadasTipo = estado.chamadasPorTipoRecente[tipo] || 0;
      const pesoTipo = weights[tipo];

      const proporcaoEsperada = pesoTipo / totalWeights;
      const proporcaoReal = estado.totalChamadasRecente > 0 ? chamadasTipo / estado.totalChamadasRecente : 0;

      // Um score maior indica que o tipo está mais "sub-atendido"
      const underServedScore = proporcaoEsperada - proporcaoReal;
      tiposOrdenadosPorDesbalanceamento.push({ tipo, score: underServedScore });
    }

    // Ordena os tipos de senha do mais sub-atendido para o menos sub-atendido
    tiposOrdenadosPorDesbalanceamento.sort((a, b) => b.score - a.score);

    for (const { tipo } of tiposOrdenadosPorDesbalanceamento) {
      const senhaEncontrada = elegiveis.find(s => s.tipo === tipo);
      if (senhaEncontrada) {
        return senhaEncontrada;
      }
    }

    // Fallback: se por algum motivo não encontrar nenhuma senha (o que não deveria acontecer se wrrShouldRun retornou true e elegiveis não está vazio)
    return elegiveis[0];
  }

  /**
   * Calcula o tempo de espera atual de uma senha.
   * @param senha A senha.
   * @param agora O timestamp atual.
   * @returns O tempo de espera em milissegundos.
   */
  private tempoEsperaAtualMs(senha: Senha, agora: number): number {
    // Considerar pausas por ausência se aplicável
    return agora - senha.timestamp;
  }

  /**
   * Estima o tempo de serviço para uma senha.
   * @param senha A senha.
   * @param estado O estado atual do sistema.
   * @returns O tempo de serviço estimado em milissegundos.
   */
  private estimativaServicoMs(senha: Senha, estado: EstadoSistema): number {
    // Implementar lógica de estimativa:
    // 1. Média por servicoDoCliente (rolling média robusta)
    // 2. Fallback para média por tipo (AdvancedStatisticsService)
    // 3. Fallback final para média global recente (AdvancedStatisticsService)
    // Por enquanto, um valor fixo
    return 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Retorna o peso base para um tipo de senha.
   * @param tipo O tipo da senha.
   * @param jsedWeights Os pesos JSED configurados.
   * @returns O peso base.
   */
  private pesoPorTipo(tipo: TipoSenha, jsedWeights: { prioridade: number; contratual: number; normal: number }): number {
    return jsedWeights[tipo] || 1.0;
  }

  /**
   * Registra a decisão da IA para telemetria.
   * @param source A fonte da decisão ('jsed_fair_wrr' ou 'mlHint-desempate').
   * @param numeroSenha O número da senha chamada.
   * @param confianca A confiança da decisão (score do ML ou inverso do SED).
   * @param motivo Uma descrição breve da decisão.
   */
  private registrarDecisao(source: 'jsed_fair_wrr' | 'mlHint-desempate' | 'wrr', numeroSenha: string, confianca: number, motivo: string, top3?: string[]): void {
    console.log(`[IAManager] Decisão: ${source}, Senha: ${numeroSenha}, Confiança: ${confianca.toFixed(2)}, Motivo: ${motivo}`);
    try {
      const estado = this.stateManager.getEstado();
      this.stateManager.registrarDecisaoIA({ numero: numeroSenha, source, confianca, timestamp: Date.now(), top3, wrrAtivo: !!estado.wrrAtivo });
    } catch (e) { void e }
  }

  public ordenarFilaPorJSED(estado: EstadoSistema, senhasEspera: Senha[]): string[] {
    const agora = Date.now();
    const configRoteamento = estado.configuracoes.roteamento;
    const comTempoLimite = senhasEspera.filter(s => s.tempoLimiteAtingido);
    const semTempoLimite = senhasEspera.filter(s => !s.tempoLimiteAtingido);
    const scoreSubset = (subset: Senha[]) => {
      const scores: { numero: string; score: number }[] = [];
      for (const s of subset) {
        const tEsperaMs = this.tempoEsperaAtualMs(s, agora);
        const tServicoMs = this.estimativaServicoMs(s, estado);
        const wBase = this.pesoPorTipo(s.tipo, configRoteamento.jsedWeights);
        const wAging = 1 + configRoteamento.wfq.alphaAging * Math.min(tEsperaMs / 60000 / configRoteamento.wfq.agingWindowMin, configRoteamento.wfq.slowdownMax);
        const wFast = (tServicoMs <= configRoteamento.fast.msLimit) ? configRoteamento.fast.boost : 1;
        const wEff = wBase * wAging * wFast;
        const sed = (tEsperaMs + tServicoMs) / wEff;
        scores.push({ numero: s.numero, score: sed });
      }
      scores.sort((a, b) => a.score - b.score);
      return scores.map(x => x.numero);
    };
    const parteTL = scoreSubset(comTempoLimite);
    const parteSemTL = scoreSubset(semTempoLimite);
    return [...parteTL, ...parteSemTL];
  }
}
