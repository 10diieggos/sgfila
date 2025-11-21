<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-overlay modal-edit"
        @click.self="handleClickOverlay"
        @keydown="handleKeyDown"
      >
        <div
          class="modal-content-edit-senha"
          @click.stop
        >
          <span class="modal-label">Editar Descrição</span>
          <div :class="['senha-numero', tipoSenha]">
            {{ numeroSenha }}
          </div>

          <div class="form-group-modal-senha">
            <label for="edit-senha-descricao">Descrição (Pressione Enter para salvar):</label>
            <textarea
              id="edit-senha-descricao"
              ref="textareaRef"
              v-model="descricaoLocal"
              rows="3"
              placeholder="Ex: Alteração de CPF..."
              @keydown.enter.prevent="handleSalvar"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { TipoSenha } from '@shared/types'

const props = defineProps<{
  show: boolean
  numeroSenha: string
  descricao: string
  tipoSenha?: TipoSenha
}>()

const emit = defineEmits<{
  'close': []
  'save': [descricao: string]
}>()

const descricaoLocal = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

// Watch para quando modal abre
watch(() => props.show, async (newVal) => {
  if (newVal) {
    descricaoLocal.value = props.descricao
    await nextTick()
    textareaRef.value?.focus()
  }
})

const handleClickOverlay = () => {
  fecharModal()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.show) return

  const isEnter = e.key === 'Enter'
  const isEscape = e.key === 'Escape'

  if (isEnter) {
    e.preventDefault()
    handleSalvar()
  } else if (isEscape) {
    fecharModal()
  }
}

const fecharModal = () => {
  emit('close')
}

const handleSalvar = () => {
  emit('save', descricaoLocal.value.trim())
  emit('close')
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
.modal-overlay.modal-edit {
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

.modal-content-edit-senha {
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
  font-size: 1.2em;
  color: #495057;
  margin-bottom: 20px;
  font-weight: 600;
}

.senha-numero {
  font-size: 8em;
  font-weight: bold;
  margin: 20px 0;
  padding: 30px;
  border-radius: 12px;
  letter-spacing: 4px;
  white-space: nowrap;
  overflow: visible;
}

/* Cores por tipo */
.senha-numero.prioridade {
  color: #ff6b6b;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
}

.senha-numero.normal {
  color: #4dabf7;
  background: linear-gradient(135deg, #f0f8ff 0%, #d0ebff 100%);
}

.senha-numero.contratual {
  color: #845ef7;
  background: linear-gradient(135deg, #f3e8ff 0%, #e5d4ff 100%);
}

/* Fallback se não tiver tipo */
.senha-numero:not(.prioridade):not(.normal):not(.contratual) {
  color: #667eea;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.form-group-modal-senha {
  margin-top: 30px;
  text-align: left;
}

.form-group-modal-senha label {
  display: block;
  margin-bottom: 10px;
  color: #495057;
  font-weight: 500;
  font-size: 0.9em;
}

.form-group-modal-senha textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

.form-group-modal-senha textarea:focus {
  outline: none;
  border-color: #667eea;
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

.modal-enter-active .modal-content-edit-senha,
.modal-leave-active .modal-content-edit-senha {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-edit-senha,
.modal-leave-to .modal-content-edit-senha {
  transform: scale(0.9);
}
</style>
