<template>
  <div id="app" class="container">
    <!-- Header -->
    <header>
      <h1><i class="fas fa-mail-bulk"></i> SGFILA v3.0</h1>
      <div class="connection-status">
        <span :class="['status-indicator', { connected }]"></span>
        {{ connected ? 'Conectado' : 'Desconectado' }}
      </div>
    </header>

    <!-- Alerta Legal - Prioridades -->
    <div v-if="estado" class="alert-priorities">
      <i class="fas fa-info-circle"></i>
      <strong>Prioridades legais:</strong>
      <div class="priority-icons">
        <span class="priority-icon" title="Idosos (60 anos ou mais)">
          <i class="fas fa-user-clock"></i>
        </span>
        <span class="priority-icon" title="Gestantes">
          <i class="fas fa-person-pregnant"></i>
        </span>
        <span class="priority-icon" title="Lactantes (mães amamentando)">
          <i class="fas fa-baby"></i>
        </span>
        <span class="priority-icon" title="Pessoas com crianças de colo">
          <i class="fas fa-child"></i>
        </span>
        <span class="priority-icon" title="Pessoas com deficiência física">
          <i class="fas fa-wheelchair"></i>
        </span>
        <span class="priority-icon" title="Pessoas com deficiência visual">
          <i class="fas fa-blind"></i>
        </span>
        <span class="priority-icon" title="Pessoas com deficiência auditiva">
          <i class="fas fa-deaf"></i>
        </span>
        <span class="priority-icon" title="Pessoas com Transtorno do Espectro Autista (TEA)">
          <i class="fas fa-puzzle-piece"></i>
        </span>
      </div>
    </div>

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

        <!-- Emissão de Senhas -->
        <div class="card">
          <h3><i class="fas fa-ticket-alt"></i> Emissão de Senhas</h3>
          <div class="controls">
            <button @click="handleEmitirSenha('prioridade')" class="btn btn-priority btn-emit">
              <i class="fas fa-wheelchair"></i> Prioritária
            </button>
            <button @click="handleEmitirSenha('normal')" class="btn btn-normal btn-emit">
              <i class="fas fa-user"></i> Normal
            </button>
            <button @click="handleEmitirSenha('contratual')" class="btn btn-contract btn-emit">
              <i class="fas fa-file-contract"></i> Contratual
            </button>
          </div>
        </div>

        <!-- Atendimentos Atuais -->
        <div class="card">
          <CurrentAttendanceList
            :atendimentos-atuais="estado.atendimentosAtuais"
            @devolver="handleDevolverSenha"
            @ausente="handleAusente"
            @ver-detalhes="handleVerDetalhes"
          />
        </div>
      </div>

      <!-- Coluna Direita -->
      <div class="right-column">
        <!-- Botões para abrir modais -->
        <div class="card">
          <h3><i class="fas fa-layer-group"></i> Painéis</h3>
          <div class="modal-buttons">
            <button @click="showStatsModal = true" class="btn-modal btn-stats">
              <i class="fas fa-chart-bar"></i> Estatísticas
            </button>
            <button @click="showHistoryModal = true" class="btn-modal btn-history">
              <i class="fas fa-history"></i> Histórico
            </button>
            <button @click="showConfigModal = true" class="btn-modal btn-config">
              <i class="fas fa-cogs"></i> Configurações
            </button>
          </div>
        </div>
        <!-- Fila de Espera -->
        <div class="card">
          <QueueList
            :senhas="estado.senhas || []"
            :proporcao-prioridade="estado.proporcaoPrioridade"
            :proporcao-contratual="estado.proporcaoContratual"
            :contador-prioridade-desde-ultima-normal="estado.contadorPrioridadeDesdeUltimaNormal"
            :contador-contratual-desde-ultima-normal="estado.contadorContratualDesdeUltimaNormal"
            @ver-detalhes="handleVerDetalhes"
            @chamar="handleChamarSenhaEspecifica"
            @editar="handleEditarDescricao"
            @excluir="handleExcluirSenha"
          />
        </div>
      </div>
    </div>

    <!-- Modais -->
    <NewTicketModal
      :show="showNewTicketModal"
      :numero-senha="novaSenhaNumerо"
      :tipo-senha="novaSenhaTipo"
      @close="showNewTicketModal = false"
      @save="handleSalvarDescricaoNovaSenha"
    />

    <EditDescriptionModal
      :show="showEditModal"
      :numero-senha="senhaParaEditar?.numero || ''"
      :descricao="senhaParaEditar?.descricao || ''"
      :tipo-senha="senhaParaEditar?.tipo"
      @close="handleCloseEditModal"
      @save="handleSalvarEdicaoDescricao"
    />

    <ConfirmActionModal
      :show="showConfirmModal"
      :title="confirmModalData.title"
      :message="confirmModalData.message"
      :confirm-text="confirmModalData.confirmText"
      :tipo-senha="confirmModalData.tipoSenha"
      :numero-senha="confirmModalData.numeroSenha"
      @confirm="handleConfirmAction"
      @cancel="showConfirmModal = false"
    />

    <!-- Modal Alerta -->
    <Teleport to="body">
      <Transition name="modal" @after-enter="focusAlertModal">
        <div
          v-if="showAlertModal"
          ref="alertModalRef"
          class="modal-overlay-alert"
          @click="showAlertModal = false"
          @keydown="showAlertModal = false"
          tabindex="0"
        >
          <div class="modal-content-alert" @click.stop>
            <div class="alert-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <p class="alert-text">{{ alertMessage }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Seleção de Guichê -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showGuicheModal" class="modal-overlay-guiche" @click.self="showGuicheModal = false">
          <div class="modal-content-guiche" @click.stop>
            <div class="guiche-grid">
              <div
                v-for="guiche in guichesLivres"
                :key="guiche.nome"
                class="guiche-card-selecao"
                @click="handleSelecionarGuiche(guiche.nome)"
              >
                <div class="guiche-icon">
                  <i class="fas fa-desktop"></i>
                </div>
                <div class="guiche-nome">{{ guiche.nome }}</div>
                <div class="guiche-status">Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Estatísticas -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showStatsModal" class="modal-overlay modal-paineis modal-stats" @click.self="showStatsModal = false">
          <div class="modal-content modal-content-paineis" @click.stop>
            <StatisticsPanel
              :estatisticas="estatisticas"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Ticket -->
    <TicketModal
      :show="showTicketModal"
      :ticket-selecionado="ticketSelecionado"
      :estatisticas="estatisticas"
      :estado="estado"
      @close="handleCloseTicketModal"
      @chamar="handleChamarFromTicketModal"
      @editar="handleEditarFromTicketModal"
      @excluir="handleExcluirFromTicketModal"
      @retornar="handleRetornarFromTicketModal"
      @ausente="handleAusenteFromTicketModal"
    />

    <!-- Modal Histórico -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showHistoryModal" class="modal-overlay modal-paineis" @click.self="showHistoryModal = false">
          <div class="modal-content modal-content-paineis" @click.stop>
            <HistoryPanel
              :senhas="estado.senhas"
              @ver-detalhes="handleVerDetalhes"
              @chamar="handleChamarSenhaEspecifica"
              @editar="handleEditarDescricao"
              @excluir="handleExcluirSenha"
              @retornar="handleDevolverSenha"
              @ausente="handleAusente"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Configurações -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showConfigModal" class="modal-overlay modal-paineis" @click.self="showConfigModal = false">
          <div class="modal-content modal-content-paineis" @click.stop>
            <ConfigurationPanel
              :guiches-globais="estado.guichesConfigurados"
              :proporcao-prioridade="estado.proporcaoPrioridade"
              :proporcao-contratual="estado.proporcaoContratual"
              @atualizar-guiches-globais="atualizarGuichesGlobais"
              @atualizar-proporcao-prioridade="atualizarProporcao"
              @atualizar-proporcao-contratual="atualizarProporcaoContratual"
              @atualizar-guiches-exibicao="handleAtualizarGuichesExibicao"
              @reiniciar-sistema="handleReiniciarSistema"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
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
import ConfirmActionModal from './components/ConfirmActionModal.vue'
import TicketModal from './components/TicketModal.vue'

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
const showNewTicketModal = ref(false)
const showEditModal = ref(false)
const showConfirmModal = ref(false)
const showStatsModal = ref(false)
const showHistoryModal = ref(false)
const showConfigModal = ref(false)
const showGuicheModal = ref(false)
const showAlertModal = ref(false)
const showTicketModal = ref(false)
const alertMessage = ref('')
const modalSourceForTicket = ref<'history' | 'queue' | 'attendance' | null>(null)
const editModalOpenedFromTicket = ref(false)
const novaSenhaNumerо = ref('')
const novaSenhaTipo = ref<'prioridade' | 'normal' | 'contratual'>('normal')
const senhaParaEditar = ref<Senha | null>(null)
const ticketSelecionado = ref<Senha | null>(null)
const guichesExibicao = ref<string[]>([])
const senhaParaChamar = ref<string | null>(null)
const guichesLivres = ref<Guiche[]>([])
const alertModalRef = ref<HTMLElement>()
const confirmModalData = ref({
  title: '',
  message: '',
  confirmText: 'Confirmar',
  tipoSenha: '' as 'prioridade' | 'normal' | 'contratual' | '',
  numeroSenha: '',
  action: '' as 'excluir' | 'ausente' | '',
  data: {} as any
})

// Computed
const senhasEspera = computed(() => {
  return estado.value?.senhas.filter(s => s.status === 'espera') || []
})

// Handlers - Emissão
const handleEmitirSenha = (tipo: 'prioridade' | 'normal' | 'contratual') => {
  novaSenhaTipo.value = tipo
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
      title: 'Ausente',
      message: `Confirma que a senha ${senha.numero} não compareceu ao atendimento?`,
      confirmText: 'Confirmar',
      tipoSenha: senha.tipo,
      numeroSenha: senha.numero,
      action: 'ausente',
      data: { numeroSenha: senha.numero }
    }
    showConfirmModal.value = true
  }
}

const handleDevolverSenha = (numeroSenha: string) => {
  devolverSenha(numeroSenha)
}

const handleAusente = (numeroSenha: string) => {
  const senha = estado.value?.senhas.find(s => s.numero === numeroSenha)
  confirmModalData.value = {
    title: 'Ausente',
    message: `Confirma que a senha ${numeroSenha} não compareceu ao atendimento?`,
    confirmText: 'Confirmar',
    tipoSenha: senha?.tipo || 'normal',
    numeroSenha: numeroSenha,
    action: 'ausente',
    data: { numeroSenha }
  }
  showConfirmModal.value = true
}

// Handlers - Fila
const handleChamarSenhaEspecifica = (numeroSenha: string) => {
  // Buscar guichês livres que estão em exibição
  const guichesLivresExibidos = estado.value?.guichesConfigurados.filter(g => {
    const estaLivre = g.ativo && !estado.value?.atendimentosAtuais[g.nome]
    const estaEmExibicao = guichesExibicao.value.length === 0 || guichesExibicao.value.includes(g.nome)
    return estaLivre && estaEmExibicao
  }) || []

  if (guichesLivresExibidos.length === 0) {
    alertMessage.value = 'Nenhum guichê livre disponível na exibição atual'
    showAlertModal.value = true
  } else if (guichesLivresExibidos.length === 1) {
    // Apenas um guichê livre, chamar automaticamente
    chamarSenhaEspecifica(guichesLivresExibidos[0].nome, numeroSenha)
  } else {
    // Múltiplos guichês livres, abrir modal de seleção
    senhaParaChamar.value = numeroSenha
    guichesLivres.value = guichesLivresExibidos
    showGuicheModal.value = true
  }
}

const handleSelecionarGuiche = (guicheNome: string) => {
  if (senhaParaChamar.value) {
    chamarSenhaEspecifica(guicheNome, senhaParaChamar.value)
    showGuicheModal.value = false
    senhaParaChamar.value = null
    guichesLivres.value = []
  }
}

const handleEditarDescricao = (numeroSenha: string) => {
  const senha = estado.value?.senhas.find(s => s.numero === numeroSenha)
  if (senha) {
    senhaParaEditar.value = senha
    showEditModal.value = true
  }
}

const handleCloseEditModal = () => {
  showEditModal.value = false

  // Se foi aberto a partir do modal ticket, reabrir o modal ticket
  if (editModalOpenedFromTicket.value) {
    showTicketModal.value = true
    editModalOpenedFromTicket.value = false
  }
}

const handleSalvarEdicaoDescricao = (descricao: string) => {
  if (senhaParaEditar.value) {
    atualizarDescricao(senhaParaEditar.value.numero, descricao)
  }

  handleCloseEditModal()
}

const handleExcluirSenha = (numeroSenha: string) => {
  const senha = estado.value?.senhas.find(s => s.numero === numeroSenha)
  confirmModalData.value = {
    title: 'Excluir Senha',
    message: `Tem certeza que deseja excluir a senha ${numeroSenha} da fila?`,
    confirmText: 'Excluir',
    tipoSenha: senha?.tipo || 'normal',
    numeroSenha: numeroSenha,
    action: 'excluir',
    data: { numeroSenha }
  }
  showConfirmModal.value = true
}

const handleVerDetalhes = (numeroSenha: string) => {
  const senha = estado.value?.senhas.find(s => s.numero === numeroSenha)
  if (senha) {
    ticketSelecionado.value = senha

    // Determinar de qual modal veio a solicitação
    if (showHistoryModal.value) {
      modalSourceForTicket.value = 'history'
      showHistoryModal.value = false
    } else if (showStatsModal.value) {
      modalSourceForTicket.value = 'queue'
    } else {
      modalSourceForTicket.value = 'queue'
    }

    showTicketModal.value = true
  }
}

const handleCloseTicketModal = () => {
  showTicketModal.value = false

  // Reabrir History se foi a fonte
  if (modalSourceForTicket.value === 'history') {
    showHistoryModal.value = true
  }

  modalSourceForTicket.value = null
}

const handleChamarFromTicketModal = (numeroSenha: string) => {
  showTicketModal.value = false
  handleChamarSenhaEspecifica(numeroSenha)
  modalSourceForTicket.value = null
}

const handleEditarFromTicketModal = (numeroSenha: string) => {
  showTicketModal.value = false
  editModalOpenedFromTicket.value = true
  handleEditarDescricao(numeroSenha)
}

const handleExcluirFromTicketModal = (numeroSenha: string) => {
  showTicketModal.value = false
  handleExcluirSenha(numeroSenha)
  modalSourceForTicket.value = null
}

const handleRetornarFromTicketModal = (numeroSenha: string) => {
  showTicketModal.value = false
  handleDevolverSenha(numeroSenha)
  modalSourceForTicket.value = null
}

const handleAusenteFromTicketModal = (numeroSenha: string) => {
  showTicketModal.value = false
  handleAusente(numeroSenha)
  modalSourceForTicket.value = null
}

// Handlers - Sistema
const handleReiniciarSistema = () => {
  reiniciarSistema()
}

const handleConfirmAction = () => {
  if (confirmModalData.value.action === 'excluir') {
    excluirSenha(confirmModalData.value.data.numeroSenha)
  } else if (confirmModalData.value.action === 'ausente') {
    excluirAtendimento(confirmModalData.value.data.numeroSenha)
  }
  showConfirmModal.value = false
}

const handleAtualizarGuichesExibicao = (guiches: string[]) => {
  guichesExibicao.value = guiches
}

const focusAlertModal = () => {
  alertModalRef.value?.focus()
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
  padding: 20px 40px;
}

/* Header */
header {
  background: linear-gradient(135deg, rgba(0, 74, 141, 0.85) 0%, rgba(0, 102, 204, 0.85) 100%);
  color: white;
  padding: 15px;
  border-radius: 10px 10px 0 0;
  margin-bottom: 0;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

header h1 {
  font-size: 1.5em;
  margin: 0;
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

/* Alert - Prioridades Legais */
.alert-priorities {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196f3;
  border-right: 4px solid #2196f3;
  color: #0d47a1;
  padding: 15px 20px;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.alert-priorities i.fa-info-circle {
  font-size: 1.3em;
  color: #2196f3;
}

.alert-priorities strong {
  margin-right: 10px;
}

.priority-icons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.priority-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 50%;
  color: #2196f3;
  font-size: 1.1em;
  cursor: help;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.priority-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background: #2196f3;
  color: white;
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.btn {
  padding: 10px 13px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn i {
  font-size: 1.2rem;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-priority {
  background-color: #ffffff;
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-priority:hover {
  background-color: #fff5f5;
  color: #ff5252;
  border-color: #ff5252;
}

.btn-normal {
  background-color: #ffffff;
  color: #4dabf7;
  border-color: #4dabf7;
}

.btn-normal:hover {
  background-color: #e7f5ff;
  color: #339af0;
  border-color: #339af0;
}

.btn-contract {
  background-color: #ffffff;
  color: #845ef7;
  border-color: #845ef7;
}

.btn-contract:hover {
  background-color: #f3e8ff;
  color: #7048e8;
  border-color: #7048e8;
}

.btn-reset {
  background-color: #ff8787;
  color: white;
  border-color: #ff8787;
}

.btn-reset:hover {
  background-color: #fa5252;
  border-color: #fa5252;
}

/* Tabs */
.tab-nav {
  display: flex;
  gap: 5px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 25px;
}

.tab-link {
  flex: 1;
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
  justify-content: center;
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

/* Emission buttons - triple height */
.btn-emit {
  height: 120px;
  font-size: 1.3em;
}

/* Modal buttons */
.modal-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.btn-modal {
  padding: 12px 20px;
  border: 2px solid;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-stats {
  color: #667eea;
  border-color: #667eea;
}

.btn-stats:hover {
  background: #667eea;
  color: white;
}

.btn-history {
  color: #28a745;
  border-color: #28a745;
}

.btn-history:hover {
  background: #28a745;
  color: white;
}

.btn-config {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-config:hover {
  background: #6c757d;
  color: white;
}

/* Modal overlay and content */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

/* Modal overlay para painéis - z-index mais alto */
.modal-overlay.modal-paineis {
  z-index: 3000;
}

/* Modal de Estatísticas (ticket) - sempre na frente dos outros painéis */
.modal-overlay.modal-stats {
  z-index: 3500;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* Modal content para painéis - 70% da largura do container */
.modal-content-paineis {
  max-width: 1120px; /* 70% de 1600px */
  width: 70%;
}

/* Modal Seleção de Guichê */
.modal-overlay-guiche {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3500;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content-guiche {
  background: transparent;
  border-radius: 12px;
  max-width: 900px;
  width: 90%;
}

.guiche-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.guiche-card-selecao {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid transparent;
}

.guiche-card-selecao:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  border-color: #667eea;
}

.guiche-icon {
  font-size: 3em;
  color: #667eea;
  margin-bottom: 15px;
}

.guiche-nome {
  font-size: 1.3em;
  font-weight: bold;
  color: #495057;
  margin-bottom: 8px;
}

.guiche-status {
  color: #28a745;
  font-weight: 600;
  font-size: 0.95em;
}

/* Modal Alerta */
.modal-overlay-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  padding: 20px;
  backdrop-filter: blur(4px);
  outline: none;
}

.modal-content-alert {
  background: white;
  border-radius: 16px;
  padding: 40px 50px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.alert-icon {
  font-size: 4em;
  color: #ffc107;
  margin-bottom: 20px;
  animation: pulse-icon 1.5s infinite;
}

@keyframes pulse-icon {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.alert-text {
  font-size: 1.2em;
  color: #495057;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

.modal-enter-active .modal-content-paineis,
.modal-leave-active .modal-content-paineis {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-paineis,
.modal-leave-to .modal-content-paineis {
  transform: scale(0.9);
}

.modal-enter-active .modal-content-guiche,
.modal-leave-active .modal-content-guiche {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-guiche,
.modal-leave-to .modal-content-guiche {
  transform: scale(0.9);
}

.modal-enter-active .modal-content-alert,
.modal-leave-active .modal-content-alert {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-alert,
.modal-leave-to .modal-content-alert {
  transform: scale(0.9);
}
</style>
