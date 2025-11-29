/**
 * SocketHandlers - Gerenciamento de eventos Socket.IO
 * SGFILA v3.0
 */

import type { Socket, Server as SocketIOServer } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../shared/types';
import { StateManager } from '../services/StateManager.js';
import { QueueService } from '../services/QueueService.js';
import { StatisticsService } from '../services/StatisticsService.js';
import { AdvancedStatisticsService } from '../services/AdvancedStatisticsService.js';
import { StatisticsAggregator } from '../services/StatisticsAggregator.js';
import { StatisticsPersistence } from '../services/StatisticsPersistence.js';
import { QueueMonitor } from '../services/QueueMonitor.js';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export class SocketHandlers {
  private stateManager: StateManager;
  private queueService: QueueService;
  private queueMonitor: QueueMonitor;
  private io: TypedServer;
  private useAdvancedStats: boolean;
  private statisticsPersistence: StatisticsPersistence | null = null;
  private statisticsAggregator: StatisticsAggregator | null = null;

  constructor(
    io: TypedServer,
    useAdvancedStats: boolean = false,
    statisticsPersistence?: StatisticsPersistence
  ) {
    this.io = io;
    this.stateManager = StateManager.getInstance();
    this.queueService = new QueueService();
    this.queueMonitor = QueueMonitor.getInstance();
    this.useAdvancedStats = useAdvancedStats;

    // Configura persistência de estatísticas se fornecida
    if (statisticsPersistence) {
      this.statisticsPersistence = statisticsPersistence;
      this.statisticsAggregator = new StatisticsAggregator(statisticsPersistence);
    }

    // Inicia monitoramento de correções (v3.2)
    this.queueMonitor.iniciar();
  }

  /**
   * Emite estado atualizado para todos os clientes
   */
  private emitirEstadoAtualizado(): void {
    const estado = this.stateManager.getEstado();

    // Usa estatísticas avançadas se habilitado, senão usa básicas
    const estatisticas = this.useAdvancedStats
      ? AdvancedStatisticsService.calcularEstatisticasAvancadas(estado)
      : StatisticsService.calcularEstatisticas(estado);

    this.io.emit('estadoAtualizado', { estado, estatisticas });

    // [T-130] Emitir estatísticas dos estimadores (λ, μ, percentis)
    try {
      const estatisticasEstimadores = this.stateManager.getEstatisticas();
      this.io.emit('estatisticasEstimadores', estatisticasEstimadores);
    } catch (error) {
      // Não falha se estimadores não estiverem disponíveis
      console.debug('Estimadores ainda não disponíveis:', error);
    }
  }

  /**
   * Configura todos os handlers de eventos
   */
  public setupHandlers(socket: TypedSocket): void {
    console.log(`Cliente conectado: ${socket.id}`);

    // Envia estado inicial
    const estado = this.stateManager.getEstado();
    const estatisticas = this.useAdvancedStats
      ? AdvancedStatisticsService.calcularEstatisticasAvancadas(estado)
      : StatisticsService.calcularEstatisticas(estado);
    socket.emit('estadoAtualizado', { estado, estatisticas });

    // ========================================
    // EMISSÃO DE SENHAS
    // ========================================

    socket.on('emitirSenha', ({ tipo, subtipo, servicoDoCliente }) => {
      try {
        if (!servicoDoCliente || !servicoDoCliente.trim()) {
          socket.emit('erroOperacao', { mensagem: 'Informe o serviço do cliente antes de emitir a senha', tipo: 'emitirSenha' });
          return;
        }
        const senha = this.queueService.emitirSenha(tipo, subtipo, servicoDoCliente);

        // [T-129] Registrar chegada no estimador λ (lambda)
        this.stateManager.registrarChegada(tipo, servicoDoCliente);

        // Emite beep para todos
        this.io.emit('beep', {
          times: 1,
          tipo: 'emissao',
          numero: senha.numero
        });

        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao emitir senha:', error);
      }
    });

    // ========================================
    // CHAMADA DE SENHAS
    // ========================================

    socket.on('chamarSenha', ({ guicheId, mlHint }) => {
      try {
        const senha = this.queueService.chamarSenha(guicheId, mlHint);

        if (senha) {
          // [T-129] Registrar tempo de espera no estimador de percentis
          const tempoEsperaMs = senha.chamadaTimestamp
            ? (senha.chamadaTimestamp - senha.timestamp)
            : 0;
          if (tempoEsperaMs > 0) {
            this.stateManager.registrarTempoEspera(
              senha.tipo,
              senha.servicoDoCliente || '',
              tempoEsperaMs,
              guicheId
            );
          }

          // Emite beep para todos
          this.io.emit('beep', {
            times: 2,
            tipo: 'chamada',
            numero: senha.numero
          });

          this.emitirEstadoAtualizado();
        }
      } catch (error) {
        console.error('Erro ao chamar senha:', error);
      }
    });

    socket.on('solicitarPreviewJSED', ({ limit }) => {
      try {
        const numeros = this.queueService.previewOrdenacaoJSED(limit);
        socket.emit('previewJSED', { numeros });
      } catch (error) {
        console.error('Erro ao gerar preview JSED:', error);
      }
    });

    socket.on('chamarSenhaEspecifica', ({ guicheId, numeroSenha }) => {
      try {
        const senha = this.queueService.chamarSenhaEspecifica(guicheId, numeroSenha);

        if (senha) {
          // Emite beep para todos
          this.io.emit('beep', {
            times: 2,
            tipo: 'chamada',
            numero: senha.numero
          });

          this.emitirEstadoAtualizado();
        }
      } catch (error) {
        console.error('Erro ao chamar senha específica:', error);
      }
    });

    // ========================================
    // FINALIZAÇÃO E DEVOLUÇÃO
    // ========================================

    socket.on('finalizarAtendimento', ({ guicheId }) => {
      try {
        const resultado = this.queueService.finalizarAtendimento(guicheId);

        // [T-129] Registrar atendimento no estimador μ (mu) e percentis
        if (resultado.senha) {
          const senha = resultado.senha;
          const tempoAtendimentoMs = senha.finalizadoTimestamp && senha.chamadaTimestamp
            ? (senha.finalizadoTimestamp - senha.chamadaTimestamp)
            : 0;

          if (tempoAtendimentoMs > 0) {
            this.stateManager.registrarAtendimento(
              senha.tipo,
              senha.servicoDoCliente || '',
              tempoAtendimentoMs,
              guicheId,
              false // não interrompido (atendimento normal)
            );
          }
        }

        this.emitirEstadoAtualizado();

        // Se auto-chamada está ativa, chama a próxima senha após emitir o estado
        if (resultado.autoChamar) {
          console.log(`Auto-chamada ativada: chamando próxima senha para ${guicheId}`);
          setTimeout(() => {
            this.queueService.chamarSenha(guicheId);
            this.emitirEstadoAtualizado();
          }, 200);
        }
      } catch (error) {
        console.error('Erro ao finalizar atendimento:', error);
      }
    });

    socket.on('devolverSenha', ({ numeroSenha }) => {
      try {
        this.queueService.devolverSenha(numeroSenha);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao devolver senha:', error);
      }
    });

    socket.on('devolverSenhaComMotivo', ({ numeroSenha, motivo }) => {
      try {
        const senha = this.queueService.devolverSenhaComMotivo(numeroSenha, motivo);

        if (senha) {
          console.log(`Senha ${numeroSenha} devolvida com motivo: ${motivo}`);
        } else {
          console.log(`Devolução bloqueada para senha ${numeroSenha} com motivo: ${motivo}`);
        }

        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao devolver senha com motivo:', error);
      }
    });

    socket.on('processarAusencia', ({ numeroSenha }) => {
      try {
        const resultado = this.queueService.processarAusencia(numeroSenha);

        if (resultado.acao === 'recolocada') {
          console.log(`Senha ${numeroSenha} recolocada na fila (tentativa ${resultado.senha?.tentativasAusencia})`);

          // [T-129] Registrar interrupção no estimador μ (ausência)
          if (resultado.senha) {
            const senha = resultado.senha;
            const tempoAtendimentoMs = Date.now() - (senha.chamadaTimestamp || Date.now());
            this.stateManager.registrarAtendimento(
              senha.tipo,
              senha.servicoDoCliente || '',
              tempoAtendimentoMs,
              senha.guicheAtendendo || '',
              true // interrompido = true (ausência)
            );
          }

          // Emite notificação de ausência
          this.io.emit('notificacaoAusencia', {
            numeroSenha,
            tentativa: resultado.senha?.tentativasAusencia || 0
          });
        } else if (resultado.acao === 'historico') {
          console.log(`Senha ${numeroSenha} movida para histórico (não compareceu)`);

          // [T-129] Registrar interrupção no estimador μ (não comparecimento)
          if (resultado.senha) {
            const senha = resultado.senha;
            const tempoAtendimentoMs = Date.now() - (senha.chamadaTimestamp || Date.now());
            this.stateManager.registrarAtendimento(
              senha.tipo,
              senha.servicoDoCliente || '',
              tempoAtendimentoMs,
              senha.guicheAtendendo || '',
              true // interrompido = true (não comparecimento)
            );
          }

          // Emite notificação de não comparecimento
          this.io.emit('notificacaoNaoComparecimento', {
            numeroSenha
          });
        }

        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao processar ausência:', error);
      }
    });

    // ========================================
    // EXCLUSÃO
    // ========================================

    socket.on('excluirSenha', ({ numeroSenha }) => {
      try {
        this.queueService.excluirSenha(numeroSenha);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao excluir senha:', error);
      }
    });

    socket.on('excluirAtendimento', ({ numeroSenha }) => {
      try {
        this.queueService.excluirAtendimento(numeroSenha);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao excluir atendimento:', error);
      }
    });

    // ========================================
    // ATUALIZAÇÃO DE DADOS
    // ========================================

    socket.on('atualizarDescricao', ({ numeroSenha, descricao }) => {
      try {
        this.queueService.atualizarDescricao(numeroSenha, descricao);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar descrição:', error);
      }
    });

    socket.on('atualizarProporcao', (novaProporcao) => {
      try {
        this.stateManager.atualizarProporcaoPrioridade(novaProporcao);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar proporção:', error);
      }
    });

    socket.on('atualizarProporcaoContratual', (novaProporcao) => {
      try {
        this.stateManager.atualizarProporcaoContratual(novaProporcao);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar proporção contratual:', error);
      }
    });

    socket.on('atualizarGuichesGlobais', (guiches) => {
      try {
        const resultado = this.stateManager.atualizarGuiches(guiches);

        if (!resultado.sucesso) {
          // Envia mensagem de erro ao cliente
          socket.emit('erroOperacao', {
            mensagem: resultado.erro || 'Erro ao atualizar guichês',
            tipo: 'atualizarGuiches'
          });
          return;
        }

        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar guichês globais:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro inesperado ao atualizar guichês',
          tipo: 'atualizarGuiches'
        });
      }
    });

    // ========================================
    // CONFIGURAÇÕES
    // ========================================

    socket.on('atualizarTiposSenha', (tipos) => {
      try {
        this.stateManager.atualizarTiposSenha(tipos);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar tipos de senha:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar tipos de senha',
          tipo: 'atualizarTiposSenha'
        });
      }
    });

    socket.on('atualizarMotivosRetorno', (motivos) => {
      try {
        this.stateManager.atualizarMotivosRetorno(motivos);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar motivos de retorno:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar motivos de retorno',
          tipo: 'atualizarMotivosRetorno'
        });
      }
    });

    socket.on('atualizarComportamentoFila', (comportamento) => {
      try {
        this.stateManager.atualizarComportamentoFila(comportamento);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar comportamento da fila:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar comportamento da fila',
          tipo: 'atualizarComportamentoFila'
        });
      }
    });

    socket.on('atualizarConfigInterface', (interfaceConfig) => {
      try {
        this.stateManager.atualizarConfigInterface(interfaceConfig);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar configuração de interface:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar configuração de interface',
          tipo: 'atualizarConfigInterface'
        });
      }
    });

    socket.on('atualizarDesignTokens', (tokens) => {
      try {
        this.stateManager.atualizarDesignTokens(tokens);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar tokens de design:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar tokens de design',
          tipo: 'atualizarDesignTokens'
        });
      }
    });

    socket.on('atualizarNotificacoes', (notificacoes) => {
      try {
        this.stateManager.atualizarNotificacoes(notificacoes);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar notificações:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar notificações',
          tipo: 'atualizarNotificacoes'
        });
      }
    });

    socket.on('atualizarSeguranca', (seguranca) => {
      try {
        this.stateManager.atualizarSeguranca(seguranca);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar segurança:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar segurança',
          tipo: 'atualizarSeguranca'
        });
      }
    });

    socket.on('atualizarCorrecoes', (correcoes) => {
      try {
        this.stateManager.atualizarCorrecoes(correcoes);

        // Reinicia monitor se configuração mudou
        this.queueMonitor.reiniciar();

        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar correções:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar configurações de correções',
          tipo: 'atualizarCorrecoes'
        });
      }
    });

    socket.on('atualizarRoteamento', (roteamento) => {
      try {
        this.stateManager.atualizarRoteamento(roteamento);
        this.emitirEstadoAtualizado();
        console.log('✅ [SocketHandlers] Configuração de roteamento atualizada');
      } catch (error) {
        console.error('Erro ao atualizar roteamento:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao atualizar configurações de roteamento',
          tipo: 'atualizarRoteamento'
        });
      }
    });

    // ========================================
    // REINICIAR SISTEMA
    // ========================================

    socket.on('reiniciarSistema', () => {
      try {
        this.stateManager.reiniciar();
        this.io.emit('sistemaReiniciado');
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao reiniciar sistema:', error);
      }
    });

    // ========================================
    // ESTATÍSTICAS E ESTIMADORES (T-130)
    // ========================================

    socket.on('getEstatisticas', () => {
      try {
        const estatisticas = this.stateManager.getEstatisticas();
        socket.emit('estatisticasEstimadores', estatisticas);
      } catch (error) {
        console.error('Erro ao obter estatísticas de estimadores:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao obter estatísticas',
          tipo: 'getEstatisticas'
        });
      }
    });

    // ========================================
    // ESTATÍSTICAS HISTÓRICAS
    // ========================================

    socket.on('solicitarEstatisticasPeriodo', async (dados) => {
      try {
        if (!this.statisticsAggregator) {
          socket.emit('erroOperacao', {
            mensagem: 'Serviço de estatísticas históricas não disponível',
            tipo: 'estatisticasHistoricas'
          });
          return;
        }

        // Cria filtro baseado no tipo
        const filtro = this.statisticsAggregator.criarFiltroPeriodo(
          dados.tipo,
          dados.dataInicio,
          dados.dataFim
        );

        // Busca e agrega estatísticas
        const estatisticas = await this.statisticsAggregator.agregarEstatisticasPeriodo(
          filtro.dataInicio,
          filtro.dataFim
        );

        if (!estatisticas) {
          socket.emit('erroOperacao', {
            mensagem: 'Nenhum dado disponível para o período selecionado',
            tipo: 'estatisticasHistoricas'
          });
          return;
        }

        // Envia estatísticas agregadas
        socket.emit('estatisticasAgregadas', {
          estatisticas,
          periodoDescricao: filtro.descricao
        });

        console.log(`Estatísticas agregadas enviadas: ${filtro.descricao}`);
      } catch (error) {
        console.error('Erro ao solicitar estatísticas de período:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao processar estatísticas do período',
          tipo: 'estatisticasHistoricas'
        });
      }
    });

    socket.on('solicitarDiasDisponiveis', async () => {
      try {
        if (!this.statisticsPersistence) {
          socket.emit('erroOperacao', {
            mensagem: 'Serviço de persistência não disponível',
            tipo: 'estatisticasHistoricas'
          });
          return;
        }

        const dias = await this.statisticsPersistence.listarDiasDisponiveis();

        socket.emit('diasDisponiveis', { dias });

        console.log(`Lista de dias disponíveis enviada: ${dias.length} dias`);
      } catch (error) {
        console.error('Erro ao listar dias disponíveis:', error);
        socket.emit('erroOperacao', {
          mensagem: 'Erro ao listar dias disponíveis',
          tipo: 'estatisticasHistoricas'
        });
      }
    });

    // ========================================
    // DESCONEXÃO
    // ========================================

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  }
}
