<template>
  <div class="statistics-panel">
    <!-- Conteúdo Geral -->
    <div class="sub-tab-content">
      <h2><i class="fas fa-chart-pie"></i> Resumo do Dia</h2>
      <div class="stats-list">
        <div class="stat-item">
          <span>Senhas emitidas hoje:</span>
          <span class="stat-value-inline">{{ estatisticas.totalEmitidas }}</span>
        </div>
        <div class="stat-item">
          <span>Senhas atendidas:</span>
          <span class="stat-value-inline">{{ estatisticas.totalAtendidas }}</span>
        </div>
        <div class="stat-item">
          <span>Tempo médio de espera:</span>
          <span class="stat-value-inline">{{ estatisticas.tempoMedioEsperaGeral }}</span>
        </div>
        <div class="stat-item">
          <span>Próxima senha (Lógica):</span>
          <span class="stat-value-inline">{{ estatisticas.proximaSenha }}</span>
        </div>
      </div>

      <h2 style="margin-top: 30px;"><i class="fas fa-tasks"></i> Desempenho por Tipo</h2>
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
              <th>Menor Espera</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tipo, key) in estatisticas.detalhesPorTipo" :key="key">
              <td><span :class="['badge-tipo', key]">{{ getTipoLabel(key) }}</span></td>
              <td>{{ tipo.emitidas }}</td>
              <td>{{ tipo.atendidas }}</td>
              <td>{{ tipo.tempoMedioEspera }}</td>
              <td>{{ tipo.tempoMedioAtendimento }}</td>
              <td>{{ tipo.maiorTempoEspera }}</td>
              <td>{{ tipo.menorTempoEspera }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style="margin-top: 30px;"><i class="fas fa-user-headset"></i> Desempenho por Guichê</h2>
      <div v-if="Object.keys(estatisticas.detalhesPorGuiche).length === 0" class="empty-state">
        <p>Nenhum atendimento realizado ainda.</p>
      </div>
      <div v-else class="guiche-stats-grid">
        <div
          v-for="(dados, guicheId) in estatisticas.detalhesPorGuiche"
          :key="guicheId"
          class="guiche-stat-card"
        >
          <h4>{{ getGuicheNome(guicheId) }}</h4>
          <div class="guiche-stat-item">
            <span class="label">Atendidas:</span>
            <strong>{{ dados.atendidas }}</strong>
          </div>
          <div class="guiche-stat-item">
            <span class="label">Tempo Médio:</span>
            <strong>{{ dados.tempoMedioAtendimento }}</strong>
          </div>
        </div>
      </div>

      <h2 style="margin-top: 30px;"><i class="fas fa-user-slash"></i> Abandono e Exclusões</h2>
      <div class="stats-list">
        <div class="stat-item">
          <span>Senhas (Ausente):</span>
          <span class="stat-value-inline">{{ estatisticas.totalNaoCompareceu }}</span>
        </div>
        <div class="stat-item">
          <span>Senhas (Excluídas da Fila):</span>
          <span class="stat-value-inline">{{ estatisticas.totalExcluidas }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Estatisticas, Guiche } from '@shared/types'

const props = defineProps<{
  estatisticas: Estatisticas
  guiches: Guiche[]
}>()

const getGuicheNome = (guicheId: string): string => {
  const guiche = props.guiches.find(g => g.id === guicheId)
  return guiche?.nome || guicheId
}

const getTipoLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    'prioridade': 'Prioritária',
    'normal': 'Normal',
    'contratual': 'Contratual'
  }
  return labels[tipo] || tipo
}
</script>

<style scoped>
.statistics-panel {
  background: white;
}

.sub-tab-content h2 {
  color: #495057;
  font-size: 1.3em;
  margin-bottom: 20px;
}

.stats-list {
  margin-top: 20px;
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
  font-size: 1em;
  color: #495057;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item span:first-child {
  color: #868e96;
}

.stat-value-inline {
  font-weight: bold;
  color: #004a8d;
}

.table-responsive {
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-table thead {
  background: #004a8d;
  color: white;
}

.stats-table th,
.stats-table td {
  padding: 12px 15px;
  text-align: left;
}

.stats-table tbody tr {
  border-bottom: 1px solid #e9ecef;
}

.stats-table tbody tr:hover {
  background: #f8f9fa;
}

.badge-tipo {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
  display: inline-block;
}

.badge-tipo.prioridade {
  background: #ff6b6b;
}

.badge-tipo.contratual {
  background: #845ef7;
}

.badge-tipo.normal {
  background: #4dabf7;
}

.guiche-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.guiche-stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #667eea;
}

.guiche-stat-card h4 {
  margin: 0 0 15px 0;
  color: #495057;
}

.guiche-stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.guiche-stat-item .label {
  color: #868e96;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #868e96;
}

.empty-state i {
  font-size: 3em;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  line-height: 1.6;
}
</style>
