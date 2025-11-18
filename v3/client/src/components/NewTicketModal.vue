<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay modal-clicavel-fechar" @click.self="handleClickOverlay" @keydown="handleKeyDown">
        <div class="modal-content-nova-senha" @click.stop>
          <span class="modal-label">Nova Senha Emitida</span>
          <div :class="['senha-gerada-numero', tipoSenha]">{{ numeroSenha }}</div>

          <div v-show="descricaoAtiva" class="form-group-modal-senha">
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
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { TipoSenha } from '@shared/types'

const props = defineProps<{
  show: boolean
  numeroSenha: string
  tipoSenha?: TipoSenha
}>()

const emit = defineEmits<{
  'close': []
  'save': [descricao: string]
}>()

const descricao = ref('')
const descricaoAtiva = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()

// Watch para quando modal abre
watch(() => props.show, async (newVal) => {
  if (newVal) {
    descricao.value = ''
    descricaoAtiva.value = false
  }
})

const handleClickOverlay = () => {
  fecharModal()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.show) return

  const isEnter = e.key === 'Enter'

  if (isEnter) {
    e.preventDefault()
    if (!descricaoAtiva.value) {
      // Primeira vez: ativa textarea
      descricaoAtiva.value = true
      nextTick(() => {
        textareaRef.value?.focus()
      })
    } else {
      // Segunda vez: salva e fecha
      handleSalvar()
    }
  } else {
    // Qualquer outra tecla: fecha (só se textarea não estiver ativo)
    if (!descricaoAtiva.value) {
      fecharModal()
    }
  }
}

const fecharModal = () => {
  const descricaoTrim = descricao.value.trim()
  if (descricaoTrim) {
    emit('save', descricaoTrim)
  }
  emit('close')
}

const handleSalvar = () => {
  emit('save', descricao.value.trim())
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

.senha-gerada-numero {
  font-size: 10em;
  font-weight: bold;
  margin: 20px 0;
  padding: 30px;
  border-radius: 12px;
  letter-spacing: 4px;
  white-space: nowrap;
  overflow: visible;
}

/* Cores por tipo */
.senha-gerada-numero.prioridade {
  color: #ff6b6b;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
}

.senha-gerada-numero.normal {
  color: #4dabf7;
  background: linear-gradient(135deg, #f0f8ff 0%, #d0ebff 100%);
}

.senha-gerada-numero.contratual {
  color: #845ef7;
  background: linear-gradient(135deg, #f3e8ff 0%, #e5d4ff 100%);
}

/* Fallback se não tiver tipo */
.senha-gerada-numero:not(.prioridade):not(.normal):not(.contratual) {
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

.modal-enter-active .modal-content-nova-senha,
.modal-leave-active .modal-content-nova-senha {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content-nova-senha,
.modal-leave-to .modal-content-nova-senha {
  transform: scale(0.9);
}
</style>
