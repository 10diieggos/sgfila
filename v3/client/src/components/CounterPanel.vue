<template>
  <div class="counter-panels-wrapper">
    <h3><i class="fas fa-desktop"></i> Painéis de Guichê</h3>

    <div v-if="guichesVisiveis.length === 0" class="empty-state">
      <i class="fas fa-info-circle"></i>
      <p>Nenhum guichê configurado para exibição.</p>
      <p class="hint">Configure os guichês na aba Configurações.</p>
    </div>

    <div v-else class="counter-panels">
      <div
        v-for="guiche in guichesVisiveis"
        :key="guiche.nome"
        :class="['counter-panel', { 'inactive': !guiche.ativo }]"
      >
        <div class="counter-header">
          <h4>{{ guiche.nome }}</h4>
          <span v-if="!guiche.ativo" class="badge-inactive">Inativo</span>
        </div>

        <div v-if="senhaAtual(guiche.nome)" class="current-ticket">
          <div class="ticket-number">{{ senhaAtual(guiche.nome)?.numero }}</div>
          <div class="ticket-info">
            <span :class="['ticket-type', senhaAtual(guiche.nome)?.tipo]">
              {{ getTipoLabel(senhaAtual(guiche.nome)?.tipo!) }}
            </span>
            <span class="ticket-time">
              <i class="fas fa-clock"></i>
              {{ formatTempoAtendimento(senhaAtual(guiche.nome)!) }}
            </span>
          </div>

          <div class="counter-actions">
            <button
              class="btn btn-finish"
              @click="$emit('finalizar', guiche.nome)"
              :disabled="!guiche.ativo"
            >
              <i class="fas fa-check"></i> Finalizar
            </button>
            <button
              class="btn btn-no-show"
              @click="$emit('nao-compareceu', guiche.nome)"
              :disabled="!guiche.ativo"
            >
              <i class="fas fa-user-slash"></i> Não Compareceu
            </button>
          </div>
        </div>

        <div v-else class="no-ticket">
          <i class="fas fa-chair"></i>
          <p>Livre</p>
          <button
            class="btn btn-call"
            @click="$emit('chamar', guiche.nome)"
            :disabled="!guiche.ativo || filaVazia"
          >
            <i class="fas fa-bell"></i> Chamar Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Guiche, Senha, AtendimentoAtual } from '@shared/types'
import { formatarTempo } from '../composables/useUtils'

const props = withDefaults(defineProps<{
  guiches: Guiche[]
  atendimentosAtuais: AtendimentoAtual
  guichesExibicao?: string[]
  filaVazia?: boolean
}>(), {
  guichesExibicao: () => [],
  filaVazia: false
})

defineEmits<{
  'chamar': [guicheNome: string]
  'finalizar': [guicheNome: string]
  'nao-compareceu': [guicheNome: string]
}>()

const guichesVisiveis = computed(() => {
  if (props.guichesExibicao.length === 0) {
    return props.guiches
  }
  return props.guiches.filter(g => props.guichesExibicao.includes(g.nome))
})

const senhaAtual = (guicheNome: string): Senha | undefined => {
  return props.atendimentosAtuais[guicheNome]
}

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
.counter-panels-wrapper h3 {
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
  margin: 5px 0;
}

.empty-state .hint {
  font-size: 0.9em;
  color: #adb5bd;
}

.counter-panels {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.counter-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s, box-shadow 0.3s;
}

.counter-panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.counter-panel.inactive {
  background: linear-gradient(135deg, #868e96 0%, #6c757d 100%);
  opacity: 0.7;
}

.counter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.counter-header h4 {
  margin: 0;
  font-size: 1.2em;
}

.badge-inactive {
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 600;
}

.current-ticket {
  text-align: center;
}

.ticket-number {
  font-size: 3em;
  font-weight: bold;
  margin: 15px 0;
  letter-spacing: 2px;
}

.ticket-info {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.ticket-type {
  background: rgba(255, 255, 255, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.ticket-time {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85em;
}

.counter-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.no-ticket {
  text-align: center;
  padding: 30px 0;
}

.no-ticket i {
  font-size: 3em;
  opacity: 0.7;
  margin-bottom: 10px;
}

.no-ticket p {
  margin: 10px 0 20px 0;
  font-size: 1.2em;
  opacity: 0.9;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-call {
  background: white;
  color: #667eea;
  width: 100%;
}

.btn-call:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.btn-finish {
  background: rgba(40, 167, 69, 0.9);
  color: white;
}

.btn-finish:hover:not(:disabled) {
  background: rgba(40, 167, 69, 1);
}

.btn-no-show {
  background: rgba(220, 53, 69, 0.9);
  color: white;
}

.btn-no-show:hover:not(:disabled) {
  background: rgba(220, 53, 69, 1);
}
</style>
