<template>
  <div class="statistics-charts">
    <!-- Distribuição por Hora -->
    <div class="chart-section">
      <h3><i class="fas fa-chart-line" /> Distribuição por Hora</h3>
      <div class="chart-container">
        <div class="chart-bar-wrapper">
          <div
            v-for="hora in distribuicaoPorHora"
            :key="hora.hora"
            class="hour-bar"
            :title="`${hora.hora}h: ${hora.emitidas} emitidas, ${hora.atendidas} atendidas`"
          >
            <div class="bar-container">
              <div
                class="bar-emitidas"
                :style="{ height: calcularAlturaBarra(hora.emitidas, maxEmitidas) }"
                :class="{ pico: hora.pico }"
              />
              <div
                class="bar-atendidas"
                :style="{ height: calcularAlturaBarra(hora.atendidas, maxEmitidas) }"
              />
            </div>
            <div class="hour-label">
              {{ hora.hora }}h
            </div>
            <div
              v-if="hora.pico"
              class="pico-badge"
            >
              <i class="fas fa-star" />
            </div>
          </div>
        </div>

        <!-- Legenda -->
        <div class="chart-legend">
          <div class="legend-item">
            <span
              class="legend-color"
              style="background: #4dabf7"
            />
            <span>Emitidas</span>
          </div>
          <div class="legend-item">
            <span
              class="legend-color"
              style="background: #51cf66"
            />
            <span>Atendidas</span>
          </div>
          <div class="legend-item">
            <i
              class="fas fa-star"
              style="color: #ffd43b"
            />
            <span>Horário de Pico</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance por Atendente -->
    <div
      v-if="performancePorAtendente.length > 0"
      class="chart-section"
    >
      <h3><i class="fas fa-user-chart" /> Performance por Atendente</h3>
      <div class="performance-grid">
        <div
          v-for="perf in performancePorAtendente"
          :key="perf.guicheId"
          class="performance-card"
        >
          <div class="card-header">
            <h4>{{ perf.guicheNome }}</h4>
            <div
              class="efficiency-badge"
              :class="getEfficiencyClass(perf.eficiencia)"
            >
              {{ perf.eficiencia.toFixed(1) }} atend/h
            </div>
          </div>

          <div class="performance-stats">
            <div class="stat-row">
              <span class="label">Total de Atendimentos:</span>
              <strong>{{ perf.totalAtendimentos }}</strong>
            </div>
            <div class="stat-row">
              <span class="label">Tempo Médio:</span>
              <strong>{{ formatarTempo(perf.tempoMedioAtendimentoMs) }}</strong>
            </div>
            <div class="stat-row">
              <span class="label">Taxa de Ocupação:</span>
              <strong>{{ perf.taxaOcupacao.toFixed(1) }}%</strong>
            </div>
          </div>

          <!-- Barra de ocupação -->
          <div class="occupation-bar">
            <div
              class="occupation-fill"
              :style="{ width: `${Math.min(perf.taxaOcupacao, 100)}%` }"
              :class="getOccupationClass(perf.taxaOcupacao)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas de Qualidade -->
    <div
      v-if="qualidade"
      class="chart-section"
    >
      <h3><i class="fas fa-award" /> Métricas de Qualidade</h3>
      <div class="quality-metrics">
        <div class="metric-card">
          <div
            class="metric-icon"
            style="background: #51cf66"
          >
            <i class="fas fa-check-circle" />
          </div>
          <div class="metric-content">
            <div class="metric-label">
              Taxa de Atendimento
            </div>
            <div class="metric-value">
              {{ qualidade.taxaAtendimento.toFixed(1) }}%
            </div>
          </div>
          <div class="metric-bar">
            <div
              class="metric-fill"
              :style="{ width: `${qualidade.taxaAtendimento}%`, background: '#51cf66' }"
            />
          </div>
        </div>

        <div class="metric-card">
          <div
            class="metric-icon"
            style="background: #ff6b6b"
          >
            <i class="fas fa-user-times" />
          </div>
          <div class="metric-content">
            <div class="metric-label">
              Taxa de Não Comparecimento
            </div>
            <div class="metric-value">
              {{ qualidade.taxaNaoComparecimento.toFixed(1) }}%
            </div>
          </div>
          <div class="metric-bar">
            <div
              class="metric-fill"
              :style="{ width: `${qualidade.taxaNaoComparecimento}%`, background: '#ff6b6b' }"
            />
          </div>
        </div>

        <div class="metric-card">
          <div
            class="metric-icon"
            style="background: #ffd43b"
          >
            <i class="fas fa-undo" />
          </div>
          <div class="metric-content">
            <div class="metric-label">
              Taxa de Devolução
            </div>
            <div class="metric-value">
              {{ qualidade.taxaDevolucao.toFixed(1) }}%
            </div>
          </div>
          <div class="metric-bar">
            <div
              class="metric-fill"
              :style="{ width: `${qualidade.taxaDevolucao}%`, background: '#ffd43b' }"
            />
          </div>
        </div>

        <div class="metric-card">
          <div
            class="metric-icon"
            style="background: #4dabf7"
          >
            <i class="fas fa-tachometer-alt" />
          </div>
          <div class="metric-content">
            <div class="metric-label">
              Eficiência Geral
            </div>
            <div class="metric-value">
              {{ qualidade.eficienciaGeral.toFixed(1) }} atend/h
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Horários de Pico -->
    <div
      v-if="horasPico.length > 0"
      class="chart-section"
    >
      <h3><i class="fas fa-fire" /> Horários de Pico</h3>
      <div class="pico-list">
        <div
          v-for="(pico, index) in horasPico"
          :key="index"
          class="pico-item"
        >
          <div class="pico-icon">
            <i class="fas fa-clock" />
          </div>
          <div class="pico-info">
            <strong>{{ pico.descricao }}</strong>
            <span>{{ pico.quantidadeSenhas }} senhas emitidas</span>
          </div>
          <div class="pico-badge">
            <i class="fas fa-star" />
          </div>
        </div>
      </div>
    </div>

    <!-- Devoluções (se houver) -->
    <div
      v-if="devolucoes && devolucoes.totalDevolucoes > 0"
      class="chart-section"
    >
      <h3><i class="fas fa-exchange-alt" /> Análise de Devoluções</h3>
      <div class="devolucoes-stats">
        <div class="total-devolucoes">
          <i class="fas fa-info-circle" />
          <span>Total de devoluções: <strong>{{ devolucoes.totalDevolucoes }}</strong></span>
          <span class="tempo-retorno">
            (Tempo médio até retorno: {{ formatarTempo(devolucoes.tempoMedioAteRetornoMs) }})
          </span>
        </div>

        <div class="motivos-grid">
          <div
            v-for="(dados, motivo) in devolucoes.porMotivo"
            :key="motivo"
            class="motivo-card"
          >
            <div class="motivo-header">
              <span class="motivo-label">{{ formatarMotivo(String(motivo)) }}</span>
              <span class="motivo-percent">{{ dados.percentual.toFixed(1) }}%</span>
            </div>
            <div class="motivo-count">
              {{ dados.quantidade }} devoluções
            </div>
            <div class="motivo-bar">
              <div
                class="motivo-fill"
                :style="{ width: `${dados.percentual}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  EstatisticasPorHora,
  EstatisticasPorAtendente,
  EstatisticasQualidade,
  EstatisticasDevolucoes,
  PicoAtendimento
} from '@shared/types'

const props = defineProps<{
  distribuicaoPorHora: EstatisticasPorHora[]
  performancePorAtendente: EstatisticasPorAtendente[]
  qualidade: EstatisticasQualidade | null
  horasPico: PicoAtendimento[]
  devolucoes: EstatisticasDevolucoes | null
}>()

// Computed
const maxEmitidas = computed(() => {
  return Math.max(...props.distribuicaoPorHora.map(h => h.emitidas), 1)
})

// Methods
const calcularAlturaBarra = (valor: number, max: number): string => {
  const percentual = (valor / max) * 100
  return `${Math.max(percentual, 2)}%` // Mínimo 2% para visualização
}

const formatarTempo = (ms: number): string => {
  if (isNaN(ms) || ms === 0 || !isFinite(ms)) return '0 min'
  if (ms < 60000) return '< 1 min'
  const minutos = Math.round(ms / 60000)
  return `${minutos} min`
}

const getEfficiencyClass = (eficiencia: number): string => {
  if (eficiencia >= 4) return 'high'
  if (eficiencia >= 2) return 'medium'
  return 'low'
}

const getOccupationClass = (ocupacao: number): string => {
  if (ocupacao >= 80) return 'high'
  if (ocupacao >= 50) return 'medium'
  return 'low'
}

const formatarMotivo = (motivo: string): string => {
  const motivos: Record<string, string> = {
    'retorno_impressao': 'Retorno para Impressão',
    'erro_operacional': 'Erro Operacional',
    'ausente_retornou': 'Ausente Retornou',
    'reabertura_atendimento': 'Reabertura de Atendimento'
  }
  return motivos[motivo] || motivo
}
</script>

<style scoped>
.statistics-charts {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.chart-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-section h3 {
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-section h3 i {
  color: #667eea;
}

/* Gráfico de Barras */
.chart-container {
  margin-top: 15px;
}

.chart-bar-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 2px solid #e9ecef;
}

.hour-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 20px;
}

.bar-container {
  display: flex;
  gap: 2px;
  width: 100%;
  height: 100%;
  align-items: flex-end;
}

.bar-emitidas,
.bar-atendidas {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  min-height: 4px;
}

.bar-emitidas {
  background: #4dabf7;
}

.bar-emitidas.pico {
  background: linear-gradient(to top, #4dabf7, #ffd43b);
  box-shadow: 0 0 10px rgba(255, 212, 59, 0.5);
}

.bar-atendidas {
  background: #51cf66;
}

.hour-bar:hover .bar-emitidas,
.hour-bar:hover .bar-atendidas {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.hour-label {
  font-size: 0.75em;
  color: #6c757d;
  margin-top: 5px;
  font-weight: 500;
}

.pico-badge {
  position: absolute;
  top: -20px;
  color: #ffd43b;
  font-size: 0.9em;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  color: #495057;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

/* Performance por Atendente */
.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.performance-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #667eea;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h4 {
  margin: 0;
  color: #495057;
  font-size: 1.1em;
}

.efficiency-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
}

.efficiency-badge.high { background: #51cf66; }
.efficiency-badge.medium { background: #ffd43b; color: #495057; }
.efficiency-badge.low { background: #ff6b6b; }

.performance-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
}

.stat-row .label {
  color: #6c757d;
}

.occupation-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
}

.occupation-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.occupation-fill.high { background: #51cf66; }
.occupation-fill.medium { background: #ffd43b; }
.occupation-fill.low { background: #ff6b6b; }

/* Métricas de Qualidade */
.quality-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.metric-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5em;
  margin-bottom: 5px;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.9em;
  color: #6c757d;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 1.8em;
  font-weight: 700;
  color: #495057;
}

.metric-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

/* Horários de Pico */
.pico-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pico-item {
  background: #fff9db;
  border-left: 4px solid #ffd43b;
  padding: 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.pico-icon {
  width: 40px;
  height: 40px;
  background: #ffd43b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-size: 1.2em;
}

.pico-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pico-info strong {
  color: #495057;
  font-size: 1.1em;
}

.pico-info span {
  color: #6c757d;
  font-size: 0.9em;
}

.pico-badge i {
  color: #ffd43b;
  font-size: 1.3em;
}

/* Devoluções */
.devolucoes-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.total-devolucoes {
  background: #e7f3ff;
  border-left: 4px solid #4dabf7;
  padding: 12px 15px;
  border-radius: 6px;
  color: #004a8d;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.total-devolucoes i {
  color: #4dabf7;
}

.tempo-retorno {
  color: #6c757d;
  font-size: 0.9em;
  margin-left: auto;
}

.motivos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.motivo-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.motivo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.motivo-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9em;
}

.motivo-percent {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1em;
}

.motivo-count {
  font-size: 0.85em;
  color: #6c757d;
  margin-bottom: 8px;
}

.motivo-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.motivo-fill {
  height: 100%;
  background: #845ef7;
  border-radius: 3px;
  transition: width 0.3s;
}

/* Responsividade */
@media (max-width: 768px) {
  .chart-bar-wrapper {
    height: 150px;
  }

  .hour-label {
    font-size: 0.65em;
  }

  .quality-metrics,
  .performance-grid,
  .motivos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
