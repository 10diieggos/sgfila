<template>
  <div id="app" class="container">
    <!-- Header -->
    <header>
      <h1><i class="fas fa-mail-bulk"></i> Sistema de Senhas - Correios</h1>
      <p>Sistema de atendimento por prioridade legal - SGFILA v3.0</p>
      <div class="connection-status">
        <span :class="['status-indicator', { connected }]"></span>
        {{ connected ? 'Conectado' : 'Desconectado' }}
      </div>
    </header>

    <!-- Loading -->
    <div v-if="!estado" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Carregando sistema...
    </div>

    <!-- Main Dashboard -->
    <div v-else class="dashboard">
      <!-- Coluna Esquerda -->
      <div class="left-column">
        <!-- Painéis de Guichê -->
        <div class="card">
          <CounterPanel
            :guiches="estado.guichesConfigurados"
            :atendimentos-atuais="estado.atendimentosAtuais"
            :guiches-exibicao="guichesExibicao"
            :fila-vazia="senhasEspera.length === 0"
            @chamar="handleChamarGuiche"
            @finalizar="handleFinalizarAtendimento"
            @nao-compareceu="handleNaoCompareceu"
          />
        </div>

        <!-- Atendimentos Atuais -->
        <div class="card">
          <CurrentAttendanceList
            :atendimentos-atuais="estado.atendimentosAtuais"
            @devolver="handleDevolverSenha"
          />
        </div>

        <!-- Emissão de Senhas -->
        <div class="card">
          <h3><i class="fas fa-ticket-alt"></i> Emissão de Senhas</h3>
          <div class="controls">
            <button @click="handleEmitirSenha('prioridade')" class="btn btn-priority">
              <i class="fas fa-wheelchair"></i> Prioritária
            </button>
            <button @click="handleEmitirSenha('normal')" class="btn btn-normal">
              <i class="fas fa-user"></i> Normal
            </button>
            <button @click="handleEmitirSenha('contratual')" class="btn btn-contract">
              <i class="fas fa-file-contract"></i> Contratual
            </button>
            <button @click="showResetModal = true" class="btn btn-reset">
              <i class="fas fa-redo"></i> Reiniciar Sistema
            </button>
          </div>
        </div>

        <!-- Fila de Espera -->
        <div class="card">
          <QueueList
            :senhas="estado.senhas || []"
            @ver-detalhes="handleVerDetalhes"
            @chamar="handleChamarSenhaEspecifica"
            @editar="handleEditarDescricao"
            @excluir="handleExcluirSenha"
          />
        </div>
      </div>

      <!-- Coluna Direita -->
      <div class="right-column">
        <div class="card">
          <!-- Tabs de Navegação -->
          <div class="tab-nav">
            <button
              :class="['tab-link', { active: activeTab === 'stats' }]"
              @click="activeTab = 'stats'"
            >
              <i class="fas fa-chart-bar"></i> Estatísticas
            </button>
            <button
              :class="['tab-link', { active: activeTab === 'history' }]"
              @click="activeTab = 'history'"
            >
              <i class="fas fa-history"></i> Histórico
            </button>
            <button
              :class="['tab-link', { active: activeTab === 'config' }]"
              @click="activeTab = 'config'"
            >
              <i class="fas fa-cogs"></i> Configurações
            </button>
          </div>

          <!-- Conteúdo das Tabs -->
          <div class="tab-content">
            <StatisticsPanel
              v-if="activeTab === 'stats' && estatisticas"
              :estatisticas="estatisticas"
              :ticket-selecionado="ticketSelecionado"
            />

            <HistoryPanel
              v-if="activeTab === 'history'"
              :senhas="estado.senhas"
              @ver-detalhes="handleVerDetalhes"
            />

            <ConfigurationPanel
              v-if="activeTab === 'config'"
              :guiches-globais="estado.guichesConfigurados"
              :proporcao-prioridade="estado.proporcaoPrioridade"
              :proporcao-contratual="estado.proporcaoContratual"
              @atualizar-guiches-globais="atualizarGuichesGlobais"
              @atualizar-proporcao-prioridade="atualizarProporcao"
              @atualizar-proporcao-contratual="atualizarProporcaoContratual"
              @atualizar-guiches-exibicao="handleAtualizarGuichesExibicao"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Alerta Legal -->
    <div v-if="estado" class="alert">
      <i class="fas fa-info-circle"></i>
      <strong>Prioridades legais:</strong>
      Idosos (60+), gestantes, lactantes, pessoas com crianças de colo e pessoas com deficiência têm direito a atendimento prioritário.
    </div>

    <!-- Modais -->
    <NewTicketModal
      :show="showNewTicketModal"
      :numero-senha="novaSenhaNumerо"
      @close="showNewTicketModal = false"
      @save="handleSalvarDescricaoNovaSenha"
    />

    <EditDescriptionModal
      :show="showEditModal"
      :numero-senha="senhaParaEditar?.numero || ''"
      :descricao="senhaParaEditar?.descricao || ''"
      @close="showEditModal = false"
      @save="handleSalvarEdicaoDescricao"
    />

    <SystemResetModal
      :show="showResetModal"
      @confirm="handleReiniciarSistema"
      @cancel="showResetModal = false"
    />

    <ConfirmActionModal
      :show="showConfirmModal"
      :title="confirmModalData.title"
      :message="confirmModalData.message"
      :confirm-text="confirmModalData.confirmText"
      @confirm="handleConfirmAction"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSocket } from './composables/useSocket'
import type { Senha, Guiche } from '@shared/types'

// Componentes
import QueueList from './components/QueueList.vue'
import CounterPanel from './components/CounterPanel.vue'
import CurrentAttendanceList from './components/CurrentAttendanceList.vue'
import StatisticsPanel from './components/StatisticsPanel.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import ConfigurationPanel from './components/ConfigurationPanel.vue'
import NewTicketModal from './components/NewTicketModal.vue'
import EditDescriptionModal from './components/EditDescriptionModal.vue'
import SystemResetModal from './components/SystemResetModal.vue'
import ConfirmActionModal from './components/ConfirmActionModal.vue'

// Socket.IO
const {
  connected,
  estado,
  estatisticas,
  emitirSenha,
  chamarSenha,
  chamarSenhaEspecifica,
  finalizarAtendimento,
  excluirSenha,
  excluirAtendimento,
  devolverSenha,
  atualizarDescricao,
  atualizarProporcao,
  atualizarProporcaoContratual,
  atualizarGuichesGlobais,
  reiniciarSistema
} = useSocket()

// State
const activeTab = ref<'stats' | 'history' | 'config'>('stats')
const showNewTicketModal = ref(false)
const showEditModal = ref(false)
const showResetModal = ref(false)
const showConfirmModal = ref(false)
const novaSenhaNumerо = ref('')
const senhaParaEditar = ref<Senha | null>(null)
const ticketSelecionado = ref<Senha | null>(null)
const guichesExibicao = ref<string[]>([])
const confirmModalData = ref({
  title: '',
  message: '',
  confirmText: 'Confirmar',
  action: '' as 'excluir' | 'nao-compareceu' | '',
  data: {} as any
})

// Computed
const senhasEspera = computed(() => {
  return estado.value?.senhas.filter(s => s.status === 'espera') || []
})

// Handlers - Emissão
const handleEmitirSenha = (tipo: 'prioridade' | 'normal' | 'contratual') => {
  emitirSenha(tipo, '')
  // Aguardar resposta do servidor para mostrar modal
  setTimeout(() => {
    const ultimaSenha = estado.value?.senhas[estado.value.senhas.length - 1]
    if (ultimaSenha) {
      novaSenhaNumerо.value = ultimaSenha.numero
      showNewTicketModal.value = true
    }
  }, 300)
}

const handleSalvarDescricaoNovaSenha = (descricao: string) => {
  if (descricao && novaSenhaNumerо.value) {
    atualizarDescricao(novaSenhaNumerо.value, descricao)
  }
}

// Handlers - Guichês
const handleChamarGuiche = (guicheNome: string) => {
  chamarSenha(guicheNome)
}

const handleFinalizarAtendimento = (guicheNome: string) => {
  finalizarAtendimento(guicheNome)
}

const handleNaoCompareceu = (guicheNome: string) => {
  const senha = estado.value?.atendimentosAtuais[guicheNome]
  if (senha) {
    confirmModalData.value = {
      title: 'Marcar como Não Compareceu',
      message: `Confirma que a senha ${senha.numero} não compareceu ao atendimento?`,
      confirmText: 'Confirmar',
      action: 'nao-compareceu',
      data: { numeroSenha: senha.numero }
    }
    showConfirmModal.value = true
  }
}

const handleDevolverSenha = (numeroSenha: string) => {
  devolverSenha(numeroSenha)
}

// Handlers - Fila
const handleChamarSenhaEspecifica = (numeroSenha: string) => {
  // Buscar primeiro guichê livre
  const guicheLivre = estado.value?.guichesConfigurados.find(g =>
    g.ativo && !estado.value?.atendimentosAtuais[g.nome]
  )

  if (guicheLivre) {
    chamarSenhaEspecifica(guicheLivre.nome, numeroSenha)
  } else {
    alert('Nenhum guichê livre disponível')
  }
}

const handleEditarDescricao = (numeroSenha: string) => {
  const senha = estado.value?.senhas.find(s => s.numero === numeroSenha)
  if (senha) {
    senhaParaEditar.value = senha
    showEditModal.value = true
  }
}

const handleSalvarEdicaoDescricao = (descricao: string) => {
  if (senhaParaEditar.value) {
    atualizarDescricao(senhaParaEditar.value.numero, descricao)
  }
}

const handleExcluirSenha = (numeroSenha: string) => {
  confirmModalData.value = {
    title: 'Excluir Senha',
    message: `Tem certeza que deseja excluir a senha ${numeroSenha} da fila?`,
    confirmText: 'Excluir',
    action: 'excluir',
    data: { numeroSenha }
  }
  showConfirmModal.value = true
}

const handleVerDetalhes = (numeroSenha: string) => {
  const senha = estado.value?.senhas.find(s => s.numero === numeroSenha)
  if (senha) {
    ticketSelecionado.value = senha
    activeTab.value = 'stats'
  }
}

// Handlers - Sistema
const handleReiniciarSistema = () => {
  reiniciarSistema()
  showResetModal.value = false
}

const handleConfirmAction = () => {
  if (confirmModalData.value.action === 'excluir') {
    excluirSenha(confirmModalData.value.data.numeroSenha)
  } else if (confirmModalData.value.action === 'nao-compareceu') {
    excluirAtendimento(confirmModalData.value.data.numeroSenha)
  }
  showConfirmModal.value = false
}

const handleAtualizarGuichesExibicao = (guiches: string[]) => {
  guichesExibicao.value = guiches
}
</script>

<style>
/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

header h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
}

header p {
  font-size: 1em;
  opacity: 0.9;
}

.connection-status {
  margin-top: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #dc3545;
  display: inline-block;
  animation: pulse 2s infinite;
}

.status-indicator.connected {
  background: #28a745;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Loading */
.loading {
  text-align: center;
  padding: 80px 20px;
  font-size: 1.5em;
  color: #868e96;
}

.loading i {
  font-size: 3em;
  margin-bottom: 20px;
  color: #667eea;
}

/* Dashboard Layout */
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 25px;
}

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Card */
.card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card h3 {
  margin-bottom: 20px;
  color: #495057;
  font-size: 1.3em;
}

/* Controls */
.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

.btn {
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(-1px);
}

.btn-priority {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-normal {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.btn-contract {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.btn-reset {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

/* Tabs */
.tab-nav {
  display: flex;
  gap: 5px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 25px;
}

.tab-link {
  padding: 15px 25px;
  border: none;
  background: none;
  color: #868e96;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-link:hover {
  color: #495057;
  background: #f8f9fa;
}

.tab-link.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: #f8f9fa;
}

.tab-content {
  min-height: 400px;
}

/* Alert */
.alert {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196f3;
  color: #0d47a1;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.6;
}

.alert i {
  font-size: 1.5em;
  color: #2196f3;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
