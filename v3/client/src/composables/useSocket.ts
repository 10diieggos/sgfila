/**
 * useSocket - Composable para gerenciar conexão Socket.IO
 * SGFILA v3.0
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { io, type Socket } from 'socket.io-client'
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  EstadoSistema,
  Estatisticas,
  TipoSenha,
  Guiche,
  ConfiguracaoTipoSenha,
  ConfiguracaoMotivoRetorno,
  MotivoRetorno,
  ConfiguracaoComportamentoFila,
  ConfiguracaoInterface,
  ConfiguracaoNotificacoes,
  ConfiguracaoSeguranca,
  ConfiguracaoCorrecoes
} from '@shared/types'
import { useBeep } from './useBeep'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export function useSocket() {
  const socket = ref<TypedSocket | null>(null)
  const connected = ref(false)
  const estado = ref<EstadoSistema | null>(null)
  const estatisticas = ref<Estatisticas | null>(null)
  const { beep } = useBeep()

  // Callback para erros (pode ser definido externamente)
  let onErrorCallback: ((mensagem: string, tipo: string) => void) | null = null

  /**
   * Define o callback para tratar erros do servidor
   */
  const setErrorHandler = (callback: (mensagem: string, tipo: string) => void) => {
    onErrorCallback = callback
  }

  /**
   * Conecta ao servidor Socket.IO
   */
  const connect = () => {
    socket.value = io() as TypedSocket

    socket.value.on('connect', () => {
      connected.value = true
      console.log('Socket conectado')
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Socket desconectado')
    })

    socket.value.on('estadoAtualizado', (payload) => {
      estado.value = payload.estado
      estatisticas.value = payload.estatisticas
    })

    socket.value.on('beep', (dados) => {
      beep(dados)
    })

    socket.value.on('erroOperacao', (dados) => {
      console.error(`Erro na operação ${dados.tipo}:`, dados.mensagem)
      if (onErrorCallback) {
        onErrorCallback(dados.mensagem, dados.tipo)
      } else {
        // Fallback: mostrar alert se não houver callback
        alert(`Erro: ${dados.mensagem}`)
      }
    })

    socket.value.on('sistemaReiniciado', () => {
      // Clear session storage on system restart
      sessionStorage.removeItem('sgfGuichesExibicao')
      window.location.reload()
    })
  }

  /**
   * Desconecta do servidor
   */
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  // ========================================
  // EMISSÃO DE EVENTOS
  // ========================================

  const emitirSenha = (tipo: TipoSenha, subtipo: string = '', servicoDoCliente: string) => {
    socket.value?.emit('emitirSenha', { tipo, subtipo, servicoDoCliente })
  }

  const chamarSenha = (guicheId: string) => {
    socket.value?.emit('chamarSenha', { guicheId })
  }

  const chamarSenhaEspecifica = (guicheId: string, numeroSenha: string) => {
    socket.value?.emit('chamarSenhaEspecifica', { guicheId, numeroSenha })
  }

  const finalizarAtendimento = (guicheId: string) => {
    socket.value?.emit('finalizarAtendimento', { guicheId })
  }

  const excluirSenha = (numeroSenha: string) => {
    socket.value?.emit('excluirSenha', { numeroSenha })
  }

  const excluirAtendimento = (numeroSenha: string) => {
    socket.value?.emit('excluirAtendimento', { numeroSenha })
  }

  const devolverSenha = (numeroSenha: string) => {
    socket.value?.emit('devolverSenha', { numeroSenha })
  }

  const devolverSenhaComMotivo = (numeroSenha: string, motivo: MotivoRetorno) => {
    socket.value?.emit('devolverSenhaComMotivo', { numeroSenha, motivo })
  }

  const atualizarDescricao = (numeroSenha: string, descricao: string) => {
    socket.value?.emit('atualizarDescricao', { numeroSenha, descricao })
  }

  const atualizarProporcao = (novaProporcao: number) => {
    socket.value?.emit('atualizarProporcao', novaProporcao)
  }

  const atualizarProporcaoContratual = (novaProporcao: number) => {
    socket.value?.emit('atualizarProporcaoContratual', novaProporcao)
  }

  const atualizarGuichesGlobais = (guiches: Guiche[]) => {
    socket.value?.emit('atualizarGuichesGlobais', guiches)
  }

  const reiniciarSistema = () => {
    socket.value?.emit('reiniciarSistema')
  }

  const atualizarTiposSenha = (tipos: ConfiguracaoTipoSenha[]) => {
    socket.value?.emit('atualizarTiposSenha', tipos)
  }

  const atualizarMotivosRetorno = (motivos: ConfiguracaoMotivoRetorno[]) => {
    socket.value?.emit('atualizarMotivosRetorno', motivos)
  }

  const atualizarComportamentoFila = (comportamento: ConfiguracaoComportamentoFila) => {
    socket.value?.emit('atualizarComportamentoFila', comportamento)
  }

  const atualizarConfigInterface = (interfaceConfig: ConfiguracaoInterface) => {
    socket.value?.emit('atualizarConfigInterface', interfaceConfig)
  }

  const atualizarNotificacoes = (notificacoes: ConfiguracaoNotificacoes) => {
    socket.value?.emit('atualizarNotificacoes', notificacoes)
  }

  const atualizarSeguranca = (seguranca: ConfiguracaoSeguranca) => {
    socket.value?.emit('atualizarSeguranca', seguranca)
  }

  const atualizarCorrecoes = (correcoes: ConfiguracaoCorrecoes) => {
    socket.value?.emit('atualizarCorrecoes', correcoes)
  }

  // Lifecycle hooks
  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    connected,
    estado,
    estatisticas,

    // Métodos
    connect,
    disconnect,
    setErrorHandler,
    emitirSenha,
    chamarSenha,
    chamarSenhaEspecifica,
    finalizarAtendimento,
    excluirSenha,
    excluirAtendimento,
    devolverSenha,
    devolverSenhaComMotivo,
    atualizarDescricao,
    atualizarProporcao,
    atualizarProporcaoContratual,
    atualizarGuichesGlobais,
    reiniciarSistema,
    atualizarTiposSenha,
    atualizarMotivosRetorno,
    atualizarComportamentoFila,
    atualizarConfigInterface,
    atualizarNotificacoes,
    atualizarSeguranca,
    atualizarCorrecoes
  }
}
