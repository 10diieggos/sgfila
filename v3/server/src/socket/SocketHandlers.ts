/**
 * SocketHandlers - Gerenciamento de eventos Socket.IO
 * SGFILA v3.0
 */

import type { Socket, Server as SocketIOServer } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../../shared/types.js';
import { StateManager } from '../services/StateManager.js';
import { QueueService } from '../services/QueueService.js';
import { StatisticsService } from '../services/StatisticsService.js';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents>;

export class SocketHandlers {
  private stateManager: StateManager;
  private queueService: QueueService;
  private io: TypedServer;

  constructor(io: TypedServer) {
    this.io = io;
    this.stateManager = StateManager.getInstance();
    this.queueService = new QueueService();
  }

  /**
   * Emite estado atualizado para todos os clientes
   */
  private emitirEstadoAtualizado(): void {
    const estado = this.stateManager.getEstado();
    const estatisticas = StatisticsService.calcularEstatisticas(estado);

    this.io.emit('estadoAtualizado', { estado, estatisticas });
  }

  /**
   * Configura todos os handlers de eventos
   */
  public setupHandlers(socket: TypedSocket): void {
    console.log(`Cliente conectado: ${socket.id}`);

    // Envia estado inicial
    const estado = this.stateManager.getEstado();
    const estatisticas = StatisticsService.calcularEstatisticas(estado);
    socket.emit('estadoAtualizado', { estado, estatisticas });

    // ========================================
    // EMISSÃO DE SENHAS
    // ========================================

    socket.on('emitirSenha', ({ tipo, subtipo }) => {
      try {
        const senha = this.queueService.emitirSenha(tipo, subtipo);

        // Emite beep para todos
        this.io.emit('beep', {
          times: tipo === 'prioridade' ? 2 : 1,
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

    socket.on('chamarSenha', ({ guicheId }) => {
      try {
        const senha = this.queueService.chamarSenha(guicheId);

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
        console.error('Erro ao chamar senha:', error);
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
        this.queueService.finalizarAtendimento(guicheId);
        this.emitirEstadoAtualizado();
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
        this.stateManager.atualizarGuiches(guiches);
        this.emitirEstadoAtualizado();
      } catch (error) {
        console.error('Erro ao atualizar guichês globais:', error);
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
    // DESCONEXÃO
    // ========================================

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  }
}
