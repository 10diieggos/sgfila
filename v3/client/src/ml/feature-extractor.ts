import type { EstadoSistema } from '../../../shared/types'

export function extractFeatures(estado: EstadoSistema): Float32Array {
  const fila = estado.senhas.filter(s => s.status === 'espera')
  const pr = fila.filter(s => s.tipo === 'prioridade').length
  const co = fila.filter(s => s.tipo === 'contratual').length
  const no = fila.filter(s => s.tipo === 'normal').length
  const props = [
    fila.length,
    pr,
    co,
    no,
    estado.proporcaoPrioridade || 2,
    estado.proporcaoContratual || 1
  ]
  return new Float32Array(props)
}