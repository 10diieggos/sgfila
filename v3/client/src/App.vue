<template>
  <div id="app" class="container">
    <header>
      <h1><i class="fas fa-mail-bulk"></i> SGFILA v3.0</h1>
      <p>Sistema de Gerenciamento de Filas - TypeScript + Vue 3</p>
      <div class="connection-status">
        <span :class="['status-indicator', { connected }]"></span>
        {{ connected ? 'Conectado' : 'Desconectado' }}
      </div>
    </header>

    <div v-if="!estado" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Carregando...
    </div>

    <div v-else class="dashboard">
      <!-- Emissão de Senhas -->
      <div class="card">
        <h3><i class="fas fa-ticket-alt"></i> Emissão de Senhas</h3>
        <div class="controls">
          <button @click="emitirSenha('prioridade')" class="btn btn-priority">
            <i class="fas fa-wheelchair"></i> Prioritária
          </button>
          <button @click="emitirSenha('normal')" class="btn btn-normal">
            <i class="fas fa-user"></i> Normal
          </button>
          <button @click="emitirSenha('contratual')" class="btn btn-contract">
            <i class="fas fa-file-contract"></i> Contratual
          </button>
        </div>
      </div>

      <!-- Fila de Espera -->
      <div class="card">
        <QueueList
          :senhas="estado.senhas || []"
          @ver-detalhes="handleVerDetalhes"
          @chamar="handleChamar"
          @editar="handleEditar"
          @excluir="handleExcluir"
        />
      </div>

      <!-- Estatísticas -->
      <div class="card" v-if="estatisticas">
        <h3><i class="fas fa-chart-bar"></i> Estatísticas</h3>
        <div class="stats">
          <div class="stat-item">
            <span>Total Emitidas:</span>
            <strong>{{ estatisticas.totalEmitidas }}</strong>
          </div>
          <div class="stat-item">
            <span>Total Atendidas:</span>
            <strong>{{ estatisticas.totalAtendidas }}</strong>
          </div>
          <div class="stat-item">
            <span>Tempo Médio Espera:</span>
            <strong>{{ estatisticas.tempoMedioEsperaGeral }}</strong>
          </div>
          <div class="stat-item">
            <span>Próxima Senha:</span>
            <strong>{{ estatisticas.proximaSenha }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSocket } from './composables/useSocket'
import QueueList from './components/QueueList.vue'

const {
  connected,
  estado,
  estatisticas,
  emitirSenha: emitirSenhaSocket,
  chamarSenhaEspecifica,
  excluirSenha,
  atualizarDescricao
} = useSocket()

// Handlers
const emitirSenha = (tipo: 'prioridade' | 'normal' | 'contratual') => {
  emitirSenhaSocket(tipo, '')
}

const handleVerDetalhes = (numero: string) => {
  console.log('Ver detalhes:', numero)
  // TODO: Implementar modal de detalhes
}

const handleChamar = (numero: string) => {
  // TODO: Buscar guichê livre
  const guicheId = 'Guichê 1'
  chamarSenhaEspecifica(guicheId, numero)
}

const handleEditar = (numero: string) => {
  console.log('Editar:', numero)
  // TODO: Implementar modal de edição
}

const handleExcluir = (numero: string) => {
  if (confirm(`Excluir senha ${numero}?`)) {
    excluirSenha(numero)
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  color: #333;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

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
  font-size: 2.5em;
  margin-bottom: 10px;
}

header p {
  font-size: 1.1em;
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
}

.status-indicator.connected {
  background: #28a745;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 1.5em;
  color: #868e96;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-bottom: 20px;
  color: #495057;
  font-size: 1.3em;
}

.controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
  font-weight: 600;
  flex: 1;
  min-width: 150px;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item strong {
  color: #667eea;
  font-size: 1.2em;
}
</style>
