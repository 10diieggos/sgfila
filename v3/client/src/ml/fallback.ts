import type { EstadoSistema } from '../../../shared/types'

export function predictByRule(estado: EstadoSistema): { numeroPrevisto: string; score: number } {
  const fila = estado.senhas.filter(s => s.status === 'espera').sort((a, b) => a.timestamp - b.timestamp)
  const prioritaria = fila.find(s => s.tipo === 'prioridade')
  if (prioritaria) return { numeroPrevisto: prioritaria.numero, score: 0.5 }
  const contratual = fila.find(s => s.tipo === 'contratual')
  if (contratual) return { numeroPrevisto: contratual.numero, score: 0.4 }
  const normal = fila.find(s => s.tipo === 'normal')
  if (normal) return { numeroPrevisto: normal.numero, score: 0.3 }
  return { numeroPrevisto: '', score: 0 }
}