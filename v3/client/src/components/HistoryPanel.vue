<template>
  <div class="history-panel">
    <h2><i class="fas fa-history"></i> Histórico de Atendimentos</h2>

    <div v-if="senhasHistorico.length === 0" class="empty-state">
      <i class="fas fa-inbox"></i>
      <p>Nenhum atendimento finalizado ainda</p>
    </div>

    <div v-else class="history-list">
      <div
        v-for="senha in senhasHistorico"
        :key="senha.numero"
        :class="['history-item', senha.tipo, senha.status]"
      >
        <div class="history-number">{{ senha.numero }}</div>

        <div class="history-info">
          <div class="info-row">
            <span :class="['badge-tipo', senha.tipo]">
              {{ getTipoLabel(senha.tipo) }}
            </span>
            <span :class="['badge-status', senha.status]">
              {{ getStatusLabel(senha.status) }}
            </span>
          </div>

          <div v-if="senha.descricao" class="info-row description">
            <i class="fas fa-comment-alt"></i>
            {{ senha.descricao }}
          </div>

          <div class="info-row details">
            <span v-if="senha.guicheAtendendo">
              <i class="fas fa-desktop"></i> {{ senha.guicheAtendendo }}
            </span>
            <span v-if="senha.tempoEspera > 0">
              <i class="fas fa-hourglass-half"></i> Espera: {{ formatarTempo(senha.tempoEspera) }}
            </span>
            <span v-if="senha.tempoAtendimento > 0">
              <i class="fas fa-clock"></i> Atend: {{ formatarTempo(senha.tempoAtendimento) }}
            </span>
          </div>

          <div class="info-row timestamp">
            <i class="fas fa-calendar-alt"></i>
            Finalizada: {{ formatTimestamp(senha.finalizadoTimestamp || senha.timestamp) }}
          </div>
        </div>

        <div class="history-actions">
          <button
            class="btn-icon btn-info"
            @click="$emit('ver-detalhes', senha.numero)"
            title="Ver detalhes"
          >
            <i class="fas fa-info-circle"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Senha } from '@shared/types'
import { formatarTempo } from '../composables/useUtils'

const props = defineProps<{
  senhas: Senha[]
}>()

defineEmits<{
  'ver-detalhes': [numero: string]
}>()

const senhasHistorico = computed(() => {
  return props.senhas
    .filter(s => s.status === 'atendida' || s.status === 'nao_compareceu')
    .sort((a, b) => (b.finalizadoTimestamp || b.timestamp) - (a.finalizadoTimestamp || a.timestamp))
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
    'atendida': 'Atendida',
    'nao_compareceu': 'Não Compareceu'
  }
  return labels[status] || status
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.history-panel h2 {
  color: #495057;
  font-size: 1.3em;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #868e96;
}

.empty-state i {
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 1.1em;
}

.history-list {
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 5px;
}

.history-list::-webkit-scrollbar {
  width: 8px;
}

.history-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.history-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.history-item {
  background: white;
  border-left: 4px solid #667eea;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.history-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.history-item.prioridade {
  border-left-color: #f5576c;
}

.history-item.contratual {
  border-left-color: #fa709a;
}

.history-item.normal {
  border-left-color: #4facfe;
}

.history-item.nao_compareceu {
  opacity: 0.7;
  background: #fff3cd;
}

.history-number {
  font-size: 2em;
  font-weight: bold;
  color: #667eea;
  min-width: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.9em;
}

.info-row.description {
  color: #495057;
  font-style: italic;
}

.info-row.details {
  color: #868e96;
}

.info-row.timestamp {
  color: #adb5bd;
  font-size: 0.85em;
}

.badge-tipo {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
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

.badge-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.badge-status.atendida {
  background: #d4edda;
  color: #155724;
}

.badge-status.nao_compareceu {
  background: #fff3cd;
  color: #856404;
}

.history-actions {
  display: flex;
  align-items: center;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 1.1em;
}

.btn-info {
  background: #e7f3ff;
  color: #0056b3;
}

.btn-info:hover {
  background: #007bff;
  color: white;
  transform: scale(1.1);
}
</style>
