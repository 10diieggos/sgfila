/**
 * useRealtimeTimer - Composable para atualização de tempo em tempo real
 * SGFILA v3.0
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * Cria um contador de tempo que atualiza em tempo real
 * @param getElapsedMs - Função que retorna o tempo decorrido em milissegundos
 * @returns Ref que atualiza automaticamente a cada segundo
 */
export function useRealtimeTimer(getElapsedMs: () => number) {
  const tick = ref(0)
  let intervalId: number | null = null

  onMounted(() => {
    // Atualizar a cada segundo
    intervalId = window.setInterval(() => {
      tick.value++
    }, 1000)
  })

  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId)
    }
  })

  // Retorna tempo atualizado (o tick força reavaliação)
  return computed(() => {
    tick.value // Acessa para forçar reatividade
    return getElapsedMs()
  })
}

/**
 * Calcula tempo de espera em tempo real baseado em timestamp
 * @param timestamp - Timestamp de início
 * @returns Milissegundos decorridos desde o timestamp
 */
export function calcularTempoDecorrido(timestamp: number): number {
  const agora = Date.now()
  return agora - timestamp
}

/**
 * Calcula tempo de espera em tempo real para senha em fila
 * @param senha - Objeto senha com timestamp e chamadaTimestamp
 * @returns Milissegundos de tempo de espera
 */
export function calcularTempoEsperaRealtime(senha: { timestamp: number; chamadaTimestamp?: number }): number {
  const agora = Date.now()

  if (senha.chamadaTimestamp) {
    // Se já foi chamada, tempo de espera é fixo
    return senha.chamadaTimestamp - senha.timestamp
  }

  // Ainda esperando, tempo continua aumentando
  return agora - senha.timestamp
}

/**
 * Calcula tempo de atendimento em tempo real para senha em atendimento
 * @param senha - Objeto senha com chamadaTimestamp e finalizadoTimestamp
 * @returns Milissegundos de tempo de atendimento
 */
export function calcularTempoAtendimentoRealtime(senha: { chamadaTimestamp?: number; finalizadoTimestamp?: number }): number {
  if (!senha.chamadaTimestamp) {
    return 0
  }

  const agora = Date.now()

  if (senha.finalizadoTimestamp) {
    // Se já foi finalizada, tempo é fixo
    return senha.finalizadoTimestamp - senha.chamadaTimestamp
  }

  // Ainda em atendimento, tempo continua aumentando
  return agora - senha.chamadaTimestamp
}
