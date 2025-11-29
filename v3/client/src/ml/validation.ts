/**
 * Thresholds fixos para validação de ML Hint
 * Valores otimizados para produção, não editáveis pelo usuário
 */
const FIXED_THRESHOLDS = {
  minScore: 0.65,           // Score mínimo de confiança (65%)
  latencyMsMax: 200,        // Latência máxima em ms
  accuracyTarget: 0.7,      // Meta de acurácia (70%)
  driftTolerance: 0.2,      // Tolerância de drift (20%)
  recallPrioridadeMin: 0.8, // Recall mínimo para prioridades (80%)
  fallbackRateMax: 0.5,     // Taxa máxima de fallback (50%)
  cooldownCalls: 20         // Chamadas de cooldown
}

export async function loadThresholds(): Promise<any> {
  // Retorna thresholds fixos (não mais carregados de arquivo)
  return FIXED_THRESHOLDS
}

export function validatePrediction(previsto: { numeroPrevisto: string; score: number }, tempoMs: number, thresholds: any): boolean {
  if (tempoMs > thresholds.latencyMsMax) return false
  if (previsto.score < thresholds.minScore) return false
  return true
}

export function shouldCooldown(fallbackRate: number, thresholds: any): boolean {
  return typeof thresholds.fallbackRateMax === 'number' && fallbackRate > thresholds.fallbackRateMax
}