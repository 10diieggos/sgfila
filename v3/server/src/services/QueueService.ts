/**
 * QueueService - Gerenciamento de senhas e fila
 * SGFILA v3.0
 */

import type { EstadoSistema, Senha, TipoSenha, MotivoRetorno, RegistroDevolucao } from '../../../shared/types.js';
import { StateManager } from './StateManager.js';

export class QueueService {
  private stateManager: StateManager;

  constructor() {
    this.stateManager = StateManager.getInstance();
  }

  /**
   * Gera número de senha no formato adequado
   */
  private gerarNumeroSenha(tipo: TipoSenha, subtipo: string, contador: number): string {
    let prefixo = '';

    if (tipo === 'prioridade') {
      prefixo = 'P';
    } else if (tipo === 'contratual') {
      prefixo = 'C';
    } else {
      prefixo = 'N';
    }

    const numero = String(contador).padStart(3, '0');
    return subtipo ? `${prefixo}-${subtipo.toUpperCase()}-${numero}` : `${prefixo}-${numero}`;
  }

  /**
   * Emite uma nova senha
   */
  public emitirSenha(tipo: TipoSenha, subtipo: string = ''): Senha {
    const estado = this.stateManager.getEstado();

    // Incrementa contador apropriado
    if (tipo === 'prioridade') {
      estado.contadorPrioridade++;
    } else if (tipo === 'contratual') {
      estado.contadorContratual++;
    } else {
      estado.contadorNormal++;
    }

    estado.senhasHoje++;

    // Gera número da senha
    const contador = tipo === 'prioridade'
      ? estado.contadorPrioridade
      : tipo === 'contratual'
        ? estado.contadorContratual
        : estado.contadorNormal;

    const numero = this.gerarNumeroSenha(tipo, subtipo, contador);

    // Cria nova senha
    const novaSenha: Senha = {
      numero,
      tipo,
      subtipo,
      timestamp: Date.now(),
      status: 'espera',
      descricao: '',
      tempoEspera: 0,
      tempoAtendimento: 0,
      // Campos de correção v3.2
      reposicionamentos: 0,
      tentativasAusencia: 0
    };

    estado.senhas.push(novaSenha);
    this.stateManager.setEstado(estado);

    console.log(`Senha emitida: ${numero}`);
    return novaSenha;
  }

  /**
   * Chama próxima senha da fila para um guichê
   * v3.2 - Integrado com sistema de correção de distorções
   */
  public chamarSenha(guicheId: string): Senha | null {
    const estado = this.stateManager.getEstado();

    // Verifica se guichê já está atendendo
    if (estado.atendimentosAtuais[guicheId]) {
      console.log(`Guichê ${guicheId} já está atendendo`);
      return null;
    }

    // NOVA LÓGICA v3.2: Verifica tempos limite antes de chamar
    const config = estado.configuracoes.correcoes;
    if (config.frequenciaVerificacao === 'por_chamada' || config.frequenciaVerificacao === 'tempo_real') {
      this.verificarTemposLimite();
    }

    // Busca senhas em espera
    let senhasEspera = estado.senhas
      .filter(s => s.status === 'espera')
      .sort((a, b) => a.timestamp - b.timestamp);

    if (senhasEspera.length === 0) {
      console.log('Nenhuma senha na fila');
      return null;
    }

    // NOVA LÓGICA v3.2: Reordena fila colocando senhas em tempo limite primeiro
    senhasEspera = this.reordenarFilaPorTempoLimite(senhasEspera);

    // Aplica algoritmo de chamada configurado
    const algoritmo = estado.configuracoes?.comportamentoFila?.algoritmo || 'proporcao';
    let senhaChamada: Senha | null = null;

    if (algoritmo === 'fifo') {
      // FIFO: Primeira senha em espera (já ordenado e reordenado por tempo limite)
      senhaChamada = senhasEspera[0];
      console.log(`Algoritmo FIFO: chamando ${senhaChamada.numero}`);
    } else if (algoritmo === 'round_robin') {
      // Round Robin: Alterna entre tipos igualmente
      senhaChamada = this.chamarRoundRobin(estado, senhasEspera);
    } else {
      // Proporção (padrão): Respeita proporção configurada
      senhaChamada = this.chamarProporcao(estado, senhasEspera);
    }

    if (!senhaChamada) {
      return null;
    }

    // NOVA LÓGICA v3.2: Retoma contagem de tempo se estava pausada por ausência
    this.retomarContagemTempo(senhaChamada);

    // Atualiza senha para chamada
    const agora = Date.now();
    senhaChamada.status = 'chamada';
    senhaChamada.guicheAtendendo = guicheId;

    // Busca nome do guichê
    const guiche = estado.guichesConfigurados.find(g => g.id === guicheId);
    senhaChamada.guicheNome = guiche?.nome || guicheId;

    senhaChamada.chamadaTimestamp = agora;
    senhaChamada.tempoEspera = agora - senhaChamada.timestamp;

    // Adiciona aos atendimentos atuais
    estado.atendimentosAtuais[guicheId] = senhaChamada;

    this.stateManager.setEstado(estado);

    console.log(`Senha ${senhaChamada.numero} chamada para ${guicheId}`);
    return senhaChamada;
  }

  /**
   * Algoritmo de proporção (padrão)
   * v3.2 - Senhas em tempo limite têm prioridade sem afetar contagem
   */
  private chamarProporcao(estado: EstadoSistema, senhasEspera: Senha[]): Senha | null {
    // NOVA LÓGICA v3.2: Verifica primeiro se há senha em tempo limite
    const comTempoLimite = senhasEspera.find(s => s.tempoLimiteAtingido);
    if (comTempoLimite) {
      console.log(`[Correção] Chamando senha em tempo limite: ${comTempoLimite.numero} (não afeta proporção)`);
      return comTempoLimite;
    }

    // Continua com lógica normal
    const prioritarias = senhasEspera.filter(s => s.tipo === 'prioridade');
    const contratuais = senhasEspera.filter(s => s.tipo === 'contratual');
    const normais = senhasEspera.filter(s => s.tipo === 'normal');

    const contadorP = estado.contadorPrioridadeDesdeUltimaNormal;
    const contadorC = estado.contadorContratualDesdeUltimaNormal;
    const proporcaoP = estado.proporcaoPrioridade;
    const proporcaoC = estado.proporcaoContratual;

    let senhaChamada: Senha | null = null;

    if (prioritarias.length > 0 && contadorP < proporcaoP) {
      senhaChamada = prioritarias[0];
      estado.contadorPrioridadeDesdeUltimaNormal++;
    } else if (contratuais.length > 0 && contadorC < proporcaoC) {
      senhaChamada = contratuais[0];
      estado.contadorContratualDesdeUltimaNormal++;
    } else if (normais.length > 0) {
      senhaChamada = normais[0];
      estado.contadorPrioridadeDesdeUltimaNormal = 0;
      estado.contadorContratualDesdeUltimaNormal = 0;
    } else if (prioritarias.length > 0) {
      senhaChamada = prioritarias[0];
      estado.contadorPrioridadeDesdeUltimaNormal++;
    } else if (contratuais.length > 0) {
      senhaChamada = contratuais[0];
      estado.contadorContratualDesdeUltimaNormal++;
    }

    return senhaChamada;
  }

  /**
   * Algoritmo Round Robin - Alterna entre tipos igualmente
   * v3.2 - Senhas em tempo limite têm prioridade
   */
  private chamarRoundRobin(estado: EstadoSistema, senhasEspera: Senha[]): Senha | null {
    // NOVA LÓGICA v3.2: Verifica primeiro se há senha em tempo limite
    const comTempoLimite = senhasEspera.find(s => s.tempoLimiteAtingido);
    if (comTempoLimite) {
      console.log(`[Correção] Round Robin: Chamando senha em tempo limite: ${comTempoLimite.numero}`);
      return comTempoLimite;
    }

    // Continua com lógica normal
    const prioritarias = senhasEspera.filter(s => s.tipo === 'prioridade');
    const contratuais = senhasEspera.filter(s => s.tipo === 'contratual');
    const normais = senhasEspera.filter(s => s.tipo === 'normal');

    // Usa contadores para alternar entre tipos
    const contadorP = estado.contadorPrioridadeDesdeUltimaNormal;
    const contadorC = estado.contadorContratualDesdeUltimaNormal;
    const totalContador = contadorP + contadorC;

    // Ciclo: Prioridade -> Contratual -> Normal -> Prioridade...
    const ciclo = totalContador % 3;

    if (ciclo === 0 && prioritarias.length > 0) {
      estado.contadorPrioridadeDesdeUltimaNormal++;
      console.log('Round Robin: chamando Prioridade');
      return prioritarias[0];
    } else if (ciclo === 1 && contratuais.length > 0) {
      estado.contadorContratualDesdeUltimaNormal++;
      console.log('Round Robin: chamando Contratual');
      return contratuais[0];
    } else if (normais.length > 0) {
      estado.contadorPrioridadeDesdeUltimaNormal = 0;
      estado.contadorContratualDesdeUltimaNormal = 0;
      console.log('Round Robin: chamando Normal');
      return normais[0];
    }

    // Fallback: chama qualquer senha disponível
    if (prioritarias.length > 0) return prioritarias[0];
    if (contratuais.length > 0) return contratuais[0];
    if (normais.length > 0) return normais[0];

    return null;
  }

  /**
   * Chama uma senha específica
   */
  public chamarSenhaEspecifica(guicheId: string, numeroSenha: string): Senha | null {
    const estado = this.stateManager.getEstado();

    // Verifica se pular senhas está permitido
    const permitirPular = estado.configuracoes?.comportamentoFila?.permitirPularSenhas ?? true;
    if (!permitirPular) {
      console.log('Pular senhas não está permitido nas configurações');
      return null;
    }

    // Se guichê já está atendendo, finaliza automaticamente
    if (estado.atendimentosAtuais[guicheId]) {
      console.log(`Guichê ${guicheId} já está atendendo - finalizando automaticamente`);
      this.finalizarAtendimento(guicheId);
    }

    // Busca senha específica (em qualquer status)
    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Se a senha não está em espera, retorna para fila primeiro
    if (senha.status !== 'espera') {
      console.log(`Senha ${numeroSenha} não está em espera (${senha.status}) - devolvendo para fila`);
      // Limpa dados de atendimento/finalização
      senha.guicheAtendendo = undefined;
      senha.guicheNome = undefined;
      senha.chamadaTimestamp = undefined;
      senha.finalizadoTimestamp = undefined;
      senha.status = 'espera';
    }

    // Atualiza senha para chamada
    const agora = Date.now();
    senha.status = 'chamada';
    senha.guicheAtendendo = guicheId;

    // Busca nome do guichê
    const guiche = estado.guichesConfigurados.find(g => g.id === guicheId);
    senha.guicheNome = guiche?.nome || guicheId;

    senha.chamadaTimestamp = agora;
    senha.tempoEspera = agora - senha.timestamp;

    estado.atendimentosAtuais[guicheId] = senha;

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} chamada para ${guicheId}`);
    return senha;
  }

  /**
   * Finaliza atendimento de um guichê
   * @returns objeto com a senha finalizada e flag indicando se deve auto-chamar
   */
  public finalizarAtendimento(guicheId: string): { senha: Senha | null; autoChamar: boolean } {
    const estado = this.stateManager.getEstado();

    const senha = estado.atendimentosAtuais[guicheId];
    if (!senha) {
      console.log(`Nenhuma senha em atendimento no ${guicheId}`);
      return { senha: null, autoChamar: false };
    }

    // Atualiza senha para atendida
    const agora = Date.now();
    senha.status = 'atendida';
    senha.finalizadoTimestamp = agora;
    senha.tempoAtendimento = agora - (senha.chamadaTimestamp || agora);

    // Remove dos atendimentos atuais
    delete estado.atendimentosAtuais[guicheId];

    this.stateManager.setEstado(estado);

    console.log(`Atendimento finalizado no ${guicheId}: ${senha.numero}`);

    // Verifica se deve auto-chamar próxima senha
    const chamarAutomatica = estado.configuracoes?.comportamentoFila?.chamarProximaAutomatica ?? false;

    return { senha, autoChamar: chamarAutomatica };
  }

  /**
   * Devolve senha para a fila
   */
  public devolverSenha(numeroSenha: string): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Não pode devolver senha que já está em espera
    if (senha.status === 'espera') {
      console.log(`Senha ${numeroSenha} já está na fila de espera`);
      return null;
    }

    // Restaura para espera
    senha.status = 'espera';
    senha.tempoEspera = 0;
    senha.tempoAtendimento = 0;

    // Remove dos atendimentos atuais (se estiver em chamada)
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    // Limpa dados de atendimento
    senha.guicheAtendendo = undefined;
    senha.guicheNome = undefined;
    senha.chamadaTimestamp = undefined;
    senha.finalizadoTimestamp = undefined;

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} devolvida para fila (status anterior: ${senha.status})`);
    return senha;
  }

  /**
   * Devolve senha para fila com motivo específico e regras de reposicionamento
   */
  public devolverSenhaComMotivo(numeroSenha: string, motivo: MotivoRetorno): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Não pode devolver senha que já está em espera
    if (senha.status === 'espera') {
      console.log(`Senha ${numeroSenha} já está na fila de espera`);
      return null;
    }

    // Calcula tempo decorrido desde histórico
    const agora = Date.now();
    const timestampHistorico = senha.finalizadoTimestamp || agora;
    const tempoDecorridoMs = agora - timestampHistorico;
    const tempoDecorridoMinutos = Math.floor(tempoDecorridoMs / 60000);

    // Validações por motivo
    if (motivo === 'ausente_retornou' && tempoDecorridoMinutos > 15) {
      console.log(`Devolução bloqueada: Ausência superior a 15 minutos (${tempoDecorridoMinutos}min)`);
      return null;
    }

    if (motivo === 'reabertura_atendimento' && tempoDecorridoMinutos > 30) {
      console.log(`Devolução bloqueada: Tempo superior a 30 minutos (${tempoDecorridoMinutos}min)`);
      return null;
    }

    // Remove dos atendimentos atuais se estiver lá
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    // Limpa dados de atendimento
    senha.guicheAtendendo = undefined;
    senha.guicheNome = undefined;
    senha.chamadaTimestamp = undefined;
    senha.finalizadoTimestamp = undefined;
    // NÃO resetar tempoEspera e tempoAtendimento - devem continuar acumulando desde emissão

    // Aplica estratégia de reposicionamento baseada no motivo
    let posicaoAtribuida: number | undefined;

    if (motivo === 'erro_operacional') {
      // Apenas erro_operacional tenta restaurar posição original
      // Mantém timestamp original (emissão) para ordem natural
      posicaoAtribuida = senha.posicaoOriginal || 1;
      console.log(`Erro operacional: ${numeroSenha} - Mantém posição original`);
    } else {
      // Todos os outros motivos: preservar timestamp original de emissão
      // Isso garante ordem natural da fila (mais antigas primeiro)
      // NÃO modificar senha.timestamp - já está definido desde a emissão
      posicaoAtribuida = undefined; // Será determinado pela ordenação natural
      console.log(`${motivo}: ${numeroSenha} - Retorna pela ordem de emissão`);
    }

    // Atualiza status
    senha.status = 'espera';

    // Registra devolução no histórico
    if (!senha.historicoDevolucoes) {
      senha.historicoDevolucoes = [];
    }

    const registro: RegistroDevolucao = {
      timestamp: agora,
      motivo,
      timestampHistorico,
      tempoDecorridoMinutos,
      posicaoAtribuida
    };

    senha.historicoDevolucoes.push(registro);

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} devolvida com motivo: ${motivo} (${tempoDecorridoMinutos}min decorridos)`);
    return senha;
  }

  /**
   * Exclui senha da fila
   */
  public excluirSenha(numeroSenha: string): boolean {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return false;
    }

    // Marca como excluída ao invés de remover
    senha.status = 'excluida';
    senha.finalizadoTimestamp = Date.now();

    // Remove dos atendimentos atuais se estiver lá
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} excluída`);
    return true;
  }

  /**
   * Marca atendimento como não compareceu
   */
  public excluirAtendimento(numeroSenha: string): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Marca como não compareceu
    senha.status = 'nao_compareceu';
    senha.finalizadoTimestamp = Date.now();

    // Remove dos atendimentos atuais se estiver lá
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} marcada como não compareceu`);
    return senha;
  }

  /**
   * Atualiza descrição de uma senha
   */
  public atualizarDescricao(numeroSenha: string, descricao: string): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    senha.descricao = descricao;
    this.stateManager.setEstado(estado);

    console.log(`Descrição atualizada para ${numeroSenha}`);
    return senha;
  }

  /**
   * Verifica senhas que atingiram tempo limite e as reordena na fila
   * v3.2 - Sistema de Correção de Distorções
   */
  public verificarTemposLimite(): number {
    const estado = this.stateManager.getEstado();
    const config = estado.configuracoes.correcoes;

    if (!config.tempoLimite.ativo) {
      return 0;
    }

    const agora = Date.now();
    let corrigidasCount = 0;
    const senhasEspera = estado.senhas.filter(s => s.status === 'espera');

    for (const senha of senhasEspera) {
      // Já atingiu tempo limite antes?
      if (senha.tempoLimiteAtingido) {
        continue;
      }

      // Verifica se deve limitar reposicionamentos
      if (config.tempoLimite.maxReposicionamentos > 0 &&
          senha.reposicionamentos >= config.tempoLimite.maxReposicionamentos) {
        continue;
      }

      // Calcula tempo de espera (considerando pausas por ausência)
      let tempoEsperaMs = agora - senha.timestamp;

      if (senha.pausarContagemTempo && senha.timestampInicioAusencia) {
        // Desconta o tempo em que estava ausente
        tempoEsperaMs -= (agora - senha.timestampInicioAusencia);
      }

      const tempoEsperaMin = tempoEsperaMs / 60000;

      // Obtém tempo limite para o tipo de senha
      const tempoLimite = config.tempoLimite.temposPorTipo[senha.tipo];

      if (tempoEsperaMin > tempoLimite) {
        // Marca como atingido
        senha.tempoLimiteAtingido = true;
        senha.timestampTempoLimite = agora;
        senha.reposicionamentos++;

        corrigidasCount++;

        if (config.tempoLimite.registrarLog) {
          console.log(`[Correção] Tempo limite: ${senha.numero} (${Math.floor(tempoEsperaMin)}min > ${tempoLimite}min)`);
        }

        // Verifica limite de correções em massa
        if (config.limitarCorrecoesEmMassa && corrigidasCount >= config.maxCorrecoesSimultaneas) {
          console.log(`[Correção] Limite de correções em massa atingido: ${config.maxCorrecoesSimultaneas}`);
          break;
        }
      }
    }

    if (corrigidasCount > 0) {
      this.stateManager.setEstado(estado);
      console.log(`[Correção] ${corrigidasCount} senha(s) reposicionada(s) por tempo limite`);
    }

    return corrigidasCount;
  }

  /**
   * Reordena a fila colocando senhas em tempo limite primeiro
   * Mantém ordem relativa (quem tem mais tempo vai primeiro)
   */
  private reordenarFilaPorTempoLimite(senhasEspera: Senha[]): Senha[] {
    const comTempoLimite = senhasEspera.filter(s => s.tempoLimiteAtingido);
    const semTempoLimite = senhasEspera.filter(s => !s.tempoLimiteAtingido);

    // Ordena senhas em tempo limite por tempo de espera (maior primeiro)
    comTempoLimite.sort((a, b) => {
      const tempoA = Date.now() - a.timestamp;
      const tempoB = Date.now() - b.timestamp;
      return tempoB - tempoA;
    });

    // Retorna fila reordenada: tempo limite primeiro, depois normais
    return [...comTempoLimite, ...semTempoLimite];
  }

  /**
   * Processa ausência de senha quando não comparece
   * v3.2 - Sistema de Correção de Distorções
   */
  public processarAusencia(numeroSenha: string): { acao: 'recolocada' | 'historico' | 'ignorada'; senha: Senha | null } {
    const estado = this.stateManager.getEstado();
    const config = estado.configuracoes.correcoes;

    if (!config.ausencias.ativo) {
      return { acao: 'ignorada', senha: null };
    }

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      return { acao: 'ignorada', senha: null };
    }

    const agora = Date.now();
    senha.tentativasAusencia++;
    senha.timestampUltimaChamada = agora;

    // Verifica se atingiu o limite de tentativas (tentativasPermitidas + chamada inicial = total de chamadas)
    if (senha.tentativasAusencia > config.ausencias.tentativasPermitidas) {
      // Move para histórico como não compareceu
      senha.status = 'nao_compareceu';
      senha.finalizadoTimestamp = agora;

      // Remove dos atendimentos atuais se estiver lá
      const guiche = senha.guicheAtendendo;
      if (guiche && estado.atendimentosAtuais[guiche]) {
        delete estado.atendimentosAtuais[guiche];
      }

      this.stateManager.setEstado(estado);
      console.log(`[Ausência] ${numeroSenha} movida para histórico após ${senha.tentativasAusencia} ausências`);

      return { acao: 'historico', senha };
    }

    // Ainda tem tentativas - recoloca na fila
    senha.status = 'espera';

    // Pausa contagem de tempo durante ausência (configuração)
    senha.pausarContagemTempo = true;
    senha.timestampInicioAusencia = agora;

    // Remove dos atendimentos atuais
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    // Limpa dados de chamada
    senha.guicheAtendendo = undefined;
    senha.guicheNome = undefined;
    senha.chamadaTimestamp = undefined;

    this.stateManager.setEstado(estado);
    console.log(`[Ausência] ${numeroSenha} recolocada na fila (${senha.tentativasAusencia}/${config.ausencias.tentativasPermitidas + 1})`);

    return { acao: 'recolocada', senha };
  }

  /**
   * Retoma contagem de tempo quando senha ausente é chamada novamente
   */
  private retomarContagemTempo(senha: Senha): void {
    if (senha.pausarContagemTempo && senha.timestampInicioAusencia) {
      const agora = Date.now();
      const tempoAusente = agora - senha.timestampInicioAusencia;

      // Ajusta timestamp para não contar o tempo ausente
      senha.timestamp += tempoAusente;

      // Reseta flags de pausa
      senha.pausarContagemTempo = false;
      senha.timestampInicioAusencia = undefined;

      console.log(`[Ausência] ${senha.numero} retomou contagem de tempo (ajustado +${Math.floor(tempoAusente / 60000)}min)`);
    }
  }
}
