# Sistema de Configurações Completo - SGFILA v3.1

## 📋 Visão Geral

Este documento descreve o sistema de configurações completo implementado no SGFILA, que permite personalizar totalmente o comportamento, aparência e funcionalidades do sistema de gerenciamento de filas.

## ✅ Implementado

### 1. **Tipos e Interfaces** (`shared/types.ts`)
- ✅ `ConfiguracaoTipoSenha` - Personalização de tipos de senha
- ✅ `ConfiguracaoMotivoRetorno` - Motivos de retorno customizáveis
- ✅ `ConfiguracaoComportamentoFila` - Algoritmos e regras de fila
- ✅ `ConfiguracaoInterface` - Personalização visual
- ✅ `ConfiguracaoNotificacoes` - Sons e alertas
- ✅ `ConfiguracaoEstatisticas` - Métricas e relatórios
- ✅ `ConfiguracaoSeguranca` - Controles de segurança
- ✅ `ConfiguracoesGerais` - Container principal
- ✅ `CONFIG_PADRAO` - Valores padrão do sistema

### 2. **Backend - StateManager** (`server/src/services/StateManager.ts`)
- ✅ Integração com `EstadoSistema.configuracoes`
- ✅ Método `mesclarConfiguracoes()` - Migração automática
- ✅ Método `atualizarConfiguracoes()` - Atualização parcial/completa
- ✅ Método `atualizarTiposSenha()` - Gerenciar tipos
- ✅ Método `atualizarMotivosRetorno()` - Gerenciar motivos
- ✅ Método `atualizarComportamentoFila()` - Regras de fila
- ✅ Método `atualizarConfigInterface()` - Preferências visuais
- ✅ Método `atualizarNotificacoes()` - Sons e alertas
- ✅ Método `resetarConfiguracoes()` - Reset para padrão
- ✅ Método `getConfiguracoes()` - Obter configurações
- ✅ Sistema de migração automática de dados antigos

### 3. **Eventos Socket.IO** (`shared/types.ts`)
- ✅ `atualizarConfiguracoes` - Atualização geral
- ✅ `atualizarTiposSenha` - Tipos de senha
- ✅ `atualizarMotivosRetorno` - Motivos de retorno
- ✅ `atualizarComportamentoFila` - Comportamento
- ✅ `atualizarConfigInterface` - Interface
- ✅ `atualizarNotificacoes` - Notificações
- ✅ `resetarConfiguracoes` - Reset

## 🚧 Pendente de Implementação

### 4. **Backend - Socket Handlers** (`server/src/socket/SocketHandlers.ts`)
- ⏳ Implementar handlers para todos os eventos de configuração
- ⏳ Validação de dados recebidos
- ⏳ Tratamento de erros específico
- ⏳ Logs de auditoria (se ativado)

### 5. **Frontend - UI Components**

#### Painel Principal (`client/src/components/ConfigurationPanel.vue`)
- ⏳ Adicionar novas sub-abas:
  - `tipos` - Tipos de Senha
  - `retornos` - Motivos de Retorno
  - `comportamento` - Comportamento da Fila
  - `interface` - Interface
  - `notificacoes` - Notificações

#### Componentes Individuais (criar novos arquivos)
- ⏳ `TiposSenhaConfig.vue` - Gerenciar tipos de senha
  - Editar nomes, prefixos, cores
  - Ativar/desativar tipos
  - Adicionar/remover subtipos
  - Reordenar tipos

- ⏳ `MotivosRetornoConfig.vue` - Gerenciar motivos de retorno
  - Editar nomes e descrições
  - Configurar prazos
  - Definir posicionamento na fila
  - Ativar/desativar motivos

- ⏳ `ComportamentoFilaConfig.vue` - Regras da fila
  - Escolher algoritmo (proporção/round-robin/FIFO)
  - Permitir pular senhas
  - Auto-finalizar atendimentos
  - Chamar próxima automaticamente
  - Alertas de tempo de espera

- ⏳ `InterfaceConfig.vue` - Personalização visual
  - Tema (claro/escuro/auto)
  - Tamanho de fonte
  - Formato de números
  - Mostrar/ocultar elementos
  - Ordenação padrão

- ⏳ `NotificacoesConfig.vue` - Sons e alertas
  - Ativar/desativar som
  - Controle de volume
  - Número de beeps
  - Alertas de fila cheia
  - Alerta de guichê inativo

### 6. **Frontend - Composable useSocket** (`client/src/composables/useSocket.ts`)
- ⏳ Adicionar métodos emit para configurações:
  - `atualizarConfiguracoes()`
  - `atualizarTiposSenha()`
  - `atualizarMotivosRetorno()`
  - `atualizarComportamentoFila()`
  - `atualizarConfigInterface()`
  - `atualizarNotificacoes()`
  - `resetarConfiguracoes()`

### 7. **Integração com Componentes Existentes**
- ⏳ Aplicar configurações de `tiposSenha` em:
  - `App.vue` - Botões de emissão
  - `QueueList.vue` - Cores e ícones
  - `CounterPanel.vue` - Display de senhas
  - `NewTicketModal.vue` - Seleção de tipo

- ⏳ Aplicar configurações de `motivosRetorno` em:
  - `ReturnToQueueModal.vue` - Lista de motivos

- ⏳ Aplicar configurações de `interface` em:
  - Todos os componentes - Tema e tamanhos
  - `QueueList.vue` - Formato de números
  - `StatisticsPanel.vue` - Métricas visíveis

- ⏳ Aplicar configurações de `notificacoes` em:
  - `useBeep.ts` - Volume e beeps
  - `App.vue` - Alertas visuais

### 8. **Testes e Validação**
- ⏳ Testar persistência de configurações
- ⏳ Testar migração de dados antigos
- ⏳ Testar reset de configurações
- ⏳ Validar UX de cada painel
- ⏳ Testar comportamento em tempo real
- ⏳ Documentar casos de uso

## 📊 Configurações Disponíveis

### **1. Tipos de Senha**
```typescript
{
  id: 'prioridade' | 'normal' | 'contratual',
  nome: string,           // Nome curto
  nomeCompleto: string,   // Nome descritivo
  prefixo: string,        // P, N, C
  cor: string,            // #ff6b6b
  corFundo: string,       // #fff5f5
  icone: string,          // Font Awesome icon
  ativo: boolean,         // Mostrar/ocultar
  ordem: number,          // Ordem de exibição
  subtipos: string[]      // ['Idoso', 'Gestante', ...]
}
```

### **2. Motivos de Retorno**
```typescript
{
  id: MotivoRetorno,
  nome: string,
  descricao: string,
  icone: string,
  cor: string,
  prazoMinutos: number | null,
  posicionamentoFila: 'inicio' | 'meio' | 'fim' | 'original',
  ativo: boolean
}
```

### **3. Comportamento da Fila**
```typescript
{
  algoritmo: 'proporcao' | 'round_robin' | 'fifo',
  permitirPularSenhas: boolean,
  autoFinalizarMinutos: number | null,
  chamarProximaAutomatica: boolean,
  tempoEsperaMaximoMinutos: number | null,
  alertarTempoEsperaExcedido: boolean
}
```

### **4. Interface**
```typescript
{
  tema: 'claro' | 'escuro' | 'auto',
  tamanhoFonteSenhas: 'pequeno' | 'medio' | 'grande' | 'extra-grande',
  formatoNumeroSenha: 'com-hifen' | 'sem-hifen' | 'apenas-numero',
  mostrarDescricaoSenha: boolean,
  mostrarTempoEspera: boolean,
  mostrarTempoAtendimento: boolean,
  ordenacaoFilaPadrao: 'emissao' | 'tipo' | 'tempo-espera',
  exibirIconesPrioridade: boolean
}
```

### **5. Notificações**
```typescript
{
  somAtivo: boolean,
  volumeSom: number,          // 0-100
  beepsEmissao: number,
  beepsChamada: number,
  alertaFilaCheia: boolean,
  limiteFilaCheia: number,
  alertaGuicheInativo: boolean,
  tempoInativoMinutos: number
}
```

### **6. Estatísticas**
```typescript
{
  metricas: {
    totalEmitidas: boolean,
    totalAtendidas: boolean,
    tempoMedioEspera: boolean,
    tempoMedioAtendimento: boolean,
    taxaNaoComparecimento: boolean,
    produtividadePorGuiche: boolean
  },
  periodoAnalise: 'dia' | 'semana' | 'mes' | 'personalizado',
  atualizacaoAutomatica: boolean,
  intervaloAtualizacaoSegundos: number
}
```

### **7. Segurança**
```typescript
{
  senhaAdmin: string | null,
  exigirConfirmacaoExclusao: boolean,
  exigirConfirmacaoReinicio: boolean,
  logAuditoria: boolean,
  backupAutomatico: boolean,
  intervaloBackupMinutos: number
}
```

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Cliente   │
│ (Vue Component)
└──────┬──────┘
       │ emit evento
       ▼
┌─────────────┐
│  Socket.IO  │
│  (Cliente)  │
└──────┬──────┘
       │ WebSocket
       ▼
┌─────────────┐
│  Socket.IO  │
│  (Servidor) │
└──────┬──────┘
       │ handler
       ▼
┌─────────────┐
│ StateManager│
│ atualizar() │
└──────┬──────┘
       │ salvar
       ▼
┌─────────────┐
│ dados.json  │
└─────────────┘
       │ broadcast
       ▼
┌─────────────┐
│Todos Clientes
│estadoAtualizado
└─────────────┘
```

## 🎯 Próximos Passos

1. **Implementar Socket Handlers** - Conectar frontend ao backend
2. **Criar Componentes UI** - Painéis de configuração
3. **Integrar com Sistema Existente** - Aplicar configurações
4. **Testar Completamente** - Validar todos os cenários
5. **Documentar Uso** - Guia do usuário

## 📝 Notas de Desenvolvimento

- Todas as configurações são salvas automaticamente em `dados.json`
- Sistema de migração garante compatibilidade com dados antigos
- Configurações são reativas - mudanças aparecem em tempo real
- Reset de configurações não afeta dados operacionais (senhas, histórico)
- Configurações são enviadas para todos os clientes conectados

## 🔗 Arquivos Relacionados

- `v3/shared/types.ts` - Definições de tipos
- `v3/server/src/services/StateManager.ts` - Backend
- `v3/server/src/socket/SocketHandlers.ts` - Handlers (pendente)
- `v3/client/src/components/ConfigurationPanel.vue` - UI (pendente)
- `v3/client/src/composables/useSocket.ts` - Cliente Socket (pendente)
