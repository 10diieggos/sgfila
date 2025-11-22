<template>
  <div class="queue-list">
    <h3 :style="{ color: props.estado?.configuracoes?.designTokens?.colors?.primary || '#004a8d' }"><i class="fas fa-clock" /> Fila de Espera</h3>

    <div class="ai-status">
      <span :class="['ai-badge', iaSource === 'fallback' ? 'warn' : 'ok']">IA: {{ iaSource === 'fallback' ? 'Fallback' : iaSource === 'onnx' ? 'ONNX' : 'Indefinida' }}</span>
      <span
        v-if="lastHintStatus !== null"
        :class="['hint-badge', lastHintStatus ? 'ok' : 'warn']"
      >Dica ML: {{ lastHintStatus ? 'Aceita' : 'Rejeitada' }}</span>
    </div>

    <!-- Filtros -->
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <button
          v-for="filtro in filtros"
          :key="filtro.value"
          :class="['btn-filter', { active: filtroAtivo === filtro.value }]"
          :title="filtro.title"
          @click="filtroAtivo = filtro.value"
        >
          <i :class="filtro.icon" /> {{ filtro.label }}
        </button>
      </div>

      <div class="search-wrapper">
        <i class="fas fa-search" />
        <input
          v-model="termoBusca"
          type="text"
          placeholder="Buscar por serviço ou descrição..."
        >
      </div>
    </div>

    <!-- Lista de senhas -->
    <div class="ticket-list">
      <div
        v-if="senhasFiltradas.length === 0"
        class="empty-message"
      >
        {{ mensagemVazia }}
      </div>

      <div
        v-for="senha in senhasFiltradas"
        :key="senha.numero"
        :class="['ticket-item', senha.tipo, (props.estado?.configuracoes?.correcoes?.destacarSenhasTempoLimite && senha.tempoLimiteAtingido) ? 'tempo-limite' : '']"
      >
        <div class="ticket-info">
          <i :class="getIconClass(senha.tipo)" />
          <strong>{{ senha.numero }}</strong>
          <div
            v-if="senha.servicoDoCliente"
            class="ticket-service"
          >
            {{ senha.servicoDoCliente }}
          </div>
          <div
            v-if="senha.descricao"
            class="ticket-description"
            v-html="formatarDescricao(senha.descricao)"
          />
        </div>

        <div class="ticket-controls">
          <span class="wait-time">{{ formatarTempoHMS(currentTime - senha.timestamp) }}</span>
          <span
            v-if="props.estado?.configuracoes?.correcoes?.mostrarHistoricoAusencias && senha.tentativasAusencia > 0"
            class="badge-ausencia"
            :title="`Ausências: ${senha.tentativasAusencia}`"
          >Aus {{ senha.tentativasAusencia }}</span>

          <div class="action-buttons">
            <button
              class="btn-action btn-info"
              title="Ver Detalhes"
              @click="$emit('ver-detalhes', senha.numero)"
            >
              <i class="fas fa-info-circle" />
            </button>
            <button
              class="btn-action btn-call"
              title="Chamar esta senha"
              @click="$emit('chamar', senha.numero)"
            >
              <i class="fas fa-bullhorn" />
            </button>
            <button
              class="btn-action btn-edit"
              title="Editar Descrição"
              @click="$emit('editar', senha.numero)"
            >
              <i class="fas fa-edit" />
            </button>
            <button
              class="btn-action btn-delete"
              title="Excluir"
              @click="$emit('excluir', senha.numero)"
            >
              <i class="fas fa-trash-alt" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Senha, FiltroFila, EstadoSistema } from '@shared/types'
import { getIconClass, formatarDescricao, formatarTempoHMS } from '@/composables/useUtils'
import { predictNextOrFallback } from '@/ml/inference'

// Props
interface Props {
  senhas: Senha[]
  proporcaoPrioridade?: number
  proporcaoContratual?: number
  contadorPrioridadeDesdeUltimaNormal?: number
  contadorContratualDesdeUltimaNormal?: number
  algoritmo?: 'proporcao' | 'round_robin' | 'fifo' | 'jsed_fair_wrr'
  estado?: EstadoSistema
  previewJSED?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  senhas: () => [],
  proporcaoPrioridade: 2,
  proporcaoContratual: 1,
  contadorPrioridadeDesdeUltimaNormal: 0,
  contadorContratualDesdeUltimaNormal: 0,
  algoritmo: 'proporcao'
})

// Emits
const emit = defineEmits<{
  'ver-detalhes': [numero: string]
  chamar: [numero: string]
  editar: [numero: string]
  excluir: [numero: string]
  'solicitar-preview-jsed': [limit?: number]
}>()

// State
const filtroAtivo = ref<FiltroFila>('emissao')
const termoBusca = ref('')
const iaPreviewNumero = ref<string | null>(null)
const iaSource = ref<string | null>(null)
const lastHintStatus = ref<boolean | null>(null)

// Força atualização a cada segundo
const currentTime = ref(Date.now())
let intervalId: number | null = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
  const updateAi = () => {
    const src = (window as any)._sgfAiSource
    iaSource.value = typeof src === 'string' ? src : ((window as any)._sgfAiRuntimeUnavailable ? 'fallback' : null)
    try {
      const raw = localStorage.getItem('sgfila_ml_telemetry')
      if (raw) {
        const arr = JSON.parse(raw)
        const last = Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null
        lastHintStatus.value = last && typeof last.accepted_hint === 'boolean' ? last.accepted_hint : null
      }
    } catch {
      lastHintStatus.value = null
    }
  }
  updateAi()
  window.setInterval(updateAi, 1500)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

// Atualiza prévia IA quando filtro automático está ativo
watch([filtroAtivo, () => props.senhas, () => props.estado], async () => {
  if (filtroAtivo.value === 'automatica' && props.estado && props.senhas.length > 0) {
    if (props.algoritmo === 'jsed_fair_wrr') {
      emit('solicitar-preview-jsed', 50)
      iaPreviewNumero.value = null
    } else {
      try {
        const pred = await predictNextOrFallback(props.estado)
        iaPreviewNumero.value = pred.numeroPrevisto || null
      } catch {
        iaPreviewNumero.value = null
      }
    }
  } else {
    iaPreviewNumero.value = null
  }
})

// Filtros disponíveis
const filtros = [
  { value: 'emissao' as FiltroFila, label: 'Emissão', icon: 'fas fa-clock', title: 'Ordenar por ordem de chegada' },
  { value: 'automatica' as FiltroFila, label: 'Automática', icon: 'fas fa-cogs', title: 'Ordenar pela lógica de proporção' },
  { value: 'tipo' as FiltroFila, label: 'Tipo', icon: 'fas fa-layer-group', title: 'Agrupar por tipo' }
]

// Computed
const senhasFiltradas = computed(() => {
  let result = props.senhas.filter(s => s.status === 'espera')

  // Aplica busca
  if (termoBusca.value) {
    const termo = termoBusca.value.toLowerCase()
    result = result.filter(s => (s.descricao?.toLowerCase().includes(termo) || s.servicoDoCliente?.toLowerCase().includes(termo)))
  }

  // Aplica ordenação
  if (filtroAtivo.value === 'emissao') {
    result.sort((a, b) => a.timestamp - b.timestamp)
  } else if (filtroAtivo.value === 'tipo') {
    const ordem: Record<string, number> = { prioridade: 1, contratual: 2, normal: 3 }
    result.sort((a, b) => {
      if (ordem[a.tipo] !== ordem[b.tipo]) {
        return ordem[a.tipo] - ordem[b.tipo]
      }
      return a.timestamp - b.timestamp
    })
  } else if (filtroAtivo.value === 'automatica') {
    const algoritmo = props.algoritmo || 'proporcao'

    if (algoritmo === 'fifo') {
      result.sort((a, b) => a.timestamp - b.timestamp)
    } else if (algoritmo === 'round_robin') {
      // Round Robin: alterna entre tipos
      const filaSimulada: Senha[] = []
      let simFilaEspera = [...result].sort((a, b) => a.timestamp - b.timestamp)
      let simContadorP = props.contadorPrioridadeDesdeUltimaNormal || 0
      let simContadorC = props.contadorContratualDesdeUltimaNormal || 0
      const totalContador = simContadorP + simContadorC
      let ciclo = totalContador % 3

      while (simFilaEspera.length > 0) {
        const prioritarias = simFilaEspera.filter(s => s.tipo === 'prioridade')
        const contratuais = simFilaEspera.filter(s => s.tipo === 'contratual')
        const normais = simFilaEspera.filter(s => s.tipo === 'normal')

        let proximaSimulada: Senha | null = null

        if (ciclo === 0 && prioritarias.length > 0) {
          proximaSimulada = prioritarias[0]
          simContadorP++
        } else if (ciclo === 1 && contratuais.length > 0) {
          proximaSimulada = contratuais[0]
          simContadorC++
        } else if (normais.length > 0) {
          proximaSimulada = normais[0]
          simContadorP = 0
          simContadorC = 0
        } else if (prioritarias.length > 0) {
          proximaSimulada = prioritarias[0]
        } else if (contratuais.length > 0) {
          proximaSimulada = contratuais[0]
        }

        if (proximaSimulada) {
          filaSimulada.push(proximaSimulada)
          simFilaEspera = simFilaEspera.filter(s => s.numero !== proximaSimulada!.numero)
          ciclo = (ciclo + 1) % 3
        } else {
          break
        }
      }
      result = filaSimulada
    } else if (algoritmo === 'jsed_fair_wrr' && Array.isArray(props.previewJSED) && props.previewJSED.length > 0) {
      const indexMap: Record<string, number> = {}
      props.previewJSED.forEach((num, idx) => { indexMap[num] = idx })
      result.sort((a, b) => {
        const iaA = indexMap[a.numero]
        const iaB = indexMap[b.numero]
        if (iaA !== undefined && iaB !== undefined) return iaA - iaB
        if (iaA !== undefined) return -1
        if (iaB !== undefined) return 1
        return a.timestamp - b.timestamp
      })
    } else {
      // Proporção (padrão)
      const filaSimulada: Senha[] = []
      let simFilaEspera = [...result].sort((a, b) => a.timestamp - b.timestamp)
      let simContadorP = props.contadorPrioridadeDesdeUltimaNormal || 0
      let simContadorC = props.contadorContratualDesdeUltimaNormal || 0
      const proporcaoP = props.proporcaoPrioridade || 2
      const proporcaoC = props.proporcaoContratual || 1

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
          simContadorP++
        }
        else if (contratualMaisAntiga) {
          proximaSimulada = contratualMaisAntiga
          simContadorC++
        }

        if (proximaSimulada) {
          filaSimulada.push(proximaSimulada)
          simFilaEspera = simFilaEspera.filter(s => s.numero !== proximaSimulada!.numero)
        } else {
          break
        }
      }
      result = filaSimulada
    }

    // Reordenar colocando a prévia IA no topo (não definitivo)
    if (iaPreviewNumero.value) {
      const idx = result.findIndex(s => s.numero === iaPreviewNumero.value)
      if (idx > 0) {
        const [item] = result.splice(idx, 1)
        result.unshift(item)
      }
    }
  }

  return result
})

const mensagemVazia = computed(() => {
  if (termoBusca.value) {
    return 'Nenhuma senha encontrada com essa descrição.'
  }
  return 'Nenhuma senha na fila'
})
</script>

<style scoped>
.queue-list h3 {
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid #eee;
  color: #004a8d;
  font-size: 1.1em;
}

/* Filtros */
.filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-buttons {
  display: flex;
  gap: 5px;
  flex-grow: 1;
}

.btn-filter {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f8f9fa;
  color: #555;
  font-size: 0.85rem;
  font-weight: normal;
  border-radius: 5px;
  cursor: pointer;
  gap: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.btn-filter i {
  font-size: 0.9rem;
}

.btn-filter:hover {
  background-color: #e9ecef;
}

.btn-filter.active {
  background-color: #004a8d;
  color: white;
  border-color: #004a8d;
  font-weight: bold;
}

.search-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  padding: 0 8px;
}

.search-wrapper i {
  color: #aaa;
  font-size: 0.9rem;
}

.search-wrapper input {
  border: none;
  padding: 6px 4px 6px 8px;
  font-size: 0.9rem;
  outline: none;
  background: transparent;
  min-width: 150px;
}

/* Lista */
.ticket-list {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f8f9fa;
}

.ticket-item {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  margin-bottom: 5px;
  transition: background-color 0.2s;
}

.ticket-item:hover {
  background-color: #e9ecef;
}

.ticket-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.ticket-item.prioridade {
  background-color: #fff5f5;
  border-left: 4px solid #ff6b6b;
}

.ticket-item.normal {
  background-color: #f8f9fa;
  border-left: 4px solid #4dabf7;
}

.ticket-item.contratual {
  background-color: #f3e8ff;
  border-left: 4px solid #845ef7;
}

.ticket-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.ticket-info i {
  font-size: 1em;
}

.ticket-info strong {
  font-size: 1em;
  font-weight: bold;
  color: #333;
  min-width: 50px;
}

.ticket-description {
  color: #666;
  font-size: 0.85em;
  font-style: italic;
}

.ticket-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wait-time {
  color: #868e96;
  font-size: 0.85em;
  min-width: 45px;
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.btn-action {
  padding: 3px 6px;
  border: 1px solid;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-call {
  color: #51cf66;
  border-color: #51cf66;
}

.btn-call:hover {
  background-color: #51cf66;
  color: white;
}

.btn-delete {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-delete:hover {
  background-color: #ff6b6b;
  color: white;
}

.btn-edit {
  color: #4dabf7;
  border-color: #4dabf7;
}

.btn-edit:hover {
  background-color: #4dabf7;
  color: white;
}

.btn-info {
  color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  background-color: #17a2b8;
  color: white;
}

.empty-message {
  padding: 20px;
  text-align: center;
  color: #868e96;
  font-size: 0.9em;
}

.tempo-limite {
  box-shadow: inset 0 0 0 2px #ff922b;
}
.badge-ausencia {
  color: #dc3545;
  border: 1px solid #dc3545;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.ai-status {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.ai-badge, .hint-badge {
  border: 1px solid;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.ai-badge.ok, .hint-badge.ok { color: #198754; border-color: #198754; }
.ai-badge.warn, .hint-badge.warn { color: #d63384; border-color: #d63384; }
</style>
