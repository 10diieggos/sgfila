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
.queue-list h3 {
  margin-bottom: 10px;
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
</style>
