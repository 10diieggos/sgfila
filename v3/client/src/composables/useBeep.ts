/**
 * Composable para gerenciar sons/beeps do sistema
 */

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

export function useBeep() {
  /**
   * Toca um beep usando Web Audio API
   * @param frequency Frequência em Hz (padrão: 800)
   * @param duration Duração em ms (padrão: 200)
   * @param volume Volume de 0 a 1 (padrão: 0.3)
   */
  const playBeep = (frequency: number = 800, duration: number = 200, volume: number = 0.3) => {
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  }

  /**
   * Toca múltiplos beeps em sequência
   * @param times Número de beeps
   * @param tipo Tipo do beep ('emissao' ou 'chamada')
   */
  const playMultipleBeeps = (times: number, tipo: 'emissao' | 'chamada' = 'emissao') => {
    const config = tipo === 'emissao'
      ? { frequency: 600, duration: 150, volume: 0.3, interval: 200 }
      : { frequency: 1000, duration: 200, volume: 0.4, interval: 300 }

    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        playBeep(config.frequency, config.duration, config.volume)
      }, i * config.interval)
    }
  }

  /**
   * Beep para emissão de senha
   */
  const beepEmissao = () => {
    playMultipleBeeps(2, 'emissao')
  }

  /**
   * Beep para chamada de senha
   * Toca 3 beeps mais altos
   */
  const beepChamada = () => {
    playMultipleBeeps(3, 'chamada')
  }

  /**
   * Beep genérico configurável
   */
  const beep = (dados: { times: number; tipo: 'emissao' | 'chamada' }) => {
    playMultipleBeeps(dados.times, dados.tipo)
  }

  return {
    playBeep,
    beepEmissao,
    beepChamada,
    beep
  }
}
