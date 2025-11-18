/**
 * useUtils - Funções utilitárias
 * SGFILA v3.0
 */

/**
 * Calcula tempo de espera em minutos
 */
export function calcularTempoEspera(timestamp: number): number {
  const agora = new Date().getTime()
  return Math.round((agora - timestamp) / 60000)
}

/**
 * Formata milissegundos para string legível
 */
export function formatarTempo(milissegundos: number): string {
  if (isNaN(milissegundos) || milissegundos === 0 || !isFinite(milissegundos)) {
    return '0 min'
  }
  if (milissegundos < 60000) return '< 1 min'
  const minutos = Math.round(milissegundos / 60000)
  return `${minutos} min`
}

/**
 * Formata milissegundos para formato h:mm:ss
 */
export function formatarTempoHMS(milissegundos: number): string {
  if (isNaN(milissegundos) || milissegundos < 0 || !isFinite(milissegundos)) {
    return '0:00:00'
  }

  const totalSegundos = Math.floor(milissegundos / 1000)
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60

  const mm = String(minutos).padStart(2, '0')
  const ss = String(segundos).padStart(2, '0')

  return `${horas}:${mm}:${ss}`
}

/**
 * Retorna classe de ícone baseado no tipo
 */
export function getIconClass(tipo: string): string {
  const icons: Record<string, string> = {
    prioridade: 'fas fa-wheelchair',
    contratual: 'fas fa-file-contract',
    normal: 'fas fa-user'
  }
  return icons[tipo] || 'fas fa-user'
}

/**
 * Escapa HTML para previnir XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Formata descrição (quebras de linha)
 */
export function formatarDescricao(descricao: string): string {
  return escapeHtml(descricao).replace(/\n/g, '<br>')
}
