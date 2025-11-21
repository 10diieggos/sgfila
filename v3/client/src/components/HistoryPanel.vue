<template>
  <div class="history-panel">
    <h3><i class="fas fa-history"></i> Histórico de Atendimentos</h3>

    <!-- Busca -->
    <div class="search-wrapper">
      <i class="fas fa-search"></i>
      <input
        v-model="termoBusca"
        type="text"
        placeholder="Buscar na descrição ou número..."
      />
    </div>

    <!-- Lista de senhas -->
    <div class="ticket-list">
      <div v-if="senhasFiltradas.length === 0" class="empty-message">
        Nenhum atendimento encontrado
      </div>

      <div
        v-for="senha in senhasFiltradas"
        :key="senha.numero"
        :class="['ticket-item', senha.tipo]"
      >
        <div class="ticket-info">
          <i :class="getIconClass(senha.tipo)"></i>
          <strong>{{ senha.numero }}</strong>
          <div v-if="senha.servicoDoCliente" class="ticket-service">{{ senha.servicoDoCliente }}</div>
          <div v-if="senha.descricao" class="ticket-description" v-html="formatarDescricao(senha.descricao)"></div>
        </div>

        <div class="ticket-controls">
          <span :class="['status-badge', senha.status]">
            {{ getStatusLabel(senha.status) }}
          </span>
          <span class="wait-time">{{ formatarTempoHMS(senha.tempoEspera + senha.tempoAtendimento) }}</span>

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
            <button @click="$emit('retornar', senha.numero)" class="btn-action btn-return" title="Retornar à Fila">
              <i class="fas fa-undo"></i>
            </button>
            <button @click="$emit('ausente', senha.numero)" class="btn-action btn-absent" title="Marcar como Ausente">
              <i class="fas fa-user-slash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Senha } from '@shared/types'
import { getIconClass, formatarDescricao, formatarTempoHMS } from '../composables/useUtils'

const props = defineProps<{
  senhas: Senha[]
}>()

defineEmits<{
  'ver-detalhes': [numero: string]
  'chamar': [numero: string]
  'editar': [numero: string]
  'excluir': [numero: string]
  'retornar': [numero: string]
  'ausente': [numero: string]
}>()

const termoBusca = ref('')

const senhasHistorico = computed(() => {
  return props.senhas
    .filter(s => s.status === 'atendida' || s.status === 'nao_compareceu' || s.status === 'excluida')
    .sort((a, b) => {
      // Ordenar por finalizadoTimestamp (quando foi finalizada/marcada ausente/excluída)
      // Usar timestamp como fallback se finalizadoTimestamp não existir
      const timestampA = a.finalizadoTimestamp || a.timestamp
      const timestampB = b.finalizadoTimestamp || b.timestamp
      return timestampB - timestampA // Mais recentes primeiro
    })
})

const senhasFiltradas = computed(() => {
  let result = senhasHistorico.value

  // Aplica busca
  if (termoBusca.value) {
    const termo = termoBusca.value.toLowerCase()
    result = result.filter(s =>
      s.numero.toLowerCase().includes(termo) ||
      s.descricao?.toLowerCase().includes(termo) || s.servicoDoCliente?.toLowerCase().includes(termo)
    )
  }

  return result
})

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'atendida': 'Atendida',
    'nao_compareceu': 'Ausente',
    'excluida': 'Excluída'
  }
  return labels[status] || status
}
</script>

<style scoped>
.history-panel h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  color: #004a8d;
  font-size: 1.2em;
}

.search-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-wrapper i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #868e96;
}

.search-wrapper input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.search-wrapper input:focus {
  outline: none;
  border-color: #667eea;
}

.ticket-list {
  max-height: 550px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 5px;
}

.ticket-list::-webkit-scrollbar {
  width: 8px;
}

.ticket-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.ticket-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.ticket-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #868e96;
  font-size: 1em;
}

.ticket-item {
  background: white;
  border-radius: 8px;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ticket-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ticket-item.prioridade {
  background-color: #fff5f5;
  border-left-color: #ff6b6b;
}

.ticket-item.normal {
  background-color: #f0f8ff;
  border-left-color: #4dabf7;
}

.ticket-item.contratual {
  background-color: #f3e8ff;
  border-left-color: #845ef7;
}

.ticket-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.ticket-info i {
  font-size: 1.3em;
}

.ticket-item.prioridade .ticket-info i {
  color: #ff6b6b;
}

.ticket-item.normal .ticket-info i {
  color: #4dabf7;
}

.ticket-item.contratual .ticket-info i {
  color: #845ef7;
}

.ticket-info strong {
  font-size: 1.1em;
  color: #333;
  min-width: 70px;
}

.ticket-description {
  font-size: 0.85em;
  color: #868e96;
  font-style: italic;
  flex: 1;
}

.ticket-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 600;
}

.status-badge.atendida {
  background: #d4edda;
  color: #155724;
}

.status-badge.nao_compareceu {
  background: #fff3cd;
  color: #856404;
}

.status-badge.excluida {
  background: #f8d7da;
  color: #721c24;
}

.wait-time {
  font-size: 0.85em;
  color: #868e96;
  font-weight: 600;
  min-width: 60px;
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.btn-action {
  padding: 6px 10px;
  border: 1px solid;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-info {
  color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  background-color: #17a2b8;
  color: white;
}

.btn-call {
  color: #51cf66;
  border-color: #51cf66;
}

.btn-call:hover {
  background-color: #51cf66;
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

.btn-return {
  color: #ffa500;
  border-color: #ffa500;
}

.btn-return:hover {
  background-color: #ffa500;
  color: white;
}

.btn-absent {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-absent:hover {
  background-color: #ff6b6b;
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
</style>
