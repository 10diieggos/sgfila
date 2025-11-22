<template>
  <div class="period-filter">
    <div class="filter-header">
      <h3><i class="fas fa-filter" /> Filtros de Período</h3>
      <button
        v-if="periodoAtual !== 'dia'"
        class="btn-reset"
        title="Voltar para visualização do dia atual"
        @click="resetarFiltro"
      >
        <i class="fas fa-sync" /> Hoje
      </button>
    </div>

    <div class="filter-options">
      <!-- Filtros rápidos -->
      <div class="quick-filters">
        <button
          :class="['filter-btn', { active: periodoAtual === 'dia' }]"
          @click="aplicarFiltro('dia')"
        >
          <i class="fas fa-calendar-day" />
          Hoje
        </button>

        <button
          :class="['filter-btn', { active: periodoAtual === 'semana' }]"
          @click="aplicarFiltro('semana')"
        >
          <i class="fas fa-calendar-week" />
          Últimos 7 dias
        </button>

        <button
          :class="['filter-btn', { active: periodoAtual === 'mes' }]"
          @click="aplicarFiltro('mes')"
        >
          <i class="fas fa-calendar-alt" />
          Últimos 30 dias
        </button>

        <button
          :class="['filter-btn', { active: periodoAtual === 'personalizado' }]"
          @click="togglePersonalizado"
        >
          <i class="fas fa-calendar-plus" />
          Personalizado
        </button>
      </div>

      <!-- Seletor de período personalizado -->
      <div
        v-if="mostrarPersonalizado"
        class="custom-period"
      >
        <div class="date-inputs">
          <div class="input-group">
            <label>Data Início:</label>
            <input
              v-model="dataInicio"
              type="date"
              :max="dataFim || dataHoje"
              class="date-input"
            >
          </div>

          <div class="input-group">
            <label>Data Fim:</label>
            <input
              v-model="dataFim"
              type="date"
              :min="dataInicio"
              :max="dataHoje"
              class="date-input"
            >
          </div>

          <button
            :disabled="!dataInicio || !dataFim"
            class="btn-apply"
            @click="aplicarPeriodoPersonalizado"
          >
            <i class="fas fa-check" /> Aplicar
          </button>
        </div>
      </div>

      <!-- Indicador de período ativo -->
      <div
        v-if="periodoDescricao"
        class="period-indicator"
      >
        <i class="fas fa-info-circle" />
        <span>Exibindo: <strong>{{ periodoDescricao }}</strong></span>
        <span
          v-if="(diasAnalisados || 0) > 1"
          class="days-count"
        >
          ({{ diasAnalisados }} dias)
        </span>
      </div>

      <!-- Tendências (se disponível) -->
      <div
        v-if="tendencias && periodoAtual !== 'dia'"
        class="tendencias"
      >
        <div class="tendencia-item">
          <span class="label">Emissão:</span>
          <span :class="['badge', `badge-${tendencias.emissao}`]">
            <i :class="getTendenciaIcon(tendencias.emissao)" />
            {{ getTendenciaLabel(tendencias.emissao) }}
          </span>
          <span
            v-if="tendencias.variacaoEmissao !== 0"
            class="variacao"
          >
            {{ tendencias.variacaoEmissao > 0 ? '+' : '' }}{{ tendencias.variacaoEmissao.toFixed(1) }}%
          </span>
        </div>

        <div class="tendencia-item">
          <span class="label">Tempo de Espera:</span>
          <span :class="['badge', `badge-${tendencias.atendimento}`]">
            <i :class="getTendenciaIcon(tendencias.atendimento)" />
            {{ getTendenciaLabel(tendencias.atendimento) }}
          </span>
          <span
            v-if="tendencias.variacaoTempo !== 0"
            class="variacao"
          >
            {{ tendencias.variacaoTempo > 0 ? '+' : '' }}{{ tendencias.variacaoTempo.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div
      v-if="carregando"
      class="loading"
    >
      <i class="fas fa-spinner fa-spin" /> Carregando estatísticas...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
defineProps<{
  periodoDescricao?: string
  diasAnalisados?: number
  tendencias?: {
    emissao: 'crescente' | 'estavel' | 'decrescente'
    atendimento: 'melhorando' | 'estavel' | 'piorando'
    variacaoEmissao: number
    variacaoTempo: number
  } | null
  carregando?: boolean
}>()

// Emits
const emit = defineEmits<{
  aplicarFiltro: [dados: {
    tipo: 'dia' | 'semana' | 'mes' | 'personalizado'
    dataInicio?: string
    dataFim?: string
  }]
}>()

// State
const periodoAtual = ref<'dia' | 'semana' | 'mes' | 'personalizado'>('dia')
const mostrarPersonalizado = ref(false)
const dataInicio = ref('')
const dataFim = ref('')

// Data de hoje no formato YYYY-MM-DD
const dataHoje = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Methods
const aplicarFiltro = (tipo: 'dia' | 'semana' | 'mes' | 'personalizado') => {
  periodoAtual.value = tipo
  mostrarPersonalizado.value = false

  if (tipo !== 'personalizado') {
    emit('aplicarFiltro', { tipo })
  }
}

const togglePersonalizado = () => {
  mostrarPersonalizado.value = !mostrarPersonalizado.value
  periodoAtual.value = 'personalizado'

  // Define valores padrão
  if (mostrarPersonalizado.value && !dataInicio.value) {
    const umaSemanaAtras = new Date()
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7)
    dataInicio.value = umaSemanaAtras.toISOString().split('T')[0]
    dataFim.value = dataHoje.value
  }
}

const aplicarPeriodoPersonalizado = () => {
  if (!dataInicio.value || !dataFim.value) return

  emit('aplicarFiltro', {
    tipo: 'personalizado',
    dataInicio: dataInicio.value,
    dataFim: dataFim.value
  })
}

const resetarFiltro = () => {
  periodoAtual.value = 'dia'
  mostrarPersonalizado.value = false
  dataInicio.value = ''
  dataFim.value = ''
  emit('aplicarFiltro', { tipo: 'dia' })
}

const getTendenciaIcon = (tendencia: string): string => {
  const icons: Record<string, string> = {
    'crescente': 'fas fa-arrow-up',
    'decrescente': 'fas fa-arrow-down',
    'estavel': 'fas fa-minus',
    'melhorando': 'fas fa-arrow-down',
    'piorando': 'fas fa-arrow-up'
  }
  return icons[tendencia] || 'fas fa-minus'
}

const getTendenciaLabel = (tendencia: string): string => {
  const labels: Record<string, string> = {
    'crescente': 'Crescente',
    'decrescente': 'Decrescente',
    'estavel': 'Estável',
    'melhorando': 'Melhorando',
    'piorando': 'Piorando'
  }
  return labels[tendencia] || tendencia
}
</script>

<style scoped>
.period-filter {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-header h3 {
  margin: 0;
  color: #495057;
  font-size: 1.2em;
}

.filter-header h3 i {
  margin-right: 8px;
  color: #667eea;
}

.btn-reset {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-reset i {
  margin-right: 5px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quick-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.filter-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  font-weight: 500;
  color: #495057;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.filter-btn:hover {
  background: #e9ecef;
  border-color: #667eea;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.filter-btn i {
  font-size: 1.1em;
}

.custom-period {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 15px;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  font-size: 0.9em;
  color: #6c757d;
  font-weight: 500;
}

.date-input {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95em;
  font-family: inherit;
}

.date-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-apply {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-apply:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.btn-apply:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.5;
}

.period-indicator {
  background: #e7f3ff;
  border-left: 4px solid #4dabf7;
  padding: 12px 15px;
  border-radius: 6px;
  color: #004a8d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.period-indicator i {
  color: #4dabf7;
}

.period-indicator strong {
  font-weight: 600;
}

.days-count {
  color: #6c757d;
  font-size: 0.9em;
  margin-left: 5px;
}

.tendencias {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tendencia-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tendencia-item .label {
  color: #6c757d;
  font-weight: 500;
  min-width: 130px;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.badge-crescente,
.badge-piorando {
  background: #ff6b6b;
}

.badge-decrescente,
.badge-melhorando {
  background: #51cf66;
}

.badge-estavel {
  background: #4dabf7;
}

.variacao {
  font-size: 0.9em;
  color: #6c757d;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 15px;
  color: #667eea;
  font-weight: 500;
}

.loading i {
  margin-right: 8px;
}

/* Responsividade */
@media (max-width: 768px) {
  .quick-filters {
    grid-template-columns: 1fr 1fr;
  }

  .date-inputs {
    grid-template-columns: 1fr;
  }

  .filter-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .tendencias {
    grid-template-columns: 1fr;
  }
}
</style>
