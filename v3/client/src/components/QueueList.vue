<template>
  <div class="queue-list">
    <h3><i class="fas fa-clock"></i> Fila de Espera</h3>

    <!-- Filtros -->
    <div class="filter-wrapper">
      <div class="filter-buttons">
        <button
          v-for="filtro in filtros"
          :key="filtro.value"
          :class="['btn-filter', { active: filtroAtivo === filtro.value }]"
          @click="filtroAtivo = filtro.value"
          :title="filtro.title"
        >
          <i :class="filtro.icon"></i> {{ filtro.label }}
        </button>
      </div>

      <div class="search-wrapper">
        <i class="fas fa-search"></i>
        <input
          v-model="termoBusca"
          type="text"
          placeholder="Buscar na descrição..."
        />
      </div>
    </div>

    <!-- Lista de senhas -->
    <div class="ticket-list">
      <div v-if="senhasFiltradas.length === 0" class="empty-message">
        {{ mensagemVazia }}
      </div>

      <div
        v-for="senha in senhasFiltradas"
        :key="senha.numero"
        :class="['ticket-item', senha.tipo]"
      >
        <div class="ticket-info">
          <i :class="getIconClass(senha.tipo)"></i>
          <strong>{{ senha.numero }}</strong>
          <div v-if="senha.descricao" class="ticket-description" v-html="formatarDescricao(senha.descricao)"></div>
        </div>

        <div class="ticket-controls">
          <span class="wait-time">{{ calcularTempoEspera(senha.timestamp) }} min</span>

          <div class="action-buttons">
            <button @click="$emit('ver-detalhes', senha.numero)" class="btn-action btn-info" title="Ver Detalhes">
              <i class="fas fa-info-circle"></i>
            </button>
            <button @click="$emit('chamar', senha.numero)" class="btn-action btn-call" title="Chamar esta senha">
              <i class="fas fa-bullhorn"></i>
            </button>
            <button @click="$emit('editar', senha.numero)" class="btn-action btn-edit" title="Editar Descrição">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="$emit('excluir', senha.numero)" class="btn-action btn-delete" title="Excluir">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Senha, FiltroFila } from '@shared/types'
import { calcularTempoEspera, getIconClass, formatarDescricao } from '@/composables/useUtils'

// Props
interface Props {
  senhas: Senha[]
}

const props = withDefaults(defineProps<Props>(), {
  senhas: () => []
})

// Emits
defineEmits<{
  'ver-detalhes': [numero: string]
  chamar: [numero: string]
  editar: [numero: string]
  excluir: [numero: string]
}>()

// State
const filtroAtivo = ref<FiltroFila>('emissao')
const termoBusca = ref('')

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
    result = result.filter(s => s.descricao?.toLowerCase().includes(termo))
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
  }
  // TODO: Implementar filtro 'automatica' com lógica de proporção

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
.queue-list {
  padding: 20px;
}

.filter-wrapper {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.btn-filter {
  padding: 8px 16px;
  border: 2px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-filter:hover {
  background: #f8f9fa;
}

.btn-filter.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 200px;
}

.search-wrapper input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ticket-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background: white;
  border-left: 4px solid;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ticket-item.prioridade {
  border-left-color: #dc3545;
}

.ticket-item.contratual {
  border-left-color: #ffc107;
}

.ticket-item.normal {
  border-left-color: #28a745;
}

.ticket-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ticket-description {
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}

.ticket-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.wait-time {
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-call {
  background: #007bff;
  color: white;
}

.btn-edit {
  background: #ffc107;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-action:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.empty-message {
  padding: 40px;
  text-align: center;
  color: #868e96;
  font-size: 16px;
}
</style>
