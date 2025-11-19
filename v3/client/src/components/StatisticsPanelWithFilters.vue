<template>
  <div class="statistics-panel-with-filters">
    <!-- Filtro de Período -->
    <StatisticsPeriodFilter
      :periodoDescricao="periodoDescricao"
      :diasAnalisados="diasAnalisados"
      :tendencias="tendencias"
      :carregando="carregando"
      @aplicarFiltro="handleAplicarFiltro"
    />

    <!-- Loading State -->
    <div v-if="carregando" class="loading-overlay">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando estatísticas...</p>
      </div>
    </div>

    <!-- Conteúdo de Estatísticas -->
    <div v-else-if="estatisticas" class="statistics-content">
      <!-- Resumo Geral -->
      <div class="stats-summary">
        <h2>
          <i class="fas fa-chart-pie"></i>
          {{ periodoDescricao || 'Estatísticas do Dia' }}
        </h2>

        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon"><i class="fas fa-ticket-alt"></i></div>
            <div class="stat-content">
              <div class="stat-label">Senhas Emitidas</div>
              <div class="stat-value">{{ estatisticas.totalEmitidas }}</div>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
            <div class="stat-content">
              <div class="stat-label">Atendidas</div>
              <div class="stat-value">{{ estatisticas.totalAtendidas }}</div>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-icon"><i class="fas fa-user-times"></i></div>
            <div class="stat-content">
              <div class="stat-label">Não Compareceu</div>
              <div class="stat-value">{{ estatisticas.totalNaoCompareceu }}</div>
            </div>
          </div>

          <div class="stat-card info">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-content">
              <div class="stat-label">Tempo Médio Espera</div>
              <div class="stat-value-small">{{ estatisticas.tempoMedioEsperaGeral }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos e Visualizações -->
      <StatisticsCharts
        v-if="estatisticas.distribuicaoPorHora"
        :distribuicaoPorHora="estatisticas.distribuicaoPorHora"
        :performancePorAtendente="estatisticas.performancePorAtendente || []"
        :qualidade="estatisticas.qualidade || null"
        :horasPico="estatisticas.horasPico || []"
        :devolucoes="estatisticas.devolucoes || null"
      />

      <!-- Desempenho por Tipo (Tabela Clássica) -->
      <div class="stats-section">
        <h3><i class="fas fa-tasks"></i> Desempenho por Tipo</h3>
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
      </div>

      <!-- Desempenho por Guichê (Tabela Clássica) -->
      <div class="stats-section">
        <h3><i class="fas fa-user-headset"></i> Desempenho por Guichê</h3>
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
      </div>

      <!-- Abandono e Exclusões -->
      <div class="stats-section">
        <h3><i class="fas fa-user-slash"></i> Abandono e Exclusões</h3>
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

    <!-- Estado Vazio -->
    <div v-else class="empty-state-full">
      <i class="fas fa-chart-bar"></i>
      <p>Nenhuma estatística disponível</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineExpose } from 'vue'
import { useSocket } from '../composables/useSocket'
import StatisticsPeriodFilter from './StatisticsPeriodFilter.vue'
import StatisticsCharts from './StatisticsCharts.vue'
import type { EstatisticasAvancadas, Guiche } from '@shared/types'

// Define component para compatibilidade com export
defineExpose({})

const props = defineProps<{
  guiches: Guiche[]
}>()

// Composables
const { socket } = useSocket()

// State
const estatisticas = ref<EstatisticasAvancadas | null>(null)
const periodoDescricao = ref<string>('')
const diasAnalisados = ref<number>(1)
const carregando = ref(false)

// Computed
const tendencias = computed(() => {
  const stats = estatisticas.value as any
  if (!stats || !stats.tendenciaEmissao) return null

  return {
    emissao: stats.tendenciaEmissao,
    atendimento: stats.tendenciaAtendimento,
    variacaoEmissao: stats.variacaoPercentualEmissao,
    variacaoTempo: stats.variacaoPercentualTempo
  }
})

// Methods
const handleAplicarFiltro = (dados: {
  tipo: 'dia' | 'semana' | 'mes' | 'personalizado'
  dataInicio?: string
  dataFim?: string
}) => {
  carregando.value = true

  // Solicita estatísticas ao servidor
  socket.value?.emit('solicitarEstatisticasPeriodo', dados)
}

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

// Socket event handlers
onMounted(() => {
  if (!socket.value) return

  // Escuta estatísticas agregadas do servidor
  socket.value.on('estatisticasAgregadas', (dados: any) => {
    console.log('Estatísticas recebidas:', dados)
    estatisticas.value = dados.estatisticas
    periodoDescricao.value = dados.periodoDescricao

    // Extrai dias analisados se disponível
    const stats = dados.estatisticas as any
    if (stats.diasAnalisados) {
      diasAnalisados.value = stats.diasAnalisados
    } else {
      diasAnalisados.value = 1
    }

    carregando.value = false
  })

  // Escuta atualizações de estado em tempo real (quando filtro = dia)
  socket.value.on('estadoAtualizado', ({ estatisticas: stats }: any) => {
    // Se não está carregando dados históricos e tem estatísticas avançadas
    if (!carregando.value && (stats as any).distribuicaoPorHora) {
      estatisticas.value = stats as EstatisticasAvancadas
      periodoDescricao.value = 'Hoje (tempo real)'
      diasAnalisados.value = 1
    }
  })

  // Escuta erros
  socket.value.on('erroOperacao', (dados: any) => {
    if (dados.tipo === 'estatisticasHistoricas') {
      console.error('Erro ao carregar estatísticas:', dados.mensagem)
      carregando.value = false
      alert(dados.mensagem)
    }
  })

  // Carrega estatísticas do dia atual
  handleAplicarFiltro({ tipo: 'dia' })
})
</script>

<style scoped>
.statistics-panel-with-filters {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  min-height: 95vh;
  max-height: 95vh;
  overflow-y: auto;
  border-radius: 12px;
}

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-spinner {
  text-align: center;
  color: #667eea;
}

.loading-spinner i {
  font-size: 3em;
  margin-bottom: 15px;
}

.loading-spinner p {
  font-size: 1.1em;
  font-weight: 500;
  margin: 0;
}

.statistics-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stats-summary {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-summary h2 {
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.4em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats-summary h2 i {
  color: #667eea;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
  border-left: 4px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-card.primary { border-color: #667eea; }
.stat-card.success { border-color: #51cf66; }
.stat-card.warning { border-color: #ffd43b; }
.stat-card.info { border-color: #4dabf7; }

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: white;
}

.stat-card.primary .stat-icon { background: #667eea; }
.stat-card.success .stat-icon { background: #51cf66; }
.stat-card.warning .stat-icon { background: #ffd43b; }
.stat-card.info .stat-icon { background: #4dabf7; }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.85em;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  color: #495057;
}

.stat-value-small {
  font-size: 1.5em;
  font-weight: 700;
  color: #495057;
}

.stats-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-section h3 {
  color: #495057;
  font-size: 1.2em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats-section h3 i {
  color: #667eea;
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

.stats-list {
  margin-top: 20px;
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

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #868e96;
}

.empty-state-full {
  text-align: center;
  padding: 80px 20px;
  color: #868e96;
}

.empty-state-full i {
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.3;
}

.empty-state-full p {
  margin: 0;
  font-size: 1.2em;
}

/* Responsividade */
@media (max-width: 768px) {
  .statistics-panel-with-filters {
    padding: 10px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
