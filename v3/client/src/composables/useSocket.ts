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
  ConfiguracaoCorrecoes,
  ConfiguracaoDesignTokens
} from '@shared/types'
import { useBeep } from './useBeep'
import { predictNextOrFallback } from '../ml/inference'
import { recordPrediction } from '../telemetry/predictions'
import { loadThresholds, validatePrediction, shouldCooldown } from '../ml/validation'

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export function useSocket() {
  const socket = ref<TypedSocket | null>(null)
  const connected = ref(false)
  const estado = ref<EstadoSistema | null>(null)
  const estatisticas = ref<Estatisticas | null>(null)
  const previewJSED = ref<string[]>([])
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

    socket.value.on('previewJSED', (dados) => {
      previewJSED.value = Array.isArray(dados?.numeros) ? dados.numeros : []
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

    socket.value.on('notificacaoAusencia', (dados) => {
      try {
        beep({ times: 1, tipo: 'chamada' })
      } catch {}
      console.log('Ausência registrada', dados)
    })

    socket.value.on('notificacaoNaoComparecimento', (dados) => {
      try {
        beep({ times: 1, tipo: 'chamada' })
      } catch {}
      console.log('Não comparecimento registrado', dados)
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

  const chamarSenha = async (guicheId: string) => {
    let mlHint: { numeroPrevisto: string; score: number } | undefined = undefined
    if (estado.value) {
      const thresholds = await loadThresholds()
      const t0 = Date.now()
      const pred = await predictNextOrFallback(estado.value)
      const tempoMs = Date.now() - t0
      const accepted = validatePrediction({ numeroPrevisto: pred.numeroPrevisto, score: pred.score }, tempoMs, thresholds)
      ;(window as any)._sgfFallbackWin = (window as any)._sgfFallbackWin || { total: 0, rejected: 0, cooldown: 0 }
      const win = (window as any)._sgfFallbackWin
      win.total++
      if (!accepted || win.cooldown > 0) {
        win.rejected++
      } else {
        mlHint = { numeroPrevisto: pred.numeroPrevisto, score: pred.score }
      }
      const rate = win.total > 0 ? win.rejected / win.total : 0
      if (shouldCooldown(rate, thresholds)) {
        win.cooldown = thresholds.cooldownCalls || 0
      } else if (win.cooldown > 0) {
        win.cooldown--
      }
      recordPrediction({ guicheId, numeroPrevisto: pred.numeroPrevisto, score: pred.score, source: pred.source, timestamp: t0, accepted_hint: !!mlHint, latency_ms: tempoMs })
    }
    socket.value?.emit('chamarSenha', { guicheId, mlHint })
  }

  const chamarSenhaEspecifica = async (guicheId: string, numeroSenha: string) => {
    if (estado.value) {
      const t0 = Date.now()
      const pred = await predictNextOrFallback(estado.value)
      recordPrediction({ guicheId, numeroPrevisto: pred.numeroPrevisto, score: pred.score, source: pred.source, timestamp: t0 })
    }
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

  const atualizarDesignTokens = (tokens: ConfiguracaoDesignTokens) => {
    socket.value?.emit('atualizarDesignTokens', tokens)
  }

  const solicitarPreviewJSED = (limit?: number) => {
    socket.value?.emit('solicitarPreviewJSED', { limit })
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
    previewJSED,

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
    atualizarDesignTokens,
    solicitarPreviewJSED,
    atualizarNotificacoes,
    atualizarSeguranca,
    atualizarCorrecoes
  }
}
