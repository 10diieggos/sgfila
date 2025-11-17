<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ title }}</h3>
          </div>

          <div class="modal-body">
            <p>{{ message }}</p>
          </div>

          <div class="modal-actions">
            <button class="btn btn-confirm" @click="$emit('confirm')">
              {{ confirmText }}
            </button>
            <button class="btn btn-cancel" @click="$emit('cancel')">
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}>(), {
  title: 'Confirmar Ação',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar'
})

defineEmits<{
  'confirm': []
  'cancel': []
}>()
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
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 25px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3em;
}

.modal-body {
  padding: 25px;
}

.modal-body p {
  margin: 0;
  color: #495057;
  font-size: 1.05em;
  line-height: 1.6;
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

.btn-confirm {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
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
