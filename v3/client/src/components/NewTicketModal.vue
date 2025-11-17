<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content-nova-senha">
          <span class="modal-label">Nova Senha Emitida</span>
          <div class="senha-gerada-numero">{{ numeroSenha }}</div>

          <div class="form-group-modal-senha">
            <label for="nova-senha-descricao">Descrição (Opcional - Pressione Enter para salvar):</label>
            <textarea
              id="nova-senha-descricao"
              ref="textareaRef"
              v-model="descricao"
              rows="3"
              placeholder="Ex: Alteração de CPF..."
              @keydown.enter.prevent="handleSalvar"
            ></textarea>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  show: boolean
  numeroSenha: string
}>()

const emit = defineEmits<{
  'close': []
  'save': [descricao: string]
}>()

const descricao = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

// Auto-focus quando modal abre
watch(() => props.show, async (newVal) => {
  if (newVal) {
    descricao.value = ''
    await nextTick()
    textareaRef.value?.focus()
  }
})

const handleClose = () => {
  if (descricao.value.trim()) {
    handleSalvar()
  } else {
    emit('close')
  }
}

const handleSalvar = () => {
  emit('save', descricao.value.trim())
  emit('close')
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
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content-nova-senha {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
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

.senha-gerada-numero {
  font-size: 4em;
  font-weight: bold;
  color: #667eea;
  margin: 20px 0;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  letter-spacing: 4px;
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

.modal-enter-active .modal-content-nova-senha,
.modal-leave-active .modal-content-nova-senha {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-nova-senha,
.modal-leave-to .modal-content-nova-senha {
  transform: scale(0.9);
}
</style>
