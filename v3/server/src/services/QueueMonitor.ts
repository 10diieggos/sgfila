/**
 * QueueMonitor - Monitoramento e verificação automática de filas
 * v3.2 - Sistema de Correção de Distorções
 * SGFILA v3.0
 */

import { QueueService } from './QueueService.js';
import { StateManager } from './StateManager.js';

export class QueueMonitor {
  private static instance: QueueMonitor;
  private queueService: QueueService;
  private stateManager: StateManager;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  private constructor() {
    this.queueService = new QueueService();
    this.stateManager = StateManager.getInstance();
  }

  public static getInstance(): QueueMonitor {
    if (!QueueMonitor.instance) {
      QueueMonitor.instance = new QueueMonitor();
    }
    return QueueMonitor.instance;
  }

  /**
   * Inicia monitoramento híbrido baseado na configuração
   */
  public iniciar(): void {
    if (this.isRunning) {
      console.log('[QueueMonitor] Já está rodando');
      return;
    }

    const config = this.stateManager.getEstado().configuracoes.correcoes;

    if (config.frequenciaVerificacao === 'tempo_real') {
      // Tempo real: verifica a cada X segundos (baseado em intervaloVerificacaoMinutos)
      const intervaloMs = config.intervaloVerificacaoMinutos * 60 * 1000;

      this.intervalId = setInterval(() => {
        this.executarVerificacao();
      }, intervaloMs);

      this.isRunning = true;
      console.log(`[QueueMonitor] Iniciado em modo TEMPO_REAL (${config.intervaloVerificacaoMinutos}min)`);
    } else if (config.frequenciaVerificacao === 'por_minuto') {
      // Por minuto: verifica no intervalo configurado
      const intervaloMs = config.intervaloVerificacaoMinutos * 60 * 1000;

      this.intervalId = setInterval(() => {
        this.executarVerificacao();
      }, intervaloMs);

      this.isRunning = true;
      console.log(`[QueueMonitor] Iniciado em modo POR_MINUTO (${config.intervaloVerificacaoMinutos}min)`);
    } else {
      // Por chamada: não precisa de interval
      console.log('[QueueMonitor] Modo POR_CHAMADA (verificação apenas ao chamar senha)');
    }
  }

  /**
   * Para o monitoramento
   */
  public parar(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[QueueMonitor] Parado');
  }

  /**
   * Reinicia o monitoramento (útil quando configuração muda)
   */
  public reiniciar(): void {
    console.log('[QueueMonitor] Reiniciando...');
    this.parar();
    this.iniciar();
  }

  /**
   * Executa verificação de tempos limite
   */
  private executarVerificacao(): void {
    try {
      const corrigidas = this.queueService.verificarTemposLimite();

      if (corrigidas > 0) {
        console.log(`[QueueMonitor] Verificação executada: ${corrigidas} senha(s) corrigida(s)`);
      }
    } catch (error) {
      console.error('[QueueMonitor] Erro ao executar verificação:', error);
    }
  }

  /**
   * Status do monitor
   */
  public getStatus(): { rodando: boolean; modo: string } {
    const config = this.stateManager.getEstado().configuracoes.correcoes;
    return {
      rodando: this.isRunning,
      modo: config.frequenciaVerificacao
    };
  }
}
