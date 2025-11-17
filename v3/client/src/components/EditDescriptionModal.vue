<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Editar Descrição - {{ numeroSenha }}</h3>
            <button class="close-btn" @click="$emit('close')">&times;</button>
          </div>

          <div class="form-group">
            <label for="editar-descricao">Descrição:</label>
            <textarea
              id="editar-descricao"
              ref="textareaRef"
              v-model="descricaoLocal"
              rows="4"
              placeholder="Digite a descrição..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button class="btn btn-save" @click="handleSalvar">
              <i class="fas fa-save"></i> Salvar
            </button>
            <button class="btn btn-cancel" @click="$emit('close')">
              Cancelar
            </button>
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
  descricao: string
}>()

const emit = defineEmits<{
  'close': []
  'save': [descricao: string]
}>()

const descricaoLocal = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

watch(() => props.show, async (newVal) => {
  if (newVal) {
    descricaoLocal.value = props.descricao
    await nextTick()
    textareaRef.value?.focus()
  }
})

const handleSalvar = () => {
  emit('save', descricaoLocal.value.trim())
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

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3em;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2em;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.form-group {
  padding: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #495057;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  padding: 20px 25px;
  background: #f8f9fa;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
  background: #e9ecef;
  color: #495057;
}

.btn-cancel:hover {
  background: #dee2e6;
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
</style>
