<template>
  <div class="current-attendance-wrapper">
    <h3><i class="fas fa-user-headset"></i> Atendendo (Todos)</h3>

    <div v-if="senhasAtendendo.length === 0" class="empty-state">
      <i class="fas fa-inbox"></i>
      <p>Nenhum atendimento em andamento</p>
    </div>

    <div v-else class="attendance-list">
      <div
        v-for="item in senhasAtendendo"
        :key="item.senha.numero"
        :class="['attendance-item', item.senha.tipo]"
      >
        <div class="attendance-info">
          <div class="attendance-number">{{ item.senha.numero }}</div>
          <div class="attendance-details">
            <div class="detail-row">
              <span class="label">Guichê:</span>
              <strong>{{ item.guiche }}</strong>
            </div>
            <div class="detail-row">
              <span class="label">Tipo:</span>
              <span :class="['badge-type', item.senha.tipo]">
                {{ getTipoLabel(item.senha.tipo) }}
              </span>
            </div>
            <div v-if="item.senha.descricao" class="detail-row">
              <span class="label">Descrição:</span>
              <span class="description">{{ item.senha.descricao }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Tempo:</span>
              <span class="time">
                <i class="fas fa-clock"></i>
                {{ formatTempoAtendimento(item.senha) }}
              </span>
            </div>
          </div>
        </div>

        <div class="attendance-actions">
          <button
            class="btn-icon btn-return"
            @click="$emit('devolver', item.senha.numero)"
            title="Devolver para fila"
          >
            <i class="fas fa-undo"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Senha, AtendimentoAtual } from '@shared/types'
import { formatarTempo } from '../composables/useUtils'

const props = defineProps<{
  atendimentosAtuais: AtendimentoAtual
}>()

defineEmits<{
  'devolver': [numeroSenha: string]
}>()

const senhasAtendendo = computed(() => {
  return Object.entries(props.atendimentosAtuais).map(([guiche, senha]) => ({
    guiche,
    senha
  }))
})

const getTipoLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    'prioridade': 'Prioritária',
    'normal': 'Normal',
    'contratual': 'Contratual'
  }
  return labels[tipo] || tipo
}

const formatTempoAtendimento = (senha: Senha): string => {
  if (!senha.chamadaTimestamp) return '0 min'
  const tempoMs = Date.now() - senha.chamadaTimestamp
  return formatarTempo(tempoMs)
}
</script>

<style scoped>
.current-attendance-wrapper h3 {
  margin-bottom: 20px;
  color: #495057;
  font-size: 1.3em;
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
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attendance-item {
  background: white;
  border-left: 4px solid #667eea;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.attendance-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.attendance-item.prioridade {
  border-left-color: #f5576c;
}

.attendance-item.contratual {
  border-left-color: #fa709a;
}

.attendance-item.normal {
  border-left-color: #4facfe;
}

.attendance-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.attendance-number {
  font-size: 2em;
  font-weight: bold;
  color: #667eea;
  min-width: 100px;
  text-align: center;
}

.attendance-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.label {
  color: #868e96;
  min-width: 80px;
}

.badge-type {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
}

.badge-type.prioridade {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.badge-type.contratual {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.badge-type.normal {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.description {
  color: #495057;
  font-style: italic;
}

.time {
  color: #667eea;
  font-weight: 600;
}

.attendance-actions {
  display: flex;
  gap: 8px;
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
  font-size: 1em;
}

.btn-return {
  background: #fff3cd;
  color: #856404;
}

.btn-return:hover {
  background: #ffc107;
  transform: rotate(-360deg);
}
</style>
