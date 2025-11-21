<template>
  <div class="advanced-statistics-panel">
    <!-- Cabeçalho com informações do dia -->
    <div class="stats-header">
      <div class="header-info">
        <h2><i class="fas fa-chart-line" /> Estatísticas Avançadas</h2>
        <div class="date-info">
          <span class="label">Data:</span>
          <span class="value">{{ formatDate(estatisticas.dataReferencia) }}</span>
          <span
            v-if="estatisticas.modoTeste"
            class="badge-test"
          >MODO TESTE</span>
          <span
            v-if="estatisticas.periodoAtivo"
            class="badge-active"
          >EM TEMPO REAL</span>
        </div>
      </div>
    </div>

    <!-- Resumo Geral -->
    <section class="stats-section">
      <h3><i class="fas fa-chart-pie" /> Resumo do Dia</h3>
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <i class="fas fa-ticket-alt" />
          </div>
          <div class="stat-content">
            <div class="stat-label">
              Senhas Emitidas
            </div>
            <div class="stat-value">
              {{ estatisticas.totalEmitidas }}
            </div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">
            <i class="fas fa-check-circle" />
          </div>
          <div class="stat-content">
            <div class="stat-label">
              Atendidas
            </div>
            <div class="stat-value">
              {{ estatisticas.totalAtendidas }}
            </div>
            <div class="stat-detail">
              {{ estatisticas.qualidade.taxaAtendimento.toFixed(1) }}% do total
            </div>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">
            <i class="fas fa-user-slash" />
          </div>
          <div class="stat-content">
            <div class="stat-label">
              Não Compareceu
            </div>
            <div class="stat-value">
              {{ estatisticas.totalNaoCompareceu }}
            </div>
            <div class="stat-detail">
              {{ estatisticas.qualidade.taxaNaoComparecimento.toFixed(1) }}%
            </div>
          </div>
        </div>

        <div class="stat-card info">
          <div class="stat-icon">
            <i class="fas fa-clock" />
          </div>
          <div class="stat-content">
            <div class="stat-label">
              Tempo Médio Espera
            </div>
            <div class="stat-value-small">
              {{ estatisticas.tempoMedioEsperaGeral }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projeção -->
    <section
      v-if="estatisticas.projecao"
      class="stats-section"
    >
      <h3><i class="fas fa-crystal-ball" /> Projeção de Atendimento</h3>
      <div class="projection-card">
        <div class="projection-item">
          <i class="fas fa-users" />
          <div>
            <div class="projection-label">
              Senhas Restantes
            </div>
            <div class="projection-value">
              {{ estatisticas.projecao.senhasRestantes }}
            </div>
          </div>
        </div>
        <div class="projection-item">
          <i class="fas fa-hourglass-half" />
          <div>
            <div class="projection-label">
              Tempo Estimado
            </div>
            <div class="projection-value">
              {{ formatTime(estatisticas.projecao.tempoEstimadoFinalizacaoMs) }}
            </div>
          </div>
        </div>
        <div class="projection-item">
          <i class="fas fa-clock" />
          <div>
            <div class="projection-label">
              Previsão de Conclusão
            </div>
            <div class="projection-value">
              {{ estatisticas.projecao.horarioEstimadoFinalizacao }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Métricas de Qualidade -->
    <section class="stats-section">
      <h3><i class="fas fa-star" /> Indicadores de Qualidade</h3>
      <div class="quality-metrics">
        <div class="quality-metric">
          <div class="metric-label">
            Taxa de Atendimento
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: estatisticas.qualidade.taxaAtendimento + '%' }"
            />
          </div>
          <div class="metric-value">
            {{ estatisticas.qualidade.taxaAtendimento.toFixed(1) }}%
          </div>
        </div>

        <div class="quality-metric">
          <div class="metric-label">
            Eficiência Geral (atend./hora)
          </div>
          <div class="metric-value-large">
            {{ estatisticas.qualidade.eficienciaGeral.toFixed(1) }}
          </div>
        </div>

        <div class="quality-metric">
          <div class="metric-label">
            Taxa de Devolução
          </div>
          <div class="metric-value-large">
            {{ estatisticas.qualidade.taxaDevolucao.toFixed(1) }}%
          </div>
        </div>
      </div>
    </section>

    <!-- Distribuição Horária -->
    <section class="stats-section">
      <h3><i class="fas fa-chart-bar" /> Distribuição por Horário</h3>
      <div class="hourly-chart">
        <div
          v-for="hora in estatisticas.distribuicaoPorHora"
          :key="hora.hora"
          class="hour-bar"
        >
          <div class="bar-container">
            <div
              class="bar-fill"
              :class="{ 'is-peak': hora.pico }"
              :style="{ height: getBarHeight(hora.emitidas) + '%' }"
            >
              <span
                v-if="hora.emitidas > 0"
                class="bar-value"
              >{{ hora.emitidas }}</span>
            </div>
          </div>
          <div class="hour-label">
            {{ hora.hora }}h
          </div>
        </div>
      </div>

      <div
        v-if="estatisticas.horasPico.length > 0"
        class="peaks-info"
      >
        <strong>Horários de Pico:</strong>
        <span
          v-for="(pico, idx) in estatisticas.horasPico"
          :key="idx"
          class="peak-badge"
        >
          {{ pico.descricao }} ({{ pico.quantidadeSenhas }} senhas)
        </span>
      </div>

      <div class="table-responsive" style="margin-top: 10px;">
        <table class="stats-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>λ/h</th>
              <th>μ/h</th>
              <th>p50 espera</th>
              <th>p90</th>
              <th>p95</th>
              <th>p99</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in estatisticas.distribuicaoPorHora" :key="h.hora">
              <td>{{ h.hora }}h</td>
              <td>{{ (h.lambdaPorHora || 0).toFixed(2) }}</td>
              <td>{{ (h.muPorHora || 0).toFixed(2) }}</td>
              <td>{{ formatTime(h.p50EsperaMs || 0) }}</td>
              <td>{{ formatTime(h.p90EsperaMs || 0) }}</td>
              <td>{{ formatTime(h.p95EsperaMs || 0) }}</td>
              <td>{{ formatTime(h.p99EsperaMs || 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Performance por Atendente -->
    <section class="stats-section">
      <h3><i class="fas fa-user-tie" /> Performance por Atendente</h3>
      <div
        v-if="estatisticas.performancePorAtendente.length === 0"
        class="empty-state"
      >
        <p>Nenhum atendimento realizado ainda.</p>
      </div>
      <div
        v-else
        class="performance-grid"
      >
        <div
          v-for="atendente in estatisticas.performancePorAtendente"
          :key="atendente.guicheId"
          class="performance-card"
        >
          <h4>{{ atendente.guicheNome }}</h4>
          <div class="performance-stats">
            <div class="perf-item">
              <span class="perf-label">Atendimentos:</span>
              <span class="perf-value">{{ atendente.totalAtendimentos }}</span>
            </div>
            <div class="perf-item">
              <span class="perf-label">Eficiência:</span>
              <span class="perf-value">{{ atendente.eficiencia.toFixed(1) }}/h</span>
            </div>
            <div class="perf-item">
              <span class="perf-label">Taxa de Ocupação:</span>
              <span class="perf-value">{{ atendente.taxaOcupacao.toFixed(1) }}%</span>
            </div>
            <div class="perf-item">
              <span class="perf-label">Tempo Médio:</span>
              <span class="perf-value">{{ formatTime(atendente.tempoMedioAtendimentoMs) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Devoluções -->
    <section
      v-if="estatisticas.devolucoes.totalDevolucoes > 0"
      class="stats-section"
    >
      <h3><i class="fas fa-undo" /> Análise de Devoluções</h3>
      <div class="devolucoes-summary">
        <div class="dev-total">
          <span class="dev-label">Total de Devoluções:</span>
          <span class="dev-value">{{ estatisticas.devolucoes.totalDevolucoes }}</span>
        </div>
        <div class="dev-total">
          <span class="dev-label">Tempo Médio até Retorno:</span>
          <span class="dev-value">{{ formatTime(estatisticas.devolucoes.tempoMedioAteRetornoMs) }}</span>
        </div>
      </div>

      <div class="devolucoes-motivos">
        <div
          v-for="(dados, motivo) in estatisticas.devolucoes.porMotivo"
          :key="motivo"
          class="motivo-item"
        >
          <div class="motivo-header">
            <span class="motivo-name">{{ formatMotivoNome(String(motivo)) }}</span>
            <span class="motivo-count">{{ dados.quantidade }}</span>
          </div>
          <div class="progress-bar-small">
            <div
              class="progress-fill"
              :style="{ width: dados.percentual + '%' }"
            />
          </div>
          <div class="motivo-percent">
            {{ dados.percentual.toFixed(1) }}%
          </div>
        </div>
      </div>
    </section>

    <!-- Detalhes por Tipo -->
    <section class="stats-section">
      <h3><i class="fas fa-tasks" /> Desempenho por Tipo de Senha</h3>
      <div class="table-responsive">
        <table class="stats-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Emitidas</th>
              <th>Atendidas</th>
              <th>T.M. Espera</th>
              <th>T.M. Atend.</th>
              <th>Maior Espera</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tipo, key) in estatisticas.detalhesPorTipo"
              :key="key"
            >
              <td><span :class="['badge-tipo', key]">{{ getTipoLabel(key) }}</span></td>
              <td>{{ tipo.emitidas }}</td>
              <td>{{ tipo.atendidas }}</td>
              <td>{{ tipo.tempoMedioEspera }}</td>
              <td>{{ tipo.tempoMedioAtendimento }}</td>
              <td>{{ tipo.maiorTempoEspera }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { EstatisticasAvancadas } from '@shared/types'

const props = defineProps<{
  estatisticas: EstatisticasAvancadas
}>()

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

const formatTime = (ms: number): string => {
  if (isNaN(ms) || ms === 0 || !isFinite(ms)) return '0 min'
  if (ms < 60000) return '< 1 min'
  const minutos = Math.round(ms / 60000)
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`
}

const getBarHeight = (value: number): number => {
  const max = Math.max(...props.estatisticas.distribuicaoPorHora.map(h => h.emitidas))
  if (max === 0) return 0
  return (value / max) * 100
}

const getTipoLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    'prioridade': 'Prioritária',
    'normal': 'Normal',
    'contratual': 'Contratual'
  }
  return labels[tipo] || tipo
}

const formatMotivoNome = (motivo: string): string => {
  const nomes: Record<string, string> = {
    'retorno_impressao': 'Erro de Impressão',
    'erro_operacional': 'Erro Operacional',
    'ausente_retornou': 'Ausente Retornou',
    'reabertura_atendimento': 'Reabertura de Atendimento'
  }
  return nomes[motivo] || motivo
}
</script>

<style scoped>
.advanced-statistics-panel {
  background: white;
  padding: 5px;
}

.stats-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.header-info h2 {
  margin: 0 0 10px 0;
  font-size: 1.6em;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95em;
}

.date-info .label {
  opacity: 0.9;
}

.date-info .value {
  font-weight: 600;
}

.badge-test, .badge-active {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-test {
  background: #ffc107;
  color: #856404;
}

.badge-active {
  background: #28a745;
  color: white;
}

.stats-section {
  margin-bottom: 35px;
}

.stats-section h3 {
  color: #495057;
  font-size: 1.3em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
}

.stat-card.primary { border-color: #667eea; }
.stat-card.success { border-color: #28a745; }
.stat-card.warning { border-color: #ffc107; }
.stat-card.info { border-color: #17a2b8; }

.stat-icon {
  font-size: 2.5em;
  opacity: 0.8;
}

.stat-card.primary .stat-icon { color: #667eea; }
.stat-card.success .stat-icon { color: #28a745; }
.stat-card.warning .stat-icon { color: #ffc107; }
.stat-card.info .stat-icon { color: #17a2b8; }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.85em;
  color: #868e96;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #495057;
  line-height: 1;
}

.stat-value-small {
  font-size: 1.4em;
  font-weight: bold;
  color: #495057;
}

.stat-detail {
  font-size: 0.8em;
  color: #868e96;
  margin-top: 5px;
}

.projection-card {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  gap: 20px;
}

.projection-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.projection-item i {
  font-size: 2.5em;
  color: #667eea;
}

.projection-label {
  font-size: 0.9em;
  color: #868e96;
  margin-bottom: 5px;
}

.projection-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #495057;
}

.quality-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.quality-metric {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.metric-label {
  font-size: 0.9em;
  color: #868e96;
  margin-bottom: 15px;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.metric-value {
  font-size: 1.2em;
  font-weight: bold;
  color: #495057;
  text-align: right;
}

.metric-value-large {
  font-size: 2em;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  margin-top: 10px;
}

.hourly-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  gap: 4px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
}

.hour-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-fill {
  width: 80%;
  background: #667eea;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 2px;
}

.bar-fill.is-peak {
  background: #ff6b6b;
}

.bar-value {
  color: white;
  font-size: 0.7em;
  font-weight: bold;
  padding: 2px;
}

.hour-label {
  font-size: 0.75em;
  color: #868e96;
  margin-top: 8px;
  font-weight: 600;
}

.peaks-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 15px;
  background: #fff5f5;
  border-radius: 8px;
  border-left: 4px solid #ff6b6b;
}

.peaks-info strong {
  color: #495057;
}

.peak-badge {
  background: #ff6b6b;
  color: white;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.performance-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #667eea;
}

.performance-card h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1.1em;
}

.performance-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.perf-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.perf-item:last-child {
  border-bottom: none;
}

.perf-label {
  color: #868e96;
  font-size: 0.9em;
}

.perf-value {
  font-weight: bold;
  color: #495057;
}

.devolucoes-summary {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  padding: 20px;
  background: #fff3cd;
  border-radius: 12px;
  border-left: 4px solid #ffc107;
}

.dev-total {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dev-label {
  color: #856404;
  font-size: 0.9em;
  font-weight: 600;
}

.dev-value {
  color: #856404;
  font-size: 1.5em;
  font-weight: bold;
}

.devolucoes-motivos {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.motivo-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.motivo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.motivo-name {
  font-weight: 600;
  color: #495057;
}

.motivo-count {
  background: #667eea;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: bold;
}

.progress-bar-small {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.motivo-percent {
  font-size: 0.85em;
  color: #868e96;
  text-align: right;
}

.table-responsive {
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.stats-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

.stats-table td {
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
}

.stats-table tbody tr:hover {
  background: #f8f9fa;
}

.badge-tipo {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-tipo.prioridade {
  background: #fff5f5;
  color: #ff6b6b;
}

.badge-tipo.contratual {
  background: #f3e8ff;
  color: #845ef7;
}

.badge-tipo.normal {
  background: #f0f8ff;
  color: #4dabf7;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #868e96;
  font-style: italic;
}
</style>
