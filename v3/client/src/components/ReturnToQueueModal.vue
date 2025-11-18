<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && senha" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="handleClose">
            <i class="fas fa-times"></i>
          </button>

          <h2 class="modal-title">
            <i class="fas fa-undo"></i> Devolver para Fila
          </h2>

          <div class="senha-info">
            <div :class="['senha-numero', senha.tipo]">{{ senha.numero }}</div>
            <div class="senha-detalhes">
              <div v-if="senha.descricao" class="descricao">{{ senha.descricao }}</div>
              <div class="status-info">
                <span :class="['status-badge', senha.status]">{{ getStatusLabel(senha.status) }}</span>
                <span class="tempo-historico">{{ formatTempoHistorico() }}</span>
              </div>
            </div>
          </div>

          <div class="motivos-section">
            <h3>Selecione o motivo da devolução:</h3>

            <div class="motivos-grid">
              <!-- Retorno após Impressão -->
              <button
                class="btn-motivo"
                :class="{ selected: motivoSelecionado === 'retorno_impressao', bloqueado: validacao.retorno_impressao.bloqueado }"
                :disabled="validacao.retorno_impressao.bloqueado"
                @click="selecionarMotivo('retorno_impressao')"
              >
                <div class="motivo-icon">
                  <i class="fas fa-print"></i>
                </div>
                <div class="motivo-titulo">Retorno após Impressão</div>
                <div class="motivo-descricao">Cliente saiu para imprimir documentos</div>
                <div class="motivo-posicao">
                  <i class="fas fa-arrow-right"></i> Fila de retorno (prioridade)
                </div>
                <div v-if="validacao.retorno_impressao.bloqueado" class="motivo-bloqueio">
                  <i class="fas fa-exclamation-triangle"></i> {{ validacao.retorno_impressao.mensagem }}
                </div>
              </button>

              <!-- Erro Operacional -->
              <button
                class="btn-motivo"
                :class="{ selected: motivoSelecionado === 'erro_operacional', bloqueado: validacao.erro_operacional.bloqueado }"
                :disabled="validacao.erro_operacional.bloqueado"
                @click="selecionarMotivo('erro_operacional')"
              >
                <div class="motivo-icon">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="motivo-titulo">Erro Operacional</div>
                <div class="motivo-descricao">Marcada como atendida por engano</div>
                <div class="motivo-posicao">
                  <i class="fas fa-arrow-right"></i> Posição original aproximada
                </div>
                <div v-if="validacao.erro_operacional.bloqueado" class="motivo-bloqueio">
                  <i class="fas fa-exclamation-triangle"></i> {{ validacao.erro_operacional.mensagem }}
                </div>
              </button>

              <!-- Cliente Ausente que Retornou -->
              <button
                class="btn-motivo"
                :class="{ selected: motivoSelecionado === 'ausente_retornou', bloqueado: validacao.ausente_retornou.bloqueado }"
                :disabled="validacao.ausente_retornou.bloqueado"
                @click="selecionarMotivo('ausente_retornou')"
              >
                <div class="motivo-icon">
                  <i class="fas fa-user-clock"></i>
                </div>
                <div class="motivo-titulo">Cliente Ausente Retornou</div>
                <div class="motivo-descricao">Não compareceu mas retornou rapidamente</div>
                <div class="motivo-posicao">
                  <i class="fas fa-arrow-right"></i> Terceira posição (≤15min)
                </div>
                <div v-if="validacao.ausente_retornou.bloqueado" class="motivo-bloqueio">
                  <i class="fas fa-exclamation-triangle"></i> {{ validacao.ausente_retornou.mensagem }}
                </div>
              </button>

              <!-- Reabertura de Atendimento -->
              <button
                class="btn-motivo"
                :class="{ selected: motivoSelecionado === 'reabertura_atendimento', bloqueado: validacao.reabertura_atendimento.bloqueado }"
                :disabled="validacao.reabertura_atendimento.bloqueado"
                @click="selecionarMotivo('reabertura_atendimento')"
              >
                <div class="motivo-icon">
                  <i class="fas fa-redo"></i>
                </div>
                <div class="motivo-titulo">Reabertura de Atendimento</div>
                <div class="motivo-descricao">Atendimento insatisfatório</div>
                <div class="motivo-posicao">
                  <i class="fas fa-arrow-right"></i> Terceira posição (≤30min)
                </div>
                <div v-if="validacao.reabertura_atendimento.bloqueado" class="motivo-bloqueio">
                  <i class="fas fa-exclamation-triangle"></i> {{ validacao.reabertura_atendimento.mensagem }}
                </div>
              </button>
            </div>
          </div>

          <!-- Alternativa: Emitir Nova Senha -->
          <div v-if="motivoBloqueado" class="alternativa-section">
            <div class="alternativa-mensagem">
              <i class="fas fa-info-circle"></i>
              Prazo excedido para devolução. Você pode emitir uma nova senha para este cliente.
            </div>
            <button class="btn-alternativa" @click="emitirNovaSenha">
              <i class="fas fa-plus-circle"></i> Emitir Nova Senha
            </button>
          </div>

          <!-- Ações -->
          <div class="modal-actions">
            <button class="btn-cancel" @click="handleClose">
              Cancelar
            </button>
            <button
              class="btn-confirm"
              :disabled="!motivoSelecionado || motivoBloqueado"
              @click="confirmarDevolucao"
            >
              <i class="fas fa-check"></i> Confirmar Devolução
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Senha } from '@shared/types'

const props = defineProps<{
  show: boolean
  senha: Senha | null
}>()

const emit = defineEmits<{
  'close': []
  'devolver': [numeroSenha: string, motivo: string]
  'emitir-nova': [tipo: string]
}>()

type MotivoRetorno = 'retorno_impressao' | 'erro_operacional' | 'ausente_retornou' | 'reabertura_atendimento'

const motivoSelecionado = ref<MotivoRetorno | null>(null)

const validacao = computed(() => {
  if (!props.senha) {
    return {
      retorno_impressao: { bloqueado: false, mensagem: '' },
      erro_operacional: { bloqueado: false, mensagem: '' },
      ausente_retornou: { bloqueado: false, mensagem: '' },
      reabertura_atendimento: { bloqueado: false, mensagem: '' }
    }
  }

  const agora = Date.now()
  const tempoDecorrido = agora - (props.senha.finalizadoTimestamp || props.senha.timestamp)
  const minutosDecorridos = Math.floor(tempoDecorrido / 60000)

  return {
    retorno_impressao: {
      bloqueado: false,
      mensagem: ''
    },
    erro_operacional: {
      bloqueado: false,
      mensagem: ''
    },
    ausente_retornou: {
      bloqueado: props.senha.status === 'nao_compareceu' && minutosDecorridos > 15,
      mensagem: minutosDecorridos > 15 ? `Ausência superior a 15 minutos (${minutosDecorridos}min)` : ''
    },
    reabertura_atendimento: {
      bloqueado: props.senha.status === 'atendida' && minutosDecorridos > 30,
      mensagem: minutosDecorridos > 30 ? `Tempo superior a 30 minutos (${minutosDecorridos}min)` : ''
    }
  }
})

const motivoBloqueado = computed(() => {
  if (!motivoSelecionado.value) return false
  return validacao.value[motivoSelecionado.value].bloqueado
})

const selecionarMotivo = (motivo: MotivoRetorno) => {
  motivoSelecionado.value = motivo
}

const handleClose = () => {
  motivoSelecionado.value = null
  emit('close')
}

const confirmarDevolucao = () => {
  if (!props.senha || !motivoSelecionado.value || motivoBloqueado.value) return

  emit('devolver', props.senha.numero, motivoSelecionado.value)
  motivoSelecionado.value = null
}

const emitirNovaSenha = () => {
  if (!props.senha) return

  emit('emitir-nova', props.senha.tipo)
  handleClose()
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'atendida': 'Atendida',
    'nao_compareceu': 'Ausente',
    'excluida': 'Excluída'
  }
  return labels[status] || status
}

const formatTempoHistorico = (): string => {
  if (!props.senha) return ''

  const agora = Date.now()
  const tempoDecorrido = agora - (props.senha.finalizadoTimestamp || props.senha.timestamp)
  const minutos = Math.floor(tempoDecorrido / 60000)

  if (minutos < 1) return 'Há menos de 1 minuto'
  if (minutos === 1) return 'Há 1 minuto'
  if (minutos < 60) return `Há ${minutos} minutos`

  const horas = Math.floor(minutos / 60)
  const minutosRestantes = minutos % 60

  if (horas === 1 && minutosRestantes === 0) return 'Há 1 hora'
  if (horas === 1) return `Há 1 hora e ${minutosRestantes} minutos`
  if (minutosRestantes === 0) return `Há ${horas} horas`
  return `Há ${horas} horas e ${minutosRestantes} minutos`
}
</script>

<style scoped>
.modal-overlay {
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 1000px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: #868e96;
  cursor: pointer;
  transition: color 0.3s;
  z-index: 10;
}

.close-btn:hover {
  color: #495057;
}

.modal-title {
  text-align: center;
  color: #495057;
  font-size: 1.8em;
  margin-bottom: 30px;
}

.modal-title i {
  color: #ffa500;
}

.senha-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.senha-numero {
  font-size: 3em;
  font-weight: bold;
  padding: 15px 30px;
  border-radius: 12px;
  letter-spacing: 3px;
  min-width: 150px;
  text-align: center;
}

.senha-numero.prioridade {
  color: white;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.senha-numero.normal {
  color: white;
  background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
  box-shadow: 0 4px 15px rgba(77, 171, 247, 0.4);
}

.senha-numero.contratual {
  color: white;
  background: linear-gradient(135deg, #845ef7 0%, #7048e8 100%);
  box-shadow: 0 4px 15px rgba(132, 94, 247, 0.4);
}

.senha-detalhes {
  flex: 1;
}

.descricao {
  font-size: 1.1em;
  color: #495057;
  margin-bottom: 10px;
}

.status-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
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

.tempo-historico {
  font-size: 0.9em;
  color: #868e96;
  font-style: italic;
}

.motivos-section h3 {
  color: #495057;
  font-size: 1.2em;
  margin-bottom: 20px;
  text-align: center;
}

.motivos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.btn-motivo {
  background: white;
  border: 3px solid #dee2e6;
  border-radius: 16px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.btn-motivo:not(.bloqueado):hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.btn-motivo.selected {
  border-color: #667eea;
  background: #f1f3ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-motivo.bloqueado {
  border-color: #f8d7da;
  background: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.motivo-icon {
  font-size: 3em;
  color: #667eea;
  margin-bottom: 15px;
}

.btn-motivo.bloqueado .motivo-icon {
  color: #dc3545;
}

.motivo-titulo {
  font-size: 1.2em;
  font-weight: 700;
  color: #495057;
  margin-bottom: 10px;
}

.motivo-descricao {
  font-size: 0.95em;
  color: #868e96;
  margin-bottom: 15px;
  line-height: 1.4;
}

.motivo-posicao {
  font-size: 0.9em;
  color: #667eea;
  font-weight: 600;
  padding: 8px 12px;
  background: #f1f3ff;
  border-radius: 8px;
  display: inline-block;
}

.btn-motivo.bloqueado .motivo-posicao {
  display: none;
}

.motivo-bloqueio {
  margin-top: 15px;
  padding: 10px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: 600;
}

.motivo-bloqueio i {
  margin-right: 5px;
}

.alternativa-section {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.alternativa-mensagem {
  color: #856404;
  font-size: 1em;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alternativa-mensagem i {
  font-size: 1.5em;
}

.btn-alternativa {
  width: 100%;
  padding: 15px;
  background: white;
  border: 2px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-alternativa:hover {
  background: #ffc107;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 12px 30px;
  border: 2px solid;
  border-radius: 8px;
  background-color: transparent;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  color: #868e96;
  border-color: #868e96;
}

.btn-cancel:hover {
  background-color: #868e96;
  color: white;
}

.btn-confirm {
  color: #667eea;
  border-color: #667eea;
}

.btn-confirm:hover:not(:disabled) {
  background-color: #667eea;
  color: white;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Transitions */
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

/* Responsive */
@media (max-width: 768px) {
  .motivos-grid {
    grid-template-columns: 1fr;
  }

  .senha-info {
    flex-direction: column;
    text-align: center;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
