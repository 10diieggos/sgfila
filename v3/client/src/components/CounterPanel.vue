<template>
  <div class="counter-panels-wrapper">
    <div class="header-with-button">
      <h3><i class="fas fa-desktop" /> Painéis de Guichê</h3>
      <button
        class="btn-config-small"
        title="Configurar Guichês"
        @click="emit('open-config')"
      >
        <i class="fas fa-cog" />
      </button>
    </div>

    <div
      v-if="guichesVisiveis.length === 0"
      class="empty-state"
    >
      <i class="fas fa-info-circle" />
      <p>Nenhum guichê configurado para exibição.</p>
      <p class="hint">
        Configure os guichês na aba Configurações.
      </p>
    </div>

    <div
      v-else
      class="counter-panels"
    >
      <div
        v-for="guiche in guichesVisiveis"
        :key="guiche.id"
        class="guiche-painel"
      >
        <div
          :class="['senha-atual-guiche', getSenhaClass(guiche.id), { 'disabled': !guiche.ativo }]"
          :data-guiche-id="guiche.id"
          @click="handleGuicheClick(guiche)"
        >
          <span class="guiche-painel-nome">{{ guiche.nome }}</span>
          <template v-if="senhaAtual(guiche.id)">
            <span class="senha-numero">
              {{ senhaAtual(guiche.id)?.numero }}
            </span>
            <span
              v-if="aiDecision && aiDecision.numero === senhaAtual(guiche.id)?.numero"
              class="ai-badge"
              :title="`Decisão IA: ${aiDecision.source}`"
            >
              <i class="fas fa-robot" />
            </span>
            <div class="tempos-container">
              <span class="tempo-espera">
                <i class="fas fa-hourglass-half" />
                {{ formatTempoEspera(guiche.id) }}
              </span>
              <span class="tempo-atendimento">
                <i class="fas fa-clock" />
                {{ formatTempoAtendimento(guiche.id) }}
              </span>
            </div>
          </template>
          <span
            v-else
            class="senha-numero vazio"
          >
            {{ filaVazia ? 'Fila Esgotada' : '---' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Guiche, Senha, AtendimentoAtual } from '@shared/types'
import { formatarTempoHMS } from '../composables/useUtils'

const props = withDefaults(defineProps<{
  guiches: Guiche[]
  atendimentosAtuais: AtendimentoAtual
  guichesExibicao?: string[]
  filaVazia?: boolean
  aiDecision?: { numero: string; source: string } | null
}>(), {
  guichesExibicao: () => [],
  filaVazia: false
})

const emit = defineEmits<{
  'chamar': [guicheId: string]
  'finalizar': [guicheId: string]
  'nao-compareceu': [guicheId: string]
  'open-config': []
}>()

// Força atualização a cada segundo para o contador
const currentTime = ref(Date.now())
let intervalId: number | null = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

const guichesVisiveis = computed(() => {
  if (props.guichesExibicao.length === 0) {
    return props.guiches
  }
  return props.guiches.filter(g => props.guichesExibicao.includes(g.id))
})

const senhaAtual = (guicheId: string): Senha | undefined => {
  return props.atendimentosAtuais[guicheId]
}

const getSenhaClass = (guicheId: string): string => {
  const senha = senhaAtual(guicheId)
  return senha ? senha.tipo : ''
}

const formatTempoEspera = (guicheId: string): string => {
  const senha = senhaAtual(guicheId)
  if (!senha || !senha.timestamp) return '0:00:00'

  if (senha.chamadaTimestamp) {
    const fixo = (senha.tempoEspera ?? (senha.chamadaTimestamp - senha.timestamp))
    return formatarTempoHMS(fixo)
  }

  let tempoMs = currentTime.value - senha.timestamp

  // Se estava em ausência, subtrai o tempo pausado
  if (senha.pausarContagemTempo && senha.timestampInicioAusencia) {
    const tempoPausado = currentTime.value - senha.timestampInicioAusencia
    tempoMs -= tempoPausado
  }

  return formatarTempoHMS(tempoMs)
}

const formatTempoAtendimento = (guicheId: string): string => {
  const senha = senhaAtual(guicheId)
  if (!senha || !senha.chamadaTimestamp) return '0:00:00'
  const tempoMs = currentTime.value - senha.chamadaTimestamp
  return formatarTempoHMS(tempoMs)
}

const handleGuicheClick = (guiche: Guiche) => {
  if (!guiche.ativo) return

  const senha = senhaAtual(guiche.id)
  if (senha) {
    // Se tem senha, finaliza
    emit('finalizar', guiche.id)
  } else {
    // Se não tem senha, chama próxima
    if (!props.filaVazia) {
      emit('chamar', guiche.id)
    }
  }
}
</script>

<style scoped>
.header-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid #eee;
}

.counter-panels-wrapper h3 {
  margin: 0;
  color: #004a8d;
  font-size: 1.1em;
}

.btn-config-small {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #6c757d;
  background: transparent;
  color: #6c757d;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-config-small:hover {
  background: #6c757d;
  color: white;
  transform: scale(1.05);
}

.btn-config-small i {
  font-size: 0.9em;
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
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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

.ai-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  background: #e7f5ff;
  color: #004a8d;
  border: 1px solid #4dabf7;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 0.85rem;
}

.senha-numero.vazio {
  color: #adb5bd;
  font-size: 1.2rem;
}

.tempos-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 12px;
  width: 100%;
}

.tempo-espera,
.tempo-atendimento {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.85rem;
  color: inherit;
  font-weight: normal;
  gap: 4px;
}

.tempo-espera i,
.tempo-atendimento i {
  font-size: 1.1em;
  opacity: 0.7;
}
</style>
