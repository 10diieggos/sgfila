<template>
  <div class="current-attendance-wrapper">
    <h3><i class="fas fa-user-headset"></i> Atendendo (Todos)</h3>

    <div v-if="senhasAtendendo.length === 0" class="empty-state">
      <i class="fas fa-inbox"></i>
      <p>Nenhum atendimento em andamento</p>
    </div>

    <div v-else class="lista-senhas">
      <div
        v-for="item in senhasAtendendo"
        :key="item.senha.numero"
        :class="['senha-item', item.senha.tipo]"
      >
        <div class="senha-info">
          <strong class="senha-numero-small">{{ item.senha.numero }}</strong>
          <span class="guiche-info">{{ item.guiche }}</span>
          <span class="tempo-info">
            <i class="fas fa-clock"></i>
            {{ formatTempoAtendimento(item.senha) }}
          </span>
        </div>

        <div class="senha-item-controles">
          <div class="botoes-wrapper">
            <button
              class="btn-acao-senha btn-acao-info"
              @click="$emit('ver-detalhes', item.senha.numero)"
              title="Informações"
            >
              <i class="fas fa-info-circle"></i>
            </button>
            <button
              class="btn-acao-senha btn-acao-devolver"
              @click="$emit('devolver', item.senha.numero)"
              title="Devolver para fila"
            >
              <i class="fas fa-undo"></i>
            </button>
            <button
              class="btn-acao-senha btn-acao-ausente"
              @click="$emit('ausente', item.senha.numero)"
              title="Não compareceu"
            >
              <i class="fas fa-user-slash"></i>
            </button>
          </div>
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
  'ausente': [numeroSenha: string]
  'ver-detalhes': [numeroSenha: string]
}>()

const senhasAtendendo = computed(() => {
  return Object.entries(props.atendimentosAtuais).map(([guiche, senha]) => ({
    guiche,
    senha
  }))
})

const formatTempoAtendimento = (senha: Senha): string => {
  if (!senha.chamadaTimestamp) return '0 min'
  const tempoMs = Date.now() - senha.chamadaTimestamp
  return formatarTempo(tempoMs)
}
</script>

<style scoped>
.current-attendance-wrapper h3 {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 2px solid #eee;
  color: #004a8d;
  font-size: 1.1em;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #868e96;
}

.empty-state i {
  font-size: 2em;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 0.9em;
}

.lista-senhas {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f8f9fa;
}

.senha-item {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  margin-bottom: 5px;
  transition: background-color 0.2s;
}

.senha-item:hover {
  background-color: #e9ecef;
}

.senha-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.senha-item.prioridade {
  background-color: #fff5f5;
  border-left: 4px solid #ff6b6b;
}

.senha-item.normal {
  background-color: #f8f9fa;
  border-left: 4px solid #4dabf7;
}

.senha-item.contratual {
  background-color: #f3e8ff;
  border-left: 4px solid #845ef7;
}

.senha-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.senha-numero-small {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  min-width: 60px;
}

.guiche-info {
  color: #495057;
  font-size: 0.9em;
}

.tempo-info {
  color: #868e96;
  font-size: 0.85em;
}

.senha-item-controles {
  display: flex;
  align-items: center;
}

.botoes-wrapper {
  display: flex;
  gap: 6px;
}

.btn-acao-senha {
  padding: 3px 6px;
  border: 1px solid;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-acao-info {
  color: #17a2b8;
  border-color: #17a2b8;
}

.btn-acao-info:hover {
  background-color: #17a2b8;
  color: white;
}

.btn-acao-devolver {
  color: #ffa500;
  border-color: #ffa500;
}

.btn-acao-devolver:hover {
  background-color: #ffa500;
  color: white;
}

.btn-acao-ausente {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-acao-ausente:hover {
  background-color: #ff6b6b;
  color: white;
}
</style>
