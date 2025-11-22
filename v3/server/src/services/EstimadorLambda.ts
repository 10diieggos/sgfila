import { TipoSenha } from '../../../shared/types';

/**
 * EstimadorLambda - Estimador de taxa de chegadas (λ) por hora
 *
 * Implementa:
 * - Janelas móveis de 15min e 1h
 * - EWMA (Exponentially Weighted Moving Average) para suavização
 * - Winsorização p1/p99 para robustez a outliers
 * - Separação por tipo de serviço
 *
 * Fórmula:
 *   λ(h) = EWMA( contagem_chegadas_janela / duração_janela_horas )
 *   EWMA(t) = α × valor(t) + (1-α) × EWMA(t-1)
 *
 * Referências:
 * - T-104 em proximos_passos.md
 * - Teoria de filas: Kendall's notation M/M/c
 */

export interface ChegadaRegistro {
  timestamp: number;
  tipo: TipoSenha;
  servicoDoCliente: string;
}

export interface LambdaPorHora {
  hora: number; // 0-23
  lambda: { [tipo: string]: number }; // chegadas/hora por tipo
  lambdaGlobal: number; // total de chegadas/hora
  nAmostras: { [tipo: string]: number }; // número de amostras por tipo
  confiabilidade: 'alta' | 'media' | 'baixa';
  timestamp: number;
}

export class EstimadorLambda {
  private chegadas: ChegadaRegistro[] = [];
  private ewmaAlpha: number;
  private janela15min: number = 15 * 60 * 1000; // 15 min em ms
  private janela1h: number = 60 * 60 * 1000; // 1h em ms
  private lambdaAtual: Map<number, LambdaPorHora> = new Map(); // hora -> lambda

  // Thresholds de confiabilidade
  private readonly CONFIABILIDADE_ALTA = 30;
  private readonly CONFIABILIDADE_MEDIA = 10;

  // Percentis para winsorização
  private readonly P1 = 0.01;
  private readonly P99 = 0.99;

  constructor(alpha: number = 0.3) {
    this.ewmaAlpha = alpha;
  }

  /**
   * Registra uma nova chegada (senha emitida)
   */
  public registrarChegada(tipo: TipoSenha, servicoDoCliente: string): void {
    const chegada: ChegadaRegistro = {
      timestamp: Date.now(),
      tipo,
      servicoDoCliente
    };

    this.chegadas.push(chegada);
    this.limparHistoricoAntigo();
  }

  /**
   * Calcula λ(h) para a hora atual
   * @param horaAtual Hora atual (0-23)
   * @returns Lambda estimado por tipo e global
   */
  public calcularLambda(horaAtual?: number): LambdaPorHora {
    const agora = Date.now();
    const hora = horaAtual ?? new Date(agora).getHours();

    // Janelas de tempo
    const inicio15min = agora - this.janela15min;
    const inicio1h = agora - this.janela1h;

    // Filtrar chegadas na janela de 1h
    const chegadas1h = this.chegadas.filter(c => c.timestamp >= inicio1h);
    const chegadas15min = this.chegadas.filter(c => c.timestamp >= inicio15min);

    // Calcular λ por tipo
    const lambdaPorTipo: { [tipo: string]: number } = {};
    const nAmostrasPorTipo: { [tipo: string]: number } = {};

    const tipos: TipoSenha[] = ['prioridade', 'contratual', 'normal'];

    for (const tipo of tipos) {
      const chegadasTipo1h = chegadas1h.filter(c => c.tipo === tipo);
      const chegadasTipo15min = chegadas15min.filter(c => c.tipo === tipo);

      // Usar janela de 15min para cálculo mais recente, 1h para contexto
      const nAmostras15min = chegadasTipo15min.length;
      const nAmostras1h = chegadasTipo1h.length;

      nAmostrasPorTipo[tipo] = nAmostras1h;

      if (nAmostras15min === 0 && nAmostras1h === 0) {
        lambdaPorTipo[tipo] = 0;
        continue;
      }

      // Taxa de chegadas por hora (extrapolando de 15min)
      let taxaBruta15min = (nAmostras15min / 15) * 60; // chegadas/hora
      let taxaBruta1h = nAmostras1h; // já está em chegadas/hora

      // Winsorização: limitar outliers
      const taxaWinsorizada = this.winsorizar(
        taxaBruta15min,
        taxaBruta1h,
        nAmostras15min,
        nAmostras1h
      );

      // Aplicar EWMA se houver λ anterior para esta hora
      const lambdaAnterior = this.lambdaAtual.get(hora)?.lambda[tipo] ?? taxaWinsorizada;
      const lambdaEWMA = this.ewmaAlpha * taxaWinsorizada + (1 - this.ewmaAlpha) * lambdaAnterior;

      lambdaPorTipo[tipo] = Math.max(0, lambdaEWMA);
    }

    // Lambda global
    const lambdaGlobal = Object.values(lambdaPorTipo).reduce((sum, val) => sum + val, 0);

    // Confiabilidade baseada no número de amostras
    const totalAmostras = Object.values(nAmostrasPorTipo).reduce((sum, val) => sum + val, 0);
    const confiabilidade = this.calcularConfiabilidade(totalAmostras);

    const resultado: LambdaPorHora = {
      hora,
      lambda: lambdaPorTipo,
      lambdaGlobal,
      nAmostras: nAmostrasPorTipo,
      confiabilidade,
      timestamp: agora
    };

    this.lambdaAtual.set(hora, resultado);

    return resultado;
  }

  /**
   * Winsorização: limita valores extremos usando percentis
   * @param valor15min Taxa calculada da janela de 15min
   * @param valor1h Taxa calculada da janela de 1h
   * @param n15min Número de amostras de 15min
   * @param n1h Número de amostras de 1h
   * @returns Valor winsorizado
   */
  private winsorizar(valor15min: number, valor1h: number, n15min: number, n1h: number): number {
    // Se poucas amostras, usar valor sem winsorização
    if (n15min < 5 && n1h < 20) {
      return valor15min;
    }

    // Usar média ponderada entre 15min (mais recente) e 1h (mais estável)
    const peso15min = Math.min(n15min / 10, 0.7); // Max 70% de peso
    const peso1h = 1 - peso15min;

    const valorPonderado = peso15min * valor15min + peso1h * valor1h;

    // Limitar outliers: não permitir valores > 3× o valor de 1h (se houver dados)
    if (n1h >= 10 && valorPonderado > 3 * valor1h) {
      return 3 * valor1h;
    }

    return valorPonderado;
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
   * Remove chegadas antigas (> 24h)
   */
  private limparHistoricoAntigo(): void {
    const limite = Date.now() - (24 * 60 * 60 * 1000); // 24h
    this.chegadas = this.chegadas.filter(c => c.timestamp >= limite);
  }

  /**
   * Obtém λ armazenado para uma hora específica
   */
  public getLambdaPorHora(hora: number): LambdaPorHora | null {
    return this.lambdaAtual.get(hora) ?? null;
  }

  /**
   * Obtém todas as estatísticas λ armazenadas (últimas 24h)
   */
  public getTodosLambdas(): LambdaPorHora[] {
    return Array.from(this.lambdaAtual.values());
  }

  /**
   * Exporta dados para persistência
   */
  public exportar(): {
    chegadas: ChegadaRegistro[];
    lambdaAtual: { [hora: number]: LambdaPorHora };
  } {
    const lambdaMap: { [hora: number]: LambdaPorHora } = {};
    this.lambdaAtual.forEach((value, key) => {
      lambdaMap[key] = value;
    });

    return {
      chegadas: this.chegadas,
      lambdaAtual: lambdaMap
    };
  }

  /**
   * Importa dados de persistência
   */
  public importar(dados: {
    chegadas?: ChegadaRegistro[];
    lambdaAtual?: { [hora: number]: LambdaPorHora };
  }): void {
    if (dados.chegadas) {
      this.chegadas = dados.chegadas;
      this.limparHistoricoAntigo();
    }

    if (dados.lambdaAtual) {
      this.lambdaAtual.clear();
      Object.entries(dados.lambdaAtual).forEach(([hora, lambda]) => {
        this.lambdaAtual.set(Number(hora), lambda);
      });
    }
  }

  /**
   * Reseta todos os dados (útil para testes)
   */
  public reset(): void {
    this.chegadas = [];
    this.lambdaAtual.clear();
  }
}
