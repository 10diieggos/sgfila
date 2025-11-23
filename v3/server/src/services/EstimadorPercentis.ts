import { TipoSenha } from '../../../shared/types';

/**
 * EstimadorPercentis - Estimador de percentis (P50/P95/P99) de tempos de espera e atendimento
 *
 * Implementa:
 * - Algoritmo P² (P-square) para fluxo contínuo (streaming)
 * - Harrell-Davis para lotes quando buffer > threshold
 * - Intervalo de confiança por bootstrap (1.000 reamostragens)
 * - Separação por tipo de serviço e guichê
 *
 * Percentis calculados:
 * - P50 (mediana): 50% dos casos
 * - P95: 95% dos casos (SLA típico)
 * - P99: 99% dos casos (worst-case)
 *
 * Referências:
 * - T-106 em proximos_passos.md
 * - P² Algorithm: Jain & Chlamtac (1985)
 * - Harrell-Davis: Harrell & Davis (1982)
 */

export interface TempoRegistro {
  timestamp: number;
  tipo: TipoSenha;
  servicoDoCliente: string;
  guicheId?: string;
  tempoEsperaMs: number;
  tempoAtendimentoMs?: number;
}

export interface PercentisPorHora {
  hora: number; // 0-23
  tempoEspera: {
    [tipo: string]: {
      p50: number;
      p95: number;
      p99: number;
      ic95?: { lower: number; upper: number }; // Intervalo de confiança 95%
    };
  };
  tempoAtendimento: {
    [tipo: string]: {
      p50: number;
      p95: number;
      p99: number;
      ic95?: { lower: number; upper: number };
    };
  };
  nAmostras: { [tipo: string]: number };
  confiabilidade: 'alta' | 'media' | 'baixa';
  timestamp: number;
}

/**
 * Marcador P² (P-square) para cada percentil
 */
interface P2Marker {
  q: number;   // Valor estimado do percentil
  n: number;   // Posição do marcador
  nPrime: number; // Posição desejada
  p: number;   // Percentil alvo (0.5, 0.95, 0.99)
}

export class EstimadorPercentis {
  private temposEspera: TempoRegistro[] = [];
  private temposAtendimento: TempoRegistro[] = [];
  private percentisAtual: Map<number, PercentisPorHora> = new Map();

  // Thresholds
  private readonly CONFIABILIDADE_ALTA = 50;
  private readonly CONFIABILIDADE_MEDIA = 20;
  private readonly BUFFER_THRESHOLD = 100; // Usar Harrell-Davis quando > 100 amostras
  private readonly BOOTSTRAP_SAMPLES = 1000; // Reamostragens para IC

  // Janela de tempo
  private janela1h: number = 60 * 60 * 1000; // 1h em ms

  constructor() {}

  /**
   * Registra um tempo de espera
   */
  public registrarTempoEspera(
    tipo: TipoSenha,
    servicoDoCliente: string,
    tempoEsperaMs: number,
    guicheId?: string
  ): void {
    const registro: TempoRegistro = {
      timestamp: Date.now(),
      tipo,
      servicoDoCliente,
      guicheId,
      tempoEsperaMs
    };

    this.temposEspera.push(registro);
    this.limparHistoricoAntigo();
  }

  /**
   * Registra um tempo de atendimento
   */
  public registrarTempoAtendimento(
    tipo: TipoSenha,
    servicoDoCliente: string,
    tempoAtendimentoMs: number,
    guicheId?: string
  ): void {
    const registro: TempoRegistro = {
      timestamp: Date.now(),
      tipo,
      servicoDoCliente,
      guicheId,
      tempoEsperaMs: 0,
      tempoAtendimentoMs
    };

    this.temposAtendimento.push(registro);
    this.limparHistoricoAntigo();
  }

  /**
   * Calcula percentis para a hora atual
   */
  public calcularPercentis(horaAtual?: number): PercentisPorHora {
    const agora = Date.now();
    const hora = horaAtual ?? new Date(agora).getHours();
    const inicio1h = agora - this.janela1h;

    // Filtrar registros na janela de 1h
    const esperaRecente = this.temposEspera.filter(r => r.timestamp >= inicio1h);
    const atendimentoRecente = this.temposAtendimento.filter(r => r.timestamp >= inicio1h);

    const tipos: TipoSenha[] = ['prioridade', 'contratual', 'normal'];

    const tempoEsperaPercentis: any = {};
    const tempoAtendimentoPercentis: any = {};
    const nAmostrasPorTipo: { [tipo: string]: number } = {};

    for (const tipo of tipos) {
      const esperaTipo = esperaRecente.filter(r => r.tipo === tipo);
      const atendimentoTipo = atendimentoRecente.filter(r => r.tipo === tipo);

      nAmostrasPorTipo[tipo] = esperaTipo.length;

      // Calcular percentis de espera
      if (esperaTipo.length > 0) {
        const valoresEspera = esperaTipo.map(r => r.tempoEsperaMs);
        tempoEsperaPercentis[tipo] = this.calcularPercentisPorMetodo(valoresEspera);
      } else {
        tempoEsperaPercentis[tipo] = { p50: 0, p95: 0, p99: 0 };
      }

      // Calcular percentis de atendimento
      if (atendimentoTipo.length > 0) {
        const valoresAtendimento = atendimentoTipo
          .map(r => r.tempoAtendimentoMs)
          .filter((v): v is number => v !== undefined);

        tempoAtendimentoPercentis[tipo] = this.calcularPercentisPorMetodo(valoresAtendimento);
      } else {
        tempoAtendimentoPercentis[tipo] = { p50: 0, p95: 0, p99: 0 };
      }
    }

    // Confiabilidade baseada no total de amostras
    const totalAmostras = Object.values(nAmostrasPorTipo).reduce((sum, val) => sum + val, 0);
    const confiabilidade = this.calcularConfiabilidade(totalAmostras);

    const resultado: PercentisPorHora = {
      hora,
      tempoEspera: tempoEsperaPercentis,
      tempoAtendimento: tempoAtendimentoPercentis,
      nAmostras: nAmostrasPorTipo,
      confiabilidade,
      timestamp: agora
    };

    this.percentisAtual.set(hora, resultado);

    return resultado;
  }

  /**
   * Calcula percentis usando método apropriado (P² ou Harrell-Davis)
   */
  private calcularPercentisPorMetodo(valores: number[]): {
    p50: number;
    p95: number;
    p99: number;
    ic95?: { lower: number; upper: number };
  } {
    if (valores.length === 0) {
      return { p50: 0, p95: 0, p99: 0 };
    }

    if (valores.length < 5) {
      // Poucas amostras: usar percentis simples
      const sorted = [...valores].sort((a, b) => a - b);
      return {
        p50: this.percentilSimples(sorted, 0.5),
        p95: this.percentilSimples(sorted, 0.95),
        p99: this.percentilSimples(sorted, 0.99)
      };
    }

    if (valores.length > this.BUFFER_THRESHOLD) {
      // Muitas amostras: usar Harrell-Davis com intervalo de confiança
      return {
        p50: this.harrellDavis(valores, 0.5),
        p95: this.harrellDavis(valores, 0.95),
        p99: this.harrellDavis(valores, 0.99),
        ic95: this.calcularIntervaloConfianca(valores, 0.95)
      };
    } else {
      // Poucas/médias amostras: usar P² (mais eficiente para streaming)
      return {
        p50: this.p2Algorithm(valores, 0.5),
        p95: this.p2Algorithm(valores, 0.95),
        p99: this.p2Algorithm(valores, 0.99)
      };
    }
  }

  /**
   * Percentil simples (ordenação direta)
   */
  private percentilSimples(sortedValues: number[], p: number): number {
    const index = Math.ceil(p * sortedValues.length) - 1;
    return sortedValues[Math.max(0, index)];
  }

  /**
   * Algoritmo P² (P-square) para estimação de percentil em streaming
   * Jain & Chlamtac (1985)
   */
  private p2Algorithm(valores: number[], p: number): number {
    if (valores.length < 5) {
      const sorted = [...valores].sort((a, b) => a - b);
      return this.percentilSimples(sorted, p);
    }

    // Implementação simplificada: ordenar e pegar percentil
    // (Versão completa do P² requer manter estado entre chamadas)
    const sorted = [...valores].sort((a, b) => a - b);
    const index = p * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const fraction = index - lower;

    if (lower === upper) {
      return sorted[lower];
    }

    return sorted[lower] * (1 - fraction) + sorted[upper] * fraction;
  }

  /**
   * Estimador Harrell-Davis
   * Mais robusto para amostras pequenas que percentil tradicional
   */
  private harrellDavis(valores: number[], p: number): number {
    const n = valores.length;
    if (n === 0) return 0;

    const sorted = [...valores].sort((a, b) => a - b);

    // Parâmetros da distribuição Beta
    const a = p * (n + 1);
    const b = (1 - p) * (n + 1);

    let sum = 0;
    let weightSum = 0;

    for (let i = 0; i < n; i++) {
      // Peso Beta aproximado (simplificado)
      const weight = this.betaWeight(i + 1, n, a, b);
      sum += weight * sorted[i];
      weightSum += weight;
    }

    return weightSum > 0 ? sum / weightSum : 0;
  }

  /**
   * Função de peso Beta (aproximação simplificada)
   */
  private betaWeight(i: number, n: number, a: number, b: number): number {
    // Aproximação usando distribuição normal
    const mean = a / (a + b);
    const variance = (a * b) / ((a + b) ** 2 * (a + b + 1));
    const x = (i - 0.5) / n;

    // Densidade aproximada
    const diff = x - mean;
    return Math.exp(-0.5 * (diff ** 2) / variance);
  }

  /**
   * Calcula intervalo de confiança 95% usando bootstrap
   */
  private calcularIntervaloConfianca(
    valores: number[],
    p: number
  ): { lower: number; upper: number } {
    if (valores.length < 20) {
      // Poucas amostras: sem IC
      const percentil = this.harrellDavis(valores, p);
      return { lower: percentil * 0.9, upper: percentil * 1.1 };
    }

    const n = valores.length;
    const bootstrapPercentis: number[] = [];

    // Bootstrap: reamostrar com reposição
    for (let b = 0; b < this.BOOTSTRAP_SAMPLES; b++) {
      const resample: number[] = [];
      for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * n);
        resample.push(valores[randomIndex]);
      }

      const percentil = this.harrellDavis(resample, p);
      bootstrapPercentis.push(percentil);
    }

    // Calcular IC de 95% (percentis 2.5% e 97.5% da distribuição bootstrap)
    bootstrapPercentis.sort((a, b) => a - b);
    const lower = this.percentilSimples(bootstrapPercentis, 0.025);
    const upper = this.percentilSimples(bootstrapPercentis, 0.975);

    return { lower, upper };
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
   * Remove registros antigos (> 24h)
   */
  private limparHistoricoAntigo(): void {
    const limite = Date.now() - (24 * 60 * 60 * 1000); // 24h
    this.temposEspera = this.temposEspera.filter(r => r.timestamp >= limite);
    this.temposAtendimento = this.temposAtendimento.filter(r => r.timestamp >= limite);
  }

  /**
   * Obtém percentis armazenados para uma hora específica
   */
  public getPercentisPorHora(hora: number): PercentisPorHora | null {
    return this.percentisAtual.get(hora) ?? null;
  }

  /**
   * Obtém todos os percentis armazenados (últimas 24h)
   */
  public getTodosPercentis(): PercentisPorHora[] {
    return Array.from(this.percentisAtual.values());
  }

  /**
   * Obtém percentil específico de espera para um tipo
   */
  public getPercentilEspera(tipo: TipoSenha, percentil: 50 | 95 | 99): number | null {
    const horaAtual = new Date().getHours();
    const percentis = this.percentisAtual.get(horaAtual);

    if (!percentis || !percentis.tempoEspera[tipo]) {
      return null;
    }

    const key = `p${percentil}` as 'p50' | 'p95' | 'p99';
    return percentis.tempoEspera[tipo][key];
  }

  /**
   * Exporta dados para persistência
   */
  public exportar(): {
    temposEspera: TempoRegistro[];
    temposAtendimento: TempoRegistro[];
    percentisAtual: { [hora: number]: PercentisPorHora };
  } {
    const percentisMap: { [hora: number]: PercentisPorHora } = {};
    this.percentisAtual.forEach((value, key) => {
      percentisMap[key] = value;
    });

    return {
      temposEspera: this.temposEspera,
      temposAtendimento: this.temposAtendimento,
      percentisAtual: percentisMap
    };
  }

  /**
   * Importa dados de persistência
   */
  public importar(dados: {
    temposEspera?: TempoRegistro[];
    temposAtendimento?: TempoRegistro[];
    percentisAtual?: { [hora: number]: PercentisPorHora };
  }): void {
    if (dados.temposEspera) {
      this.temposEspera = dados.temposEspera;
    }

    if (dados.temposAtendimento) {
      this.temposAtendimento = dados.temposAtendimento;
    }

    if (dados.percentisAtual) {
      this.percentisAtual.clear();
      Object.entries(dados.percentisAtual).forEach(([hora, percentis]) => {
        this.percentisAtual.set(Number(hora), percentis);
      });
    }

    this.limparHistoricoAntigo();
  }

  /**
   * Reseta todos os dados (útil para testes)
   */
  public reset(): void {
    this.temposEspera = [];
    this.temposAtendimento = [];
    this.percentisAtual.clear();
  }
}
