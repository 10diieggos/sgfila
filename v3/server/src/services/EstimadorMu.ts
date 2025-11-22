import { TipoSenha } from '../../../shared/types';

/**
 * EstimadorMu - Estimador de taxa de atendimento (μ) por hora
 *
 * Implementa:
 * - Cálculo de μ = atendimentos/hora ÷ tempo_médio_atendimento
 * - EWMA para suavização temporal
 * - Ajuste para interrupções (ausências, não comparecimentos)
 * - Separação por tipo de serviço e guichê
 * - Marcador de confiabilidade por volume de amostras
 *
 * Fórmula:
 *   μ(h) = n_atendimentos(h) / (soma_tempos_atendimento(h) / 3600000)
 *   μ_EWMA(h) = α × μ_raw(h) + (1-α) × μ_EWMA(h-1)
 *
 * Referências:
 * - T-105 em proximos_passos.md
 * - Teoria de filas: taxa de serviço em M/M/c
 */

export interface AtendimentoRegistro {
  timestamp: number;
  tipo: TipoSenha;
  servicoDoCliente: string;
  guicheId?: string;
  tempoAtendimentoMs: number; // chamadaTimestamp até finalizadoTimestamp
  interrompido: boolean; // true se ausência/não comparecimento
}

export interface MuPorHora {
  hora: number; // 0-23
  mu: { [tipo: string]: number }; // atendimentos/hora por tipo
  muGlobal: number; // taxa global
  muPorGuiche: { [guicheId: string]: number }; // taxa por guichê
  tempoMedioAtendimentoMs: { [tipo: string]: number }; // tempo médio por tipo
  nAmostras: { [tipo: string]: number }; // número de amostras por tipo
  nInterrompidos: { [tipo: string]: number }; // número de interrupções por tipo
  confiabilidade: 'alta' | 'media' | 'baixa';
  timestamp: number;
}

export class EstimadorMu {
  private atendimentos: AtendimentoRegistro[] = [];
  private ewmaAlpha: number;
  private janela1h: number = 60 * 60 * 1000; // 1h em ms
  private muAtual: Map<number, MuPorHora> = new Map(); // hora -> mu

  // Thresholds de confiabilidade
  private readonly CONFIABILIDADE_ALTA = 20;
  private readonly CONFIABILIDADE_MEDIA = 5;

  constructor(alpha: number = 0.3) {
    this.ewmaAlpha = alpha;
  }

  /**
   * Registra um atendimento finalizado
   */
  public registrarAtendimento(
    tipo: TipoSenha,
    servicoDoCliente: string,
    tempoAtendimentoMs: number,
    guicheId?: string,
    interrompido: boolean = false
  ): void {
    const atendimento: AtendimentoRegistro = {
      timestamp: Date.now(),
      tipo,
      servicoDoCliente,
      guicheId,
      tempoAtendimentoMs,
      interrompido
    };

    this.atendimentos.push(atendimento);
    this.limparHistoricoAntigo();
  }

  /**
   * Calcula μ(h) para a hora atual
   * @param horaAtual Hora atual (0-23)
   * @returns Mu estimado por tipo, guichê e global
   */
  public calcularMu(horaAtual?: number): MuPorHora {
    const agora = Date.now();
    const hora = horaAtual ?? new Date(agora).getHours();

    // Janela de tempo (1h)
    const inicio1h = agora - this.janela1h;

    // Filtrar atendimentos na janela de 1h (excluir interrompidos para cálculo de μ)
    const atendimentos1h = this.atendimentos.filter(a => a.timestamp >= inicio1h);
    const atendimentosValidos = atendimentos1h.filter(a => !a.interrompido);

    // Calcular μ por tipo
    const muPorTipo: { [tipo: string]: number } = {};
    const tempoMedioPorTipo: { [tipo: string]: number } = {};
    const nAmostrasPorTipo: { [tipo: string]: number } = {};
    const nInterrompidosPorTipo: { [tipo: string]: number } = {};

    const tipos: TipoSenha[] = ['prioridade', 'contratual', 'normal'];

    for (const tipo of tipos) {
      const atendimentosTipo = atendimentosValidos.filter(a => a.tipo === tipo);
      const atendimentosInterrompidosTipo = atendimentos1h.filter(a => a.tipo === tipo && a.interrompido);

      nAmostrasPorTipo[tipo] = atendimentosTipo.length;
      nInterrompidosPorTipo[tipo] = atendimentosInterrompidosTipo.length;

      if (atendimentosTipo.length === 0) {
        muPorTipo[tipo] = 0;
        tempoMedioPorTipo[tipo] = 0;
        continue;
      }

      // Tempo total de atendimento
      const tempoTotalMs = atendimentosTipo.reduce((sum, a) => sum + a.tempoAtendimentoMs, 0);
      const tempoMedioMs = tempoTotalMs / atendimentosTipo.length;

      tempoMedioPorTipo[tipo] = tempoMedioMs;

      // μ = atendimentos/hora
      // Fórmula: μ = n_atendimentos / (tempo_total_horas)
      // Tempo total em horas = (tempo_total_ms / 1000 / 3600)
      const tempoTotalHoras = tempoTotalMs / 1000 / 3600;

      // Taxa de atendimento por hora
      const muRaw = tempoTotalHoras > 0 ? atendimentosTipo.length / tempoTotalHoras : 0;

      // Aplicar EWMA se houver μ anterior para esta hora
      const muAnterior = this.muAtual.get(hora)?.mu[tipo] ?? muRaw;
      const muEWMA = this.ewmaAlpha * muRaw + (1 - this.ewmaAlpha) * muAnterior;

      muPorTipo[tipo] = Math.max(0, muEWMA);
    }

    // μ global
    const muGlobal = Object.values(muPorTipo).reduce((sum, val) => sum + val, 0);

    // μ por guichê
    const muPorGuiche: { [guicheId: string]: number } = {};
    const guichesUnicos = [...new Set(atendimentosValidos.map(a => a.guicheId).filter(Boolean))];

    for (const guicheId of guichesUnicos) {
      if (!guicheId) continue;

      const atendimentosGuiche = atendimentosValidos.filter(a => a.guicheId === guicheId);

      if (atendimentosGuiche.length === 0) {
        muPorGuiche[guicheId] = 0;
        continue;
      }

      const tempoTotalMs = atendimentosGuiche.reduce((sum, a) => sum + a.tempoAtendimentoMs, 0);
      const tempoTotalHoras = tempoTotalMs / 1000 / 3600;

      muPorGuiche[guicheId] = tempoTotalHoras > 0 ? atendimentosGuiche.length / tempoTotalHoras : 0;
    }

    // Confiabilidade baseada no número de amostras
    const totalAmostras = Object.values(nAmostrasPorTipo).reduce((sum, val) => sum + val, 0);
    const confiabilidade = this.calcularConfiabilidade(totalAmostras);

    const resultado: MuPorHora = {
      hora,
      mu: muPorTipo,
      muGlobal,
      muPorGuiche,
      tempoMedioAtendimentoMs: tempoMedioPorTipo,
      nAmostras: nAmostrasPorTipo,
      nInterrompidos: nInterrompidosPorTipo,
      confiabilidade,
      timestamp: agora
    };

    this.muAtual.set(hora, resultado);

    return resultado;
  }

  /**
   * Calcula confiabilidade baseado no número de amostras
   */
  private calcularConfiabilidade(nAmostras: number): 'alta' | 'media' | 'baixa' {
    if (nAmostras >= this.CONFIABILIDADE_ALTA) {
      return 'alta';
    } else if (nAmostras >= this.CONFIABILIDADE_MEDIA) {
      return 'media';
    } else {
      return 'baixa';
    }
  }

  /**
   * Remove atendimentos antigos (> 24h)
   */
  private limparHistoricoAntigo(): void {
    const limite = Date.now() - (24 * 60 * 60 * 1000); // 24h
    this.atendimentos = this.atendimentos.filter(a => a.timestamp >= limite);
  }

  /**
   * Obtém μ armazenado para uma hora específica
   */
  public getMuPorHora(hora: number): MuPorHora | null {
    return this.muAtual.get(hora) ?? null;
  }

  /**
   * Obtém todas as estatísticas μ armazenadas (últimas 24h)
   */
  public getTodosMus(): MuPorHora[] {
    return Array.from(this.muAtual.values());
  }

  /**
   * Calcula tempo médio de atendimento por tipo (útil para estimativaServicoMs)
   * @param tipo Tipo de senha
   * @returns Tempo médio em ms, ou null se não houver dados
   */
  public getTempoMedioAtendimento(tipo: TipoSenha): number | null {
    const horaAtual = new Date().getHours();
    const mu = this.muAtual.get(horaAtual);

    if (!mu || !mu.tempoMedioAtendimentoMs[tipo]) {
      // Fallback: média global de todas as horas
      const tempos: number[] = [];
      this.muAtual.forEach(muPorHora => {
        if (muPorHora.tempoMedioAtendimentoMs[tipo]) {
          tempos.push(muPorHora.tempoMedioAtendimentoMs[tipo]);
        }
      });

      if (tempos.length === 0) return null;

      return tempos.reduce((sum, t) => sum + t, 0) / tempos.length;
    }

    return mu.tempoMedioAtendimentoMs[tipo];
  }

  /**
   * Calcula ρ = λ/μ (fator de utilização)
   * @param lambda Taxa de chegadas
   * @param tipo Tipo de senha
   * @returns Fator de utilização (0-1: estável, >1: instável)
   */
  public calcularRho(lambda: number, tipo?: TipoSenha): number {
    const horaAtual = new Date().getHours();
    const mu = this.muAtual.get(horaAtual);

    if (!mu) return 0;

    const muValor = tipo ? (mu.mu[tipo] || 0) : mu.muGlobal;

    if (muValor === 0) return Infinity;

    return lambda / muValor;
  }

  /**
   * Exporta dados para persistência
   */
  public exportar(): {
    atendimentos: AtendimentoRegistro[];
    muAtual: { [hora: number]: MuPorHora };
  } {
    const muMap: { [hora: number]: MuPorHora } = {};
    this.muAtual.forEach((value, key) => {
      muMap[key] = value;
    });

    return {
      atendimentos: this.atendimentos,
      muAtual: muMap
    };
  }

  /**
   * Importa dados de persistência
   */
  public importar(dados: {
    atendimentos?: AtendimentoRegistro[];
    muAtual?: { [hora: number]: MuPorHora };
  }): void {
    if (dados.atendimentos) {
      this.atendimentos = dados.atendimentos;
      this.limparHistoricoAntigo();
    }

    if (dados.muAtual) {
      this.muAtual.clear();
      Object.entries(dados.muAtual).forEach(([hora, mu]) => {
        this.muAtual.set(Number(hora), mu);
      });
    }
  }

  /**
   * Reseta todos os dados (útil para testes)
   */
  public reset(): void {
    this.atendimentos = [];
    this.muAtual.clear();
  }
}
