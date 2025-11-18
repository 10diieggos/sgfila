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
        class="guiche-painel"
      >
        <div
          :class="['senha-atual-guiche', getSenhaClass(guiche.nome), { 'disabled': !guiche.ativo }]"
          :data-guiche-id="guiche.nome"
          @click="handleGuicheClick(guiche)"
        >
          <span class="guiche-painel-nome">{{ guiche.nome }}</span>
          <span v-if="senhaAtual(guiche.nome)" class="senha-numero">
            {{ senhaAtual(guiche.nome)?.numero }}
          </span>
          <span v-else class="senha-numero vazio">---</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Guiche, Senha, AtendimentoAtual } from '@shared/types'

const props = withDefaults(defineProps<{
  guiches: Guiche[]
  atendimentosAtuais: AtendimentoAtual
  guichesExibicao?: string[]
  filaVazia?: boolean
}>(), {
  guichesExibicao: () => [],
  filaVazia: false
})

const emit = defineEmits<{
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

const getSenhaClass = (guicheNome: string): string => {
  const senha = senhaAtual(guicheNome)
  return senha ? senha.tipo : ''
}

const handleGuicheClick = (guiche: Guiche) => {
  if (!guiche.ativo) return

  const senha = senhaAtual(guiche.nome)
  if (senha) {
    // Se tem senha, finaliza
    emit('finalizar', guiche.nome)
  } else {
    // Se não tem senha, chama próxima
    if (!props.filaVazia) {
      emit('chamar', guiche.nome)
    }
  }
}
</script>

<style scoped>
.counter-panels-wrapper h3 {
  margin-bottom: 15px;
  color: #004a8d;
  font-size: 1.1em;
  padding-bottom: 5px;
  border-bottom: 2px solid #eee;
}

.empty-state {
  text-align: center;
  padding: 30px 15px;
  color: #868e96;
}

.empty-state i {
  font-size: 2em;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-state p {
  margin: 3px 0;
  font-size: 0.9em;
}

.empty-state .hint {
  font-size: 0.85em;
  color: #adb5bd;
}

/* Painéis em coluna única */
.counter-panels {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.guiche-painel {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
}

.senha-atual-guiche {
  text-align: center;
  font-weight: bold;
  color: #004a8d;
  padding: 10px;
  border-radius: 8px;
  background-color: #f0f8ff;
  border: 2px dashed #004a8d;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.senha-atual-guiche.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.senha-atual-guiche:hover:not(.disabled) {
  background-color: #e7f3ff;
}

/* Cores por tipo de senha */
.senha-atual-guiche.prioridade {
  background-color: #fff5f5;
  border-color: #ff6b6b;
  color: #c92a2a;
}

.senha-atual-guiche.contratual {
  background-color: #f3e8ff;
  border-color: #845ef7;
  color: #7048e8;
}

.senha-atual-guiche.normal {
  background-color: #f0f8ff;
  border-color: #4dabf7;
  color: #004a8d;
}

.guiche-painel-nome {
  display: block;
  font-weight: bold;
  color: inherit;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.senha-numero {
  font-size: 3rem;
  font-weight: bold;
  color: inherit;
  line-height: 1.1;
  display: block;
}

.senha-numero.vazio {
  color: #adb5bd;
}
</style>
