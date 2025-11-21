export async function loadThresholds(): Promise<any> {
  try {
    const r = await fetch('/ml/thresholds.json')
    return await r.json()
  } catch {
    return { minScore: 0, latencyMsMax: 200, accuracyTarget: 0.7, driftTolerance: 0.2, recallPrioridadeMin: 0.8 }
  }
}

export function validatePrediction(previsto: { numeroPrevisto: string; score: number }, tempoMs: number, thresholds: any): boolean {
  if (tempoMs > thresholds.latencyMsMax) return false
  if (previsto.score < thresholds.minScore) return false
  return true
}