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
  }
}

export async function predictNextOrFallback(estado: EstadoSistema): Promise<{ numeroPrevisto: string; score: number; source: 'onnx' | 'fallback' }> {
  await loadModelLazy()
  if (!session) {
    const r = predictByRule(estado)
    return { ...r, source: 'fallback' }
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
      return { ...r, source: 'fallback' }
    }
    return { numeroPrevisto: numero, score, source: 'onnx' }
  } catch {
    const r = predictByRule(estado)
    return { ...r, source: 'fallback' }
  }
}
