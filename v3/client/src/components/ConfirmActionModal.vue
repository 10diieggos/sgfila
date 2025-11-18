<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay modal-confirm" @click.self="handleCancel" @keydown="handleKeyDown">
        <div class="modal-content-confirm" @click.stop>
          <span class="modal-label">{{ title }}</span>
          <div v-if="tipoSenha" :class="['senha-numero-confirm', tipoSenha]">{{ extractSenhaNumber(message) }}</div>

          <div class="modal-message">
            <p>{{ message }}</p>
          </div>

          <div class="modal-actions-confirm">
            <button :class="['btn-confirm', getConfirmClass()]" @click="handleConfirm">
              {{ confirmText }}
            </button>
            <button class="btn-cancel-confirm" @click="handleCancel">
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { TipoSenha } from '@shared/types'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  tipoSenha?: TipoSenha
}>(), {
  title: 'Confirmar Ação',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar'
})

const emit = defineEmits<{
  'confirm': []
  'cancel': []
}>()

const extractSenhaNumber = (message: string): string => {
  const match = message.match(/senha\s+([A-Z]\d+)/i)
  return match ? match[1] : ''
}

const getConfirmClass = () => {
  if (props.title.includes('Excluir')) return 'btn-danger'
  if (props.title.includes('Ausente')) return 'btn-warning'
  return 'btn-primary'
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.show) return

  if (e.key === 'Enter') {
    e.preventDefault()
    handleConfirm()
  } else if (e.key === 'Escape') {
    handleCancel()
  }
}

// Adicionar listener global
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.modal-overlay.modal-confirm {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  backdrop-filter: blur(4px);
}

.modal-content-confirm {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 650px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-label {
  display: block;
  font-size: 1.3em;
  color: #495057;
  margin-bottom: 20px;
  font-weight: 600;
}

.senha-numero-confirm {
  font-size: 6em;
  font-weight: bold;
  margin: 20px 0;
  padding: 20px;
  border-radius: 12px;
  letter-spacing: 4px;
  white-space: nowrap;
  overflow: visible;
}

/* Cores por tipo */
.senha-numero-confirm.prioridade {
  color: #ff6b6b;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
}

.senha-numero-confirm.normal {
  color: #4dabf7;
  background: linear-gradient(135deg, #f0f8ff 0%, #d0ebff 100%);
}

.senha-numero-confirm.contratual {
  color: #845ef7;
  background: linear-gradient(135deg, #f3e8ff 0%, #e5d4ff 100%);
}

/* Fallback se não tiver tipo */
.senha-numero-confirm:not(.prioridade):not(.normal):not(.contratual) {
  color: #667eea;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.modal-message {
  margin: 25px 0;
}

.modal-message p {
  color: #495057;
  font-size: 1.1em;
  line-height: 1.6;
  margin: 0;
}

.modal-actions-confirm {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn-confirm,
.btn-cancel-confirm {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.btn-confirm.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-confirm.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.btn-confirm.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: white;
}

.btn-confirm.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.btn-confirm.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-confirm.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-cancel-confirm {
  background: #e9ecef;
  color: #495057;
}

.btn-cancel-confirm:hover {
  background: #dee2e6;
  transform: translateY(-2px);
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

.modal-enter-active .modal-content-confirm,
.modal-leave-active .modal-content-confirm {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-confirm,
.modal-leave-to .modal-content-confirm {
  transform: scale(0.9);
}
</style>
