import type { EstadoSistema } from '../../../shared/types'
import { extractFeatures } from './feature-extractor'
import { predictByRule } from './fallback'

let session: any = null
let runtimeUnavailable = false

export async function loadModelLazy(): Promise<void> {
  if (session || runtimeUnavailable) return
  try {
    const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<any>
    const ort: any = await dynamicImport('onnxruntime-web')
    session = await ort.InferenceSession.create('/models/next_senha_int8.onnx')
  } catch {
    runtimeUnavailable = true
    ;(window as any)._sgfAiRuntimeUnavailable = true
  }
}

export async function predictNextOrFallback(estado: EstadoSistema): Promise<{ numeroPrevisto: string; score: number; source: 'onnx' | 'fallback' }> {
  await loadModelLazy()
  if (!session) {
    const r = predictByRule(estado)
    const out = { ...r, source: 'fallback' as const }
    ;(window as any)._sgfAiSource = 'fallback'
    return out
  }
  try {
    const features = extractFeatures(estado)
    const feeds: any = { input: new (globalThis as any).ort.Tensor('float32', features, [1, features.length]) }
    const results: any = await session.run(feeds)
    const out = results.output.data as Float32Array
    const numero = String(out[0] || '')
    const score = Number(out[1] || 0)
    if (!numero) {
      const r = predictByRule(estado)
      const o = { ...r, source: 'fallback' as const }
      ;(window as any)._sgfAiSource = 'fallback'
      return o
    }
    const o = { numeroPrevisto: numero, score, source: 'onnx' as const }
    ;(window as any)._sgfAiSource = 'onnx'
    return o
  } catch {
    const r = predictByRule(estado)
    const o = { ...r, source: 'fallback' as const }
    ;(window as any)._sgfAiSource = 'fallback'
    return o
  }
}