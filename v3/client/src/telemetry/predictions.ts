export function recordPrediction(entry: { guicheId?: string; numeroPrevisto: string; score: number; source: string; timestamp: number }) {
  try {
    const key = 'sgfila_ml_telemetry'
    const raw = localStorage.getItem(key)
    const arr = raw ? JSON.parse(raw) : []
    arr.push(entry)
    while (arr.length > 1000) arr.shift()
    localStorage.setItem(key, JSON.stringify(arr))
  } catch {}
}