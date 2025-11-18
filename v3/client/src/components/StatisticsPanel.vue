<template>
  <div class="statistics-panel" ref="panelRef">
    <!-- Sub-tabs -->
    <div class="sub-tab-nav">
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'geral' }]"
        @click="changeSubTab('geral')"
      >
        <i class="fas fa-chart-bar"></i> Geral
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'ticket' }]"
        @click="changeSubTab('ticket')"
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
          <div v-if="ticketSelecionado.status === 'espera'" class="info-item">
            <div class="info-label">Posição (Automática)</div>
            <div class="info-value"><strong>{{ queuePosition.peopleAhead }}</strong></div>
          </div>
          <div v-if="ticketSelecionado.status === 'espera'" class="info-item">
            <div class="info-label">Estimativa de Atendimento</div>
            <div class="info-value" title="Estimativa baseada no tempo médio de atendimento das pessoas à frente e número de guichês ativos">
              <strong>~ {{ serviceEstimate.estimateFormatted }}</strong>
            </div>
          </div>
          <div v-if="ticketSelecionado.status === 'espera'" class="info-item">
            <div class="info-label">Horário Estimado</div>
            <div class="info-value" title="Horário estimado de início do atendimento">
              <strong>~ {{ serviceEstimate.eta }}</strong>
            </div>
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
import { ref, computed, watch, nextTick } from 'vue'
import type { Estatisticas, Senha, EstadoSistema } from '@shared/types'
import { formatarTempoHMS, formatarTempo } from '../composables/useUtils'

const props = defineProps<{
  estatisticas: Estatisticas
  ticketSelecionado: Senha | null
  estado?: EstadoSistema
}>()

const activeSubTab = ref<'geral' | 'ticket'>('geral')
const panelRef = ref<HTMLElement>()

// Scroll para o topo do card
const scrollToPanel = () => {
  nextTick(() => {
    panelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Mudar sub-aba com scroll
const changeSubTab = (tab: 'geral' | 'ticket') => {
  activeSubTab.value = tab
  scrollToPanel()
}

// Automaticamente muda para aba ticket quando um ticket é selecionado
watch(() => props.ticketSelecionado, (newTicket) => {
  if (newTicket) {
    activeSubTab.value = 'ticket'
    scrollToPanel()
  }
})

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

// Queue position calculation
const queuePosition = computed(() => {
  if (!props.ticketSelecionado || !props.estado || props.ticketSelecionado.status !== 'espera') {
    return { position: -1, peopleAhead: 'N/A' }
  }

  const senhasEspera = props.estado.senhas.filter(s => s.status === 'espera')
  const filaSimulada: Senha[] = []
  let simFilaEspera = [...senhasEspera].sort((a, b) => a.timestamp - b.timestamp)
  let simContadorP = props.estado.contadorPrioridadeDesdeUltimaNormal || 0
  let simContadorC = props.estado.contadorContratualDesdeUltimaNormal || 0
  const proporcaoP = props.estado.proporcaoPrioridade || 2
  const proporcaoC = props.estado.proporcaoContratual || 1

  while (simFilaEspera.length > 0) {
    const prioritariaMaisAntiga = simFilaEspera.find(s => s.tipo === 'prioridade')
    const contratualMaisAntiga = simFilaEspera.find(s => s.tipo === 'contratual')
    const normalMaisAntiga = simFilaEspera.find(s => s.tipo === 'normal')
    let proximaSimulada: Senha | null = null

    if (prioritariaMaisAntiga && simContadorP < proporcaoP) {
      proximaSimulada = prioritariaMaisAntiga
      simContadorP++
    }
    else if (contratualMaisAntiga && simContadorC < proporcaoC) {
      proximaSimulada = contratualMaisAntiga
      simContadorC++
    }
    else if (normalMaisAntiga) {
      proximaSimulada = normalMaisAntiga
      simContadorP = 0
      simContadorC = 0
    }
    else if (prioritariaMaisAntiga) {
      proximaSimulada = prioritariaMaisAntiga
    }
    else if (contratualMaisAntiga) {
      proximaSimulada = contratualMaisAntiga
    }

    if (proximaSimulada) {
      filaSimulada.push(proximaSimulada)
      simFilaEspera = simFilaEspera.filter(s => s.numero !== proximaSimulada!.numero)
    } else {
      break
    }
  }

  const position = filaSimulada.findIndex(s => s.numero === props.ticketSelecionado!.numero)
  const peopleAhead = position !== -1 ? `${position} pessoas na frente` : 'N/A'

  return { position, peopleAhead, filaSimulada }
})

// Service time estimate calculation
const serviceEstimate = computed(() => {
  if (!props.ticketSelecionado || props.ticketSelecionado.status !== 'espera' || !props.estado) {
    return { estimateMs: 0, estimateFormatted: '---', eta: '---' }
  }

  const pos = queuePosition.value.position
  if (pos < 0) {
    return { estimateMs: 0, estimateFormatted: '---', eta: '---' }
  }

  const tmaDefault = props.estatisticas.tempoMedioAtendimentoGeralMs || 300000
  const tmaPorTipo = {
    prioridade: props.estatisticas.detalhesPorTipo.prioridade.tempoMedioAtendimentoMs || tmaDefault,
    contratual: props.estatisticas.detalhesPorTipo.contratual.tempoMedioAtendimentoMs || tmaDefault,
    normal: props.estatisticas.detalhesPorTipo.normal.tempoMedioAtendimentoMs || tmaDefault
  }

  let estimativaMs = 0
  const filaSimulada = queuePosition.value.filaSimulada || []

  for (let i = 0; i < pos; i++) {
    const pessoaNaFrente = filaSimulada[i]
    estimativaMs += tmaPorTipo[pessoaNaFrente.tipo]
  }

  const guichesAtivos = props.estatisticas.guichesAtivos || 1
  const estimativaFinalMs = estimativaMs / guichesAtivos
  const estimateFormatted = formatarTempo(estimativaFinalMs)

  const agoraMs = Date.now()
  const etaMs = agoraMs + estimativaFinalMs
  const eta = estimativaFinalMs > 0 ? new Date(etaMs).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '---'

  return { estimateMs: estimativaFinalMs, estimateFormatted, eta }
})
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
  flex: 1;
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
