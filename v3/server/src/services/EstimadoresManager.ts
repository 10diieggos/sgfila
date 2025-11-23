import { EstimadorLambda, LambdaPorHora } from './EstimadorLambda';
import { EstimadorMu, MuPorHora } from './EstimadorMu';
import { EstimadorPercentis, PercentisPorHora } from './EstimadorPercentis';
import { TipoSenha } from '../../../shared/types';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

/**
 * EstimadoresManager - Gerencia estimadores estatísticos (λ, μ, percentis)
 *
 * Responsabilidades:
 * - Instanciar e gerenciar EstimadorLambda, EstimadorMu, EstimadorPercentis
 * - Registrar eventos do sistema (chegadas, atendimentos, tempos)
 * - Calcular estatísticas periodicamente
 * - Persistir dados em arquivos JSON
 * - Expor estatísticas para consumo via Socket.IO
 *
 * Referências:
 * - T-122, T-123, T-124 em proximos_passos.md
 */

export interface EstatisticasGerais {
  lambda: LambdaPorHora | null;
  mu: MuPorHora | null;
  percentis: PercentisPorHora | null;
  ultimaAtualizacao: number;
}

export class EstimadoresManager {
  private estimadorLambda: EstimadorLambda;
  private estimadorMu: EstimadorMu;
  private estimadorPercentis: EstimadorPercentis;

  // Paths de persistência
  private readonly STATS_DIR = join(process.cwd(), 'dist', 'estatisticas');
  private readonly LAMBDA_FILE = join(this.STATS_DIR, 'lambda_por_hora.json');
  private readonly MU_FILE = join(this.STATS_DIR, 'mu_por_hora.json');
  private readonly PERCENTIS_FILE = join(this.STATS_DIR, 'percentis_por_hora.json');

  // Intervalo de cálculo (1 minuto)
  private intervaloCalculo: NodeJS.Timeout | null = null;
  private readonly INTERVALO_MS = 60 * 1000; // 1 min

  constructor() {
    this.estimadorLambda = new EstimadorLambda(0.3);
    this.estimadorMu = new EstimadorMu(0.3);
    this.estimadorPercentis = new EstimadorPercentis();

    this.garantirDiretorio();
    this.carregarDados();
    this.iniciarCalculoPeriodico();
  }

  /**
   * Garante que o diretório de estatísticas existe
   */
  private garantirDiretorio(): void {
    if (!existsSync(this.STATS_DIR)) {
      mkdirSync(this.STATS_DIR, { recursive: true });
      console.log(`✅ [EstimadoresManager] Diretório criado: ${this.STATS_DIR}`);
    }
  }

  /**
   * Carrega dados persistidos dos estimadores
   */
  private carregarDados(): void {
    try {
      // Carregar Lambda
      if (existsSync(this.LAMBDA_FILE)) {
        const dadosLambda = JSON.parse(readFileSync(this.LAMBDA_FILE, 'utf8'));
        this.estimadorLambda.importar(dadosLambda);
        console.log('✅ [EstimadoresManager] Lambda carregado');
      }

      // Carregar Mu
      if (existsSync(this.MU_FILE)) {
        const dadosMu = JSON.parse(readFileSync(this.MU_FILE, 'utf8'));
        this.estimadorMu.importar(dadosMu);
        console.log('✅ [EstimadoresManager] Mu carregado');
      }

      // Carregar Percentis
      if (existsSync(this.PERCENTIS_FILE)) {
        const dadosPercentis = JSON.parse(readFileSync(this.PERCENTIS_FILE, 'utf8'));
        this.estimadorPercentis.importar(dadosPercentis);
        console.log('✅ [EstimadoresManager] Percentis carregados');
      }
    } catch (error) {
      console.error('❌ [EstimadoresManager] Erro ao carregar dados:', error);
    }
  }

  /**
   * Persiste dados dos estimadores
   */
  private salvarDados(): void {
    try {
      // Salvar Lambda
      const dadosLambda = this.estimadorLambda.exportar();
      writeFileSync(this.LAMBDA_FILE, JSON.stringify(dadosLambda, null, 2));

      // Salvar Mu
      const dadosMu = this.estimadorMu.exportar();
      writeFileSync(this.MU_FILE, JSON.stringify(dadosMu, null, 2));

      // Salvar Percentis
      const dadosPercentis = this.estimadorPercentis.exportar();
      writeFileSync(this.PERCENTIS_FILE, JSON.stringify(dadosPercentis, null, 2));

      console.log('✅ [EstimadoresManager] Dados salvos');
    } catch (error) {
      console.error('❌ [EstimadoresManager] Erro ao salvar dados:', error);
    }
  }

  /**
   * Inicia cálculo periódico de estatísticas
   */
  private iniciarCalculoPeriodico(): void {
    if (this.intervaloCalculo) {
      clearInterval(this.intervaloCalculo);
    }

    this.intervaloCalculo = setInterval(() => {
      this.calcularEstatisticas();
      this.salvarDados();
    }, this.INTERVALO_MS);

    console.log(`✅ [EstimadoresManager] Cálculo periódico iniciado (${this.INTERVALO_MS}ms)`);
  }

  /**
   * Para o cálculo periódico
   */
  public pararCalculoPeriodico(): void {
    if (this.intervaloCalculo) {
      clearInterval(this.intervaloCalculo);
      this.intervaloCalculo = null;
      console.log('✅ [EstimadoresManager] Cálculo periódico parado');
    }
  }

  /**
   * Calcula estatísticas de todos os estimadores
   */
  private calcularEstatisticas(): void {
    this.estimadorLambda.calcularLambda();
    this.estimadorMu.calcularMu();
    this.estimadorPercentis.calcularPercentis();
  }

  // ============================================================================
  // MÉTODOS PÚBLICOS - Registro de Eventos
  // ============================================================================

  /**
   * Registra chegada de senha (emissão)
   */
  public registrarChegada(tipo: TipoSenha, servicoDoCliente: string): void {
    this.estimadorLambda.registrarChegada(tipo, servicoDoCliente);
  }

  /**
   * Registra atendimento finalizado
   */
  public registrarAtendimento(
    tipo: TipoSenha,
    servicoDoCliente: string,
    tempoAtendimentoMs: number,
    guicheId?: string,
    interrompido: boolean = false
  ): void {
    this.estimadorMu.registrarAtendimento(
      tipo,
      servicoDoCliente,
      tempoAtendimentoMs,
      guicheId,
      interrompido
    );
  }

  /**
   * Registra tempo de espera (quando senha é chamada)
   */
  public registrarTempoEspera(
    tipo: TipoSenha,
    servicoDoCliente: string,
    tempoEsperaMs: number,
    guicheId?: string
  ): void {
    this.estimadorPercentis.registrarTempoEspera(tipo, servicoDoCliente, tempoEsperaMs, guicheId);
  }

  /**
   * Registra tempo de atendimento no estimador de percentis
   */
  public registrarTempoAtendimentoPercentil(
    tipo: TipoSenha,
    servicoDoCliente: string,
    tempoAtendimentoMs: number,
    guicheId?: string
  ): void {
    this.estimadorPercentis.registrarTempoAtendimento(
      tipo,
      servicoDoCliente,
      tempoAtendimentoMs,
      guicheId
    );
  }

  // ============================================================================
  // MÉTODOS PÚBLICOS - Consulta de Estatísticas
  // ============================================================================

  /**
   * Retorna estatísticas gerais atualizadas
   */
  public getEstatisticas(): EstatisticasGerais {
    const horaAtual = new Date().getHours();

    return {
      lambda: this.estimadorLambda.getLambdaPorHora(horaAtual),
      mu: this.estimadorMu.getMuPorHora(horaAtual),
      percentis: this.estimadorPercentis.getPercentisPorHora(horaAtual),
      ultimaAtualizacao: Date.now()
    };
  }

  /**
   * Retorna lambda para hora específica
   */
  public getLambda(hora?: number): LambdaPorHora | null {
    const h = hora ?? new Date().getHours();
    return this.estimadorLambda.getLambdaPorHora(h);
  }

  /**
   * Retorna mu para hora específica
   */
  public getMu(hora?: number): MuPorHora | null {
    const h = hora ?? new Date().getHours();
    return this.estimadorMu.getMuPorHora(h);
  }

  /**
   * Retorna percentis para hora específica
   */
  public getPercentis(hora?: number): PercentisPorHora | null {
    const h = hora ?? new Date().getHours();
    return this.estimadorPercentis.getPercentisPorHora(h);
  }

  /**
   * Retorna tempo médio de atendimento por tipo (para IAManager)
   */
  public getTempoMedioAtendimento(tipo: TipoSenha): number | null {
    return this.estimadorMu.getTempoMedioAtendimento(tipo);
  }

  /**
   * Retorna percentil de espera por tipo
   */
  public getPercentilEspera(tipo: TipoSenha, percentil: 50 | 95 | 99): number | null {
    return this.estimadorPercentis.getPercentilEspera(tipo, percentil);
  }

  /**
   * Calcula fator de utilização ρ = λ/μ
   */
  public calcularRho(tipo?: TipoSenha): number {
    const horaAtual = new Date().getHours();
    const lambda = this.estimadorLambda.getLambdaPorHora(horaAtual);
    const mu = this.estimadorMu.getMuPorHora(horaAtual);

    if (!lambda || !mu) return 0;

    const lambdaValor = tipo ? (lambda.lambda[tipo] || 0) : lambda.lambdaGlobal;
    const muValor = tipo ? (mu.mu[tipo] || 0) : mu.muGlobal;

    return this.estimadorMu.calcularRho(lambdaValor, tipo);
  }

  /**
   * Retorna todas as estatísticas das últimas 24h
   */
  public getTodosLambdas(): LambdaPorHora[] {
    return this.estimadorLambda.getTodosLambdas();
  }

  public getTodosMus(): MuPorHora[] {
    return this.estimadorMu.getTodosMus();
  }

  public getTodosPercentis(): PercentisPorHora[] {
    return this.estimadorPercentis.getTodosPercentis();
  }

  /**
   * Força cálculo imediato e persistência
   */
  public atualizarAgora(): void {
    this.calcularEstatisticas();
    this.salvarDados();
  }

  /**
   * Reseta todos os estimadores (útil para testes ou reinício de dia)
   */
  public resetar(): void {
    this.estimadorLambda.reset();
    this.estimadorMu.reset();
    this.estimadorPercentis.reset();
    this.salvarDados();
    console.log('✅ [EstimadoresManager] Todos os estimadores resetados');
  }
}
