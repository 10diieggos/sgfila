<template>
  <div class="statistics-panel">
    <!-- Sub-tabs -->
    <div class="sub-tab-nav">
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'geral' }]"
        @click="activeSubTab = 'geral'"
      >
        <i class="fas fa-chart-bar"></i> Geral
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'ticket' }]"
        @click="activeSubTab = 'ticket'"
      >
        <i class="fas fa-ticket-alt"></i> Ticket
      </button>
    </div>

    <!-- Conteúdo Geral -->
    <div v-if="activeSubTab === 'geral'" class="sub-tab-content">
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
          v-for="(dados, guiche) in estatisticas.detalhesPorGuiche"
          :key="guiche"
          class="guiche-stat-card"
        >
          <h4>{{ guiche }}</h4>
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
          <span>Senhas (Não Compareceu):</span>
          <span class="stat-value-inline">{{ estatisticas.totalNaoCompareceu }}</span>
        </div>
        <div class="stat-item">
          <span>Senhas (Excluídas da Fila):</span>
          <span class="stat-value-inline">{{ estatisticas.totalExcluidas }}</span>
        </div>
      </div>
    </div>

    <!-- Conteúdo Ticket -->
    <div v-if="activeSubTab === 'ticket'" class="sub-tab-content">
      <h2><i class="fas fa-info-circle"></i> Detalhes do Ticket</h2>

      <div v-if="!ticketSelecionado" class="empty-state">
        <i class="fas fa-hand-pointer"></i>
        <p>Clique no ícone <i class="fas fa-info-circle"></i> de uma senha na fila de espera para ver os detalhes.</p>
      </div>

      <div v-else class="ticket-details">
        <div class="ticket-header">
          <div class="ticket-number-large">{{ ticketSelecionado.numero }}</div>
          <span :class="['badge-tipo-large', ticketSelecionado.tipo]">
            {{ getTipoLabel(ticketSelecionado.tipo) }}
          </span>
        </div>

        <div class="ticket-info-grid">
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">{{ getStatusLabel(ticketSelecionado.status) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Emitida em</div>
            <div class="info-value">{{ formatTimestamp(ticketSelecionado.timestamp) }}</div>
          </div>
          <div v-if="ticketSelecionado.chamadaTimestamp" class="info-item">
            <div class="info-label">Chamada em</div>
            <div class="info-value">{{ formatTimestamp(ticketSelecionado.chamadaTimestamp) }}</div>
          </div>
          <div v-if="ticketSelecionado.finalizadoTimestamp" class="info-item">
            <div class="info-label">Finalizada em</div>
            <div class="info-value">{{ formatTimestamp(ticketSelecionado.finalizadoTimestamp) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Tempo de Espera</div>
            <div class="info-value">{{ formatarTempoHMS(ticketSelecionado.tempoEspera) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Tempo de Atendimento</div>
            <div class="info-value">{{ formatarTempoHMS(ticketSelecionado.tempoAtendimento) }}</div>
          </div>
          <div v-if="ticketSelecionado.guicheAtendendo" class="info-item">
            <div class="info-label">Guichê</div>
            <div class="info-value">{{ ticketSelecionado.guicheAtendendo }}</div>
          </div>
          <div v-if="ticketSelecionado.descricao" class="info-item full-width">
            <div class="info-label">Descrição</div>
            <div class="info-value">{{ ticketSelecionado.descricao }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Estatisticas, Senha } from '@shared/types'
import { formatarTempoHMS } from '../composables/useUtils'

defineProps<{
  estatisticas: Estatisticas
  ticketSelecionado: Senha | null
}>()

const activeSubTab = ref<'geral' | 'ticket'>('geral')

const getTipoLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    'prioridade': 'Prioritária',
    'normal': 'Normal',
    'contratual': 'Contratual'
  }
  return labels[tipo] || tipo
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'espera': 'Em Espera',
    'chamada': 'Chamada',
    'atendida': 'Atendida',
    'nao_compareceu': 'Não Compareceu',
    'excluida': 'Excluída'
  }
  return labels[status] || status
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.statistics-panel {
  background: white;
}

.sub-tab-nav {
  display: flex;
  gap: 5px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 25px;
}

.sub-tab-link {
  padding: 12px 20px;
  border: none;
  background: none;
  color: #868e96;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  font-size: 0.95em;
}

.sub-tab-link:hover {
  color: #495057;
  background: #f8f9fa;
}

.sub-tab-link.active {
  color: #667eea;
  border-bottom-color: #667eea;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.badge-tipo.contratual {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.badge-tipo.normal {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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

.ticket-details {
  max-width: 700px;
  margin: 0 auto;
}

.ticket-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.ticket-number-large {
  font-size: 4em;
  font-weight: bold;
  margin-bottom: 15px;
  letter-spacing: 3px;
}

.badge-tipo-large {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 1em;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.3);
  display: inline-block;
}

.ticket-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.85em;
  color: #868e96;
  margin-bottom: 5px;
  font-weight: 600;
  text-transform: uppercase;
}

.info-value {
  color: #495057;
  font-size: 1.1em;
  font-weight: 600;
}
</style>
