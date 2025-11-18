<template>
  <div class="configuration-panel" ref="panelRef">
    <!-- Sub-tabs -->
    <div class="sub-tab-nav">
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'guiches' }]"
        @click="changeSubTab('guiches')"
      >
        <i class="fas fa-desktop"></i> Guichês
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'proporcao' }]"
        @click="changeSubTab('proporcao')"
      >
        <i class="fas fa-balance-scale-right"></i> Proporção
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'reiniciar' }]"
        @click="changeSubTab('reiniciar')"
      >
        <i class="fas fa-redo"></i> Reiniciar
      </button>
    </div>

    <!-- Conteúdo Guichês -->
    <div v-if="activeSubTab === 'guiches'" class="sub-tab-content">
      <!-- Exibição Local -->
      <h3><i class="fas fa-desktop-alt"></i> Exibição (Este Navegador)</h3>
      <p class="hint">
        Selecione os guichês que deseja exibir no painel de controle desta aba.
        A seleção é salva automaticamente no navegador.
      </p>

      <div class="guiche-checkbox-list">
        <label
          v-for="guiche in guichesGlobais"
          :key="'exib-' + guiche.nome"
          class="checkbox-item"
        >
          <input
            type="checkbox"
            :value="guiche.nome"
            :checked="guichesExibicaoLocal.includes(guiche.nome)"
            @change="toggleGuicheExibicao(guiche.nome)"
          />
          <span>{{ guiche.nome }}</span>
          <span v-if="!guiche.ativo" class="badge-inactive">Inativo</span>
        </label>
      </div>

      <hr class="divider" />

      <!-- Guichês Globais -->
      <h3><i class="fas fa-users-cog"></i> Guichês (Global)</h3>
      <p class="hint">
        Adicione, nomeie e ative/desative guichês para <strong>todo o sistema</strong>.
        Guichês inativos não são contados na estimativa de tempo.
        As alterações são salvas automaticamente.
      </p>

      <div class="guiche-list">
        <div
          v-for="(guiche, index) in guichesGlobaisLocal"
          :key="'global-' + index"
          class="guiche-item"
        >
          <input
            type="text"
            v-model="guiche.nome"
            placeholder="Nome do guichê"
            class="guiche-input"
            @blur="salvarGuichesGlobais"
          />
          <label class="toggle-switch">
            <input
              type="checkbox"
              v-model="guiche.ativo"
              @change="salvarGuichesGlobais"
            />
            <span class="toggle-slider"></span>
          </label>
          <span class="status-label">{{ guiche.ativo ? 'Ativo' : 'Inativo' }}</span>
          <button
            class="btn-icon btn-delete"
            @click="removerGuiche(index)"
            title="Remover guichê"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <button class="btn btn-add" @click="adicionarGuiche">
        <i class="fas fa-plus"></i> Adicionar Guichê
      </button>
    </div>

    <!-- Conteúdo Proporção -->
    <div v-if="activeSubTab === 'proporcao'" class="sub-tab-content">
      <h2><i class="fas fa-balance-scale-right"></i> Configurações de Proporção</h2>
      <p class="hint">
        Defina a proporção de atendimento entre tipos de senha.
        Exemplo: P:N = 2:1 significa que a cada 2 senhas prioritárias, 1 normal é chamada.
      </p>

      <div class="ratio-controls">
        <div class="ratio-control">
          <label for="input-ratio">
            <i class="fas fa-wheelchair"></i> Proporção Prioritária : Normal (P:N):
          </label>
          <div class="ratio-input-group">
            <input
              type="number"
              id="input-ratio"
              v-model.number="proporcaoPrioridadeLocal"
              min="1"
              max="20"
              @blur="salvarProporcaoPrioridade"
            />
            <span class="ratio-separator">:</span>
            <span class="ratio-fixed">1</span>
          </div>
          <p class="ratio-explanation">
            A cada <strong>{{ proporcaoPrioridadeLocal }}</strong> senha(s) prioritária(s),
            <strong>1</strong> senha normal será chamada.
          </p>
        </div>

        <div class="ratio-control">
          <label for="input-ratio-contratual">
            <i class="fas fa-file-contract"></i> Proporção Contratual : Normal (C:N):
          </label>
          <div class="ratio-input-group">
            <input
              type="number"
              id="input-ratio-contratual"
              v-model.number="proporcaoContratualLocal"
              min="1"
              max="20"
              @blur="salvarProporcaoContratual"
            />
            <span class="ratio-separator">:</span>
            <span class="ratio-fixed">1</span>
          </div>
          <p class="ratio-explanation">
            A cada <strong>{{ proporcaoContratualLocal }}</strong> senha(s) contratual(is),
            <strong>1</strong> senha normal será chamada.
          </p>
        </div>
      </div>

      <div class="info-box">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Como funciona a lógica de proporção:</strong>
          <p>
            O sistema alterna entre prioridades e contratos conforme as proporções definidas,
            sempre respeitando a ordem de chegada dentro de cada tipo.
            Senhas prioritárias têm precedência sobre contratuais.
          </p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Reiniciar -->
    <div v-if="activeSubTab === 'reiniciar'" class="sub-tab-content">
      <h2><i class="fas fa-redo"></i> Reiniciar Sistema</h2>
      <p class="hint">
        Esta ação irá reiniciar completamente o sistema, zerando todos os contadores
        e removendo todas as senhas (em espera, em atendimento e histórico).
      </p>

      <div class="warning-box">
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <strong>⚠️ ATENÇÃO:</strong>
          <p>
            Esta ação é <strong>irreversível</strong> e irá apagar todos os dados do dia.
            Certifique-se de que deseja realmente reiniciar o sistema antes de confirmar.
          </p>
        </div>
      </div>

      <button class="btn btn-reset-danger" @click="confirmarReinicio">
        <i class="fas fa-redo"></i> Reiniciar Sistema Agora
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import type { Guiche } from '@shared/types'

const props = defineProps<{
  guichesGlobais: Guiche[]
  proporcaoPrioridade: number
  proporcaoContratual: number
}>()

const emit = defineEmits<{
  'atualizar-guiches-globais': [guiches: Guiche[]]
  'atualizar-proporcao-prioridade': [valor: number]
  'atualizar-proporcao-contratual': [valor: number]
  'atualizar-guiches-exibicao': [guiches: string[]]
  'reiniciar-sistema': []
}>()

const activeSubTab = ref<'guiches' | 'proporcao' | 'reiniciar'>('guiches')
const panelRef = ref<HTMLElement>()

// Scroll para o topo do card
const scrollToPanel = () => {
  nextTick(() => {
    panelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Mudar sub-aba com scroll
const changeSubTab = (tab: 'guiches' | 'proporcao' | 'reiniciar') => {
  activeSubTab.value = tab
  scrollToPanel()
}
const guichesGlobaisLocal = ref<Guiche[]>([])
const proporcaoPrioridadeLocal = ref(2)
const proporcaoContratualLocal = ref(1)
const guichesExibicaoLocal = ref<string[]>([])

// Carregar configuração local do localStorage
onMounted(() => {
  const saved = localStorage.getItem('sgfila_guiches_exibicao')
  if (saved) {
    guichesExibicaoLocal.value = JSON.parse(saved)
  }
})

// Sincronizar com props
watch(() => props.guichesGlobais, (newVal) => {
  guichesGlobaisLocal.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

watch(() => props.proporcaoPrioridade, (newVal) => {
  proporcaoPrioridadeLocal.value = newVal
}, { immediate: true })

watch(() => props.proporcaoContratual, (newVal) => {
  proporcaoContratualLocal.value = newVal
}, { immediate: true })

const adicionarGuiche = () => {
  const numeroGuiche = guichesGlobaisLocal.value.length + 1
  guichesGlobaisLocal.value.push({
    nome: `Guichê ${numeroGuiche}`,
    ativo: true
  })
  salvarGuichesGlobais()
}

const removerGuiche = (index: number) => {
  guichesGlobaisLocal.value.splice(index, 1)
  salvarGuichesGlobais()
}

const salvarGuichesGlobais = () => {
  emit('atualizar-guiches-globais', guichesGlobaisLocal.value)
}

const salvarProporcaoPrioridade = () => {
  emit('atualizar-proporcao-prioridade', proporcaoPrioridadeLocal.value)
}

const salvarProporcaoContratual = () => {
  emit('atualizar-proporcao-contratual', proporcaoContratualLocal.value)
}

const toggleGuicheExibicao = (nome: string) => {
  const index = guichesExibicaoLocal.value.indexOf(nome)
  if (index > -1) {
    guichesExibicaoLocal.value.splice(index, 1)
  } else {
    guichesExibicaoLocal.value.push(nome)
  }
  // Salvar no localStorage
  localStorage.setItem('sgfila_guiches_exibicao', JSON.stringify(guichesExibicaoLocal.value))
  emit('atualizar-guiches-exibicao', guichesExibicaoLocal.value)
}

const confirmarReinicio = () => {
  const confirmacao = confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema (senhas, histórico, contadores).\n\nTem certeza que deseja continuar?')
  if (confirmacao) {
    emit('reiniciar-sistema')
  }
}
</script>

<style scoped>
.configuration-panel {
  background: white;
}

.sub-tab-nav {
  display: flex;
  gap: 5px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 25px;
}

.sub-tab-link {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: none;
  color: #868e96;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  font-size: 0.95em;
}

.sub-tab-link:hover {
  color: #495057;
  background: #f8f9fa;
}

.sub-tab-link.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.sub-tab-content h2,
.sub-tab-content h3 {
  color: #495057;
  margin-bottom: 15px;
}

.sub-tab-content h2 {
  font-size: 1.4em;
}

.sub-tab-content h3 {
  font-size: 1.2em;
}

.hint {
  color: #868e96;
  font-size: 0.9em;
  margin-bottom: 20px;
  line-height: 1.6;
}

.divider {
  margin: 35px 0;
  border: none;
  border-top: 2px solid #e9ecef;
}

.guiche-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.checkbox-item:hover {
  background: #e9ecef;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.badge-inactive {
  background: #ffc107;
  color: #856404;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 600;
  margin-left: auto;
}

.guiche-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.guiche-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.guiche-input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.guiche-input:focus {
  outline: none;
  border-color: #667eea;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 26px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #28a745;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.status-label {
  min-width: 60px;
  font-size: 0.9em;
  color: #868e96;
  font-weight: 600;
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
}

.btn-delete {
  background: #ffe5e5;
  color: #dc3545;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ratio-controls {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 30px;
}

.ratio-control {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.ratio-control label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 15px;
  font-size: 1.05em;
}

.ratio-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.ratio-input-group input {
  width: 100px;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.3em;
  font-weight: bold;
  text-align: center;
  transition: border-color 0.3s;
}

.ratio-input-group input:focus {
  outline: none;
  border-color: #667eea;
}

.ratio-separator {
  font-size: 1.5em;
  font-weight: bold;
  color: #495057;
}

.ratio-fixed {
  font-size: 1.3em;
  font-weight: bold;
  color: #667eea;
  min-width: 40px;
  text-align: center;
}

.ratio-explanation {
  margin: 0;
  color: #868e96;
  font-size: 0.9em;
  line-height: 1.6;
}

.info-box {
  background: #e7f3ff;
  border-left: 4px solid #007bff;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
}

.info-box i {
  color: #007bff;
  font-size: 1.5em;
}

.info-box strong {
  display: block;
  margin-bottom: 8px;
  color: #495057;
}

.info-box p {
  margin: 0;
  color: #495057;
  line-height: 1.6;
}

.warning-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.warning-box i {
  color: #856404;
  font-size: 1.5em;
}

.warning-box strong {
  display: block;
  margin-bottom: 8px;
  color: #856404;
}

.warning-box p {
  margin: 0;
  color: #856404;
  line-height: 1.6;
}

.btn-reset-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 15px 30px;
  font-size: 1.1em;
}

.btn-reset-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}
</style>
