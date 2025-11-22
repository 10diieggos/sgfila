import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { StateManager } from '../services/StateManager.js'
import { AdvancedStatisticsService } from '../services/AdvancedStatisticsService.js'

function pad(n: number) { return String(n).padStart(2, '0') }
function fmtDate(ts: number) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  return `${y}-${m}-${dd}`
}

export function exportarDatasetJsonl(destDir: string) {
  const state = StateManager.getInstance().getEstado()
  const stats = AdvancedStatisticsService.calcularEstatisticasAvancadas(state)

  const dir = join(process.cwd(), destDir)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const file = join(dir, `dataset_${fmtDate(Date.now())}.jsonl`)

  const linhas: string[] = []
  const hora = new Date().getHours()
  const diaSemana = new Date().getDay()

  const fila = state.senhas.filter(s => s.status === 'espera')
  const fila_prioridade = fila.filter(s => s.tipo === 'prioridade').length
  const fila_contratual = fila.filter(s => s.tipo === 'contratual').length
  const fila_normal = fila.filter(s => s.tipo === 'normal').length

  for (const s of state.senhas) {
    const row = {
      ts: Date.now(),
      horaDoDia: hora,
      diaDaSemana: diaSemana,
      fila_total: fila.length,
      fila_prioridade,
      fila_contratual,
      fila_normal,
      picos_flag: stats.horasPico.some(h => h.horarioInicio <= hora && h.horarioFim >= hora),
      tempoOciosoMedio_ms: stats.qualidade?.tempoOciosoMedioMs ?? 0,
      tipo: s.tipo,
      subtipo: s.subtipo,
      tempoEspera_ms: s.tempoEspera,
      tempoAtendimento_ms: s.tempoAtendimento,
      tempoAteNaoComparecer_ms: s.tempoAteNaoComparecer || null,
      tempoLimiteAtingido: !!s.tempoLimiteAtingido,
      reposicionamentos: s.reposicionamentos,
      tentativasAusencia: s.tentativasAusencia,
      status: s.status,
      servicoDoCliente: s.servicoDoCliente || null
    }
    linhas.push(JSON.stringify(row))
  }

  writeFileSync(file, linhas.join('\n'), 'utf8')
  return file
}

if (process.argv[1] && process.argv[1].includes('export-dataset-jsonl')) {
  const file = exportarDatasetJsonl('exports/datasets')
  console.log(file)
}