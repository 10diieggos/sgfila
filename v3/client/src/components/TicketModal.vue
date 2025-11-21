<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && ticketSelecionado" class="modal-overlay modal-ticket" @click.self="handleClose">
        <div class="modal-content-ticket" @click.stop>
          <button class="close-btn" @click="handleClose">
            <i class="fas fa-times"></i>
          </button>

          <h2 class="modal-title"><i class="fas fa-info-circle"></i> Detalhes do Ticket</h2>

          <div class="ticket-details">
            <div :class="['ticket-number-display', ticketSelecionado.tipo]">
              {{ ticketSelecionado.numero }}
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
                <div class="info-value">{{ formatarTempoHMS(tempoEsperaRealtime) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tempo de Atendimento</div>
                <div class="info-value">{{ tempoAtendimentoRealtime > 0 ? formatarTempoHMS(tempoAtendimentoRealtime) : '---' }}</div>
              </div>
              <div v-if="ticketSelecionado.servicoDoCliente" class="info-item full-width">
                <div class="info-label">Serviço</div>
                <div class="info-value">{{ ticketSelecionado.servicoDoCliente }}</div>
              </div>
              <div v-if="ticketSelecionado.guicheAtendendo" class="info-item">
                <div class="info-label">Guichê</div>
                <div class="info-value">{{ ticketSelecionado.guicheNome || ticketSelecionado.guicheAtendendo }}</div>
              </div>
              <div v-if="ticketSelecionado.descricao" class="info-item full-width">
                <div class="info-label">Descrição</div>
                <div class="info-value">{{ ticketSelecionado.descricao }}</div>
              </div>
            </div>

            <!-- Botões de ação -->
            <div class="ticket-actions">
              <button
                v-if="ticketSelecionado.status !== 'chamada'"
                @click="$emit('chamar', ticketSelecionado.numero)"
                class="btn-ticket-action btn-call"
                title="Chamar esta senha"
              >
                <i class="fas fa-bullhorn"></i>
              </button>
              <button
                @click="$emit('editar', ticketSelecionado.numero)"
                class="btn-ticket-action btn-edit"
                title="Editar descrição"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="$emit('excluir', ticketSelecionado.numero)"
                class="btn-ticket-action btn-delete"
                title="Excluir senha"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
              <button
                v-if="ticketSelecionado.status !== 'espera'"
                @click="$emit('retornar', ticketSelecionado.numero)"
                class="btn-ticket-action btn-return"
                title="Devolver para fila"
              >
                <i class="fas fa-undo"></i>
              </button>
              <button
                v-if="ticketSelecionado.status !== 'nao_compareceu'"
                @click="$emit('ausente', ticketSelecionado.numero)"
                class="btn-ticket-action btn-absent"
                title="Marcar como ausente"
              >
                <i class="fas fa-user-slash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Estatisticas, Senha, EstadoSistema } from '@shared/types'
import { formatarTempoHMS, formatarTempo } from '../composables/useUtils'
import { useRealtimeTimer, calcularTempoEsperaRealtime, calcularTempoAtendimentoRealtime } from '../composables/useRealtimeTimer'

const props = defineProps<{
  show: boolean
  numeroSenha: string
  estatisticas: Estatisticas | null
  estado?: EstadoSistema
}>()

const emit = defineEmits<{
  'close': []
  'chamar': [numero: string]
  'editar': [numero: string]
  'excluir': [numero: string]
  'retornar': [numero: string]
  'ausente': [numero: string]
}>()

// Buscar senha atualizada do estado (sempre dinâmica)
const ticketSelecionado = computed(() => {
  if (!props.estado || !props.numeroSenha) return null
  return props.estado.senhas.find(s => s.numero === props.numeroSenha) || null
})

const handleClose = () => {
  emit('close')
}

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
    'nao_compareceu': 'Ausente',
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
  if (!ticketSelecionado.value || !props.estado || ticketSelecionado.value.status !== 'espera') {
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

  const position = filaSimulada.findIndex(s => s.numero === ticketSelecionado.value!.numero)
  const peopleAhead = position !== -1 ? `${position} pessoas na frente` : 'N/A'

  return { position, peopleAhead, filaSimulada }
})

// Service time estimate calculation
const serviceEstimate = computed(() => {
  if (!ticketSelecionado.value || ticketSelecionado.value.status !== 'espera' || !props.estado) {
    return { estimateMs: 0, estimateFormatted: '---', eta: '---' }
  }

  const pos = queuePosition.value.position
  if (pos < 0 || !props.estatisticas) {
    return { estimateMs: 0, estimateFormatted: '---', eta: '---' }
  }

  const tmaDefault = props.estatisticas.tempoMedioAtendimentoGeralMs || 300000
  const tmaPorTipo = {
    prioridade: props.estatisticas.detalhesPorTipo?.prioridade?.tempoMedioAtendimentoMs || tmaDefault,
    contratual: props.estatisticas.detalhesPorTipo?.contratual?.tempoMedioAtendimentoMs || tmaDefault,
    normal: props.estatisticas.detalhesPorTipo?.normal?.tempoMedioAtendimentoMs || tmaDefault
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

// Real-time time updates
const tempoEsperaRealtime = useRealtimeTimer(() => {
  if (!ticketSelecionado.value) return 0
  const s = ticketSelecionado.value
  if (s.chamadaTimestamp) {
    return (s.tempoEspera ?? (s.chamadaTimestamp - s.timestamp))
  }
  return calcularTempoEsperaRealtime(s)
})

const tempoAtendimentoRealtime = useRealtimeTimer(() => {
  if (!ticketSelecionado.value) return 0
  return calcularTempoAtendimentoRealtime(ticketSelecionado.value)
})
</script>

<style scoped>
.modal-overlay.modal-ticket {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3500;
  backdrop-filter: blur(4px);
}

.modal-content-ticket {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: #868e96;
  cursor: pointer;
  transition: color 0.3s;
  z-index: 10;
}

.close-btn:hover {
  color: #495057;
}

.modal-title {
  text-align: center;
  color: #495057;
  font-size: 1.5em;
  margin-bottom: 30px;
}

.ticket-details {
  max-width: 700px;
  margin: 0 auto;
}

.ticket-number-display {
  text-align: center;
  font-size: 3em;
  font-weight: bold;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  letter-spacing: 3px;
}

.ticket-number-display.prioridade {
  color: white;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.ticket-number-display.normal {
  color: white;
  background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
  box-shadow: 0 4px 15px rgba(77, 171, 247, 0.4);
}

.ticket-number-display.contratual {
  color: white;
  background: linear-gradient(135deg, #845ef7 0%, #7048e8 100%);
  box-shadow: 0 4px 15px rgba(132, 94, 247, 0.4);
}

.ticket-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn-ticket-action {
  padding: 8px 12px;
  border: 1px solid;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95em;
  transition: all 0.2s;
}

.btn-ticket-action:hover {
  transform: translateY(-1px);
}

.btn-ticket-action.btn-call {
  color: #51cf66;
  border-color: #51cf66;
}

.btn-ticket-action.btn-call:hover {
  background-color: #51cf66;
  color: white;
}

.btn-ticket-action.btn-edit {
  color: #4dabf7;
  border-color: #4dabf7;
}

.btn-ticket-action.btn-edit:hover {
  background-color: #4dabf7;
  color: white;
}

.btn-ticket-action.btn-delete {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-ticket-action.btn-delete:hover {
  background-color: #ff6b6b;
  color: white;
}

.btn-ticket-action.btn-return {
  color: #ffa500;
  border-color: #ffa500;
}

.btn-ticket-action.btn-return:hover {
  background-color: #ffa500;
  color: white;
}

.btn-ticket-action.btn-absent {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-ticket-action.btn-absent:hover {
  background-color: #ff6b6b;
  color: white;
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

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content-ticket,
.modal-leave-active .modal-content-ticket {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-ticket,
.modal-leave-to .modal-content-ticket {
  transform: scale(0.9);
}
</style>
