# SGFILA v3.0 - TypeScript + Vue 3 + Vite

Sistema de Gerenciamento de Filas completamente refatorado com stack moderna e type-safe.

## 🎯 Visão Geral

A v3.0 é uma reescrita completa do SGFILA utilizando:
- **Backend**: TypeScript + Express + Socket.IO
- **Frontend**: Vue 3 + TypeScript + Vite
- **Types**: Tipos compartilhados entre cliente e servidor
- **Arquitetura**: Modular, escalável e otimizada para manutenção por IA

## 📦 Estrutura do Projeto

```
v3/
├── shared/                    # Tipos TypeScript compartilhados
│   └── types.ts              # Interfaces e tipos
├── server/                    # Backend TypeScript
│   ├── src/
│   │   ├── services/         # Lógica de negócio
│   │   │   ├── StateManager.ts
│   │   │   ├── StatisticsService.ts
│   │   │   └── QueueService.ts
│   │   ├── socket/           # Handlers Socket.IO
│   │   │   └── SocketHandlers.ts
│   │   └── server.ts         # Entry point
│   ├── package.json
│   └── tsconfig.json
└── client/                    # Frontend Vue 3
    ├── src/
    │   ├── components/       # Componentes Vue
    │   │   └── QueueList.vue
    │   ├── composables/      # Lógica reutilizável
    │   │   ├── useSocket.ts
    │   │   └── useUtils.ts
    │   ├── styles/           # CSS global
    │   │   └── main.css
    │   ├── App.vue           # Componente raiz
    │   └── main.ts           # Entry point
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## 🚀 Setup e Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Instalar Dependências

**Servidor:**
```bash
cd v3/server
npm install
```

**Cliente:**
```bash
cd v3/client
npm install
```

### 2. Desenvolvimento

**Terminal 1 - Servidor:**
```bash
cd v3/server
npm run dev
# Servidor roda em http://localhost:3000
```

**Terminal 2 - Cliente:**
```bash
cd v3/client
npm run dev
# Cliente roda em http://localhost:5173
```

### 3. Build para Produção

**Servidor:**
```bash
cd v3/server
npm run build
npm start
```

**Cliente:**
```bash
cd v3/client
npm run build
# Arquivos gerados em dist/
```

## 🎨 Arquitetura

### Backend (TypeScript)

#### StateManager
Gerencia o estado global do sistema e persistência em `dados.json`.

**Responsabilidades:**
- Carregar/salvar estado
- Migração de dados antigos
- Singleton pattern

**Métodos principais:**
```typescript
getInstance(): StateManager
getEstado(): EstadoSistema
setEstado(estado: EstadoSistema): void
reiniciar(): void
atualizarGuiches(guiches: Guiche[]): void
```

#### QueueService
Gerencia todas as operações de fila e senhas.

**Responsabilidades:**
- Emitir senhas
- Chamar senhas (automático e manual)
- Finalizar atendimentos
- Devolver senhas
- Excluir senhas
- Atualizar descrições

**Métodos principais:**
```typescript
emitirSenha(tipo: TipoSenha, subtipo: string): Senha
chamarSenha(guicheId: string): Senha | null
chamarSenhaEspecifica(guicheId: string, numeroSenha: string): Senha | null
finalizarAtendimento(guicheId: string): Senha | null
devolverSenha(numeroSenha: string): Senha | null
excluirSenha(numeroSenha: string): boolean
atualizarDescricao(numeroSenha: string, descricao: string): Senha | null
```

#### StatisticsService
Calcula todas as estatísticas do sistema.

**Responsabilidades:**
- Cálculo de métricas gerais
- Estatísticas por tipo
- Estatísticas por guichê
- Próxima senha na fila

**Métodos principais:**
```typescript
static calcularEstatisticas(estado: EstadoSistema): Estatisticas
```

#### SocketHandlers
Gerencia todos os eventos Socket.IO entre cliente e servidor.

**Eventos (Cliente → Servidor):**
- `emitirSenha`
- `chamarSenha`
- `chamarSenhaEspecifica`
- `finalizarAtendimento`
- `excluirSenha`
- `excluirAtendimento`
- `devolverSenha`
- `atualizarDescricao`
- `atualizarProporcao`
- `atualizarProporcaoContratual`
- `atualizarGuichesGlobais`
- `reiniciarSistema`

**Eventos (Servidor → Cliente):**
- `estadoAtualizado`
- `beep`
- `sistemaReiniciado`

### Frontend (Vue 3)

#### Composables

**useSocket.ts**
Gerencia conexão Socket.IO e estado global.

```typescript
const {
  connected,          // Estado da conexão
  estado,            // Estado do sistema
  estatisticas,      // Estatísticas
  emitirSenha,       // Emitir nova senha
  chamarSenha,       // Chamar próxima senha
  // ... outros métodos
} = useSocket()
```

**useUtils.ts**
Funções utilitárias reutilizáveis.

```typescript
calcularTempoEspera(timestamp: number): number
formatarTempo(milissegundos: number): string
getIconClass(tipo: string): string
formatarDescricao(descricao: string): string
```

#### Componentes

**QueueList.vue**
Componente principal de lista de filas com filtros e ordenação.

**Props:**
```typescript
interface Props {
  senhas: Senha[]
}
```

**Emits:**
```typescript
'ver-detalhes': [numero: string]
'chamar': [numero: string]
'editar': [numero: string]
'excluir': [numero: string]
```

## 🔧 Desenvolvimento

### Adicionando Novos Componentes

1. Criar arquivo em `client/src/components/`:
```vue
<template>
  <div class="meu-componente">
    <!-- HTML aqui -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MinhaInterface } from '@shared/types'

// Props
interface Props {
  dado: string
}
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'minha-acao': [valor: string]
}>()

// State
const contador = ref(0)
</script>

<style scoped>
.meu-componente {
  /* CSS aqui */
}
</style>
```

2. Importar no componente pai:
```typescript
import MeuComponente from './components/MeuComponente.vue'
```

### Adicionando Novos Tipos

Adicione em `shared/types.ts`:
```typescript
export interface NovoTipo {
  campo: string
  numero: number
}
```

Tipos ficam disponíveis automaticamente em cliente e servidor via:
```typescript
import type { NovoTipo } from '@shared/types'
```

### Adicionando Novos Eventos Socket.IO

1. Adicionar tipo em `shared/types.ts`:
```typescript
export interface ClientToServerEvents {
  // ... eventos existentes
  meuNovoEvento: (dados: { valor: string }) => void
}
```

2. Adicionar handler em `server/src/socket/SocketHandlers.ts`:
```typescript
socket.on('meuNovoEvento', ({ valor }) => {
  // Lógica aqui
  this.emitirEstadoAtualizado()
})
```

3. Adicionar método em `client/src/composables/useSocket.ts`:
```typescript
const meuNovoEvento = (valor: string) => {
  socket.value?.emit('meuNovoEvento', { valor })
}

return {
  // ... outros
  meuNovoEvento
}
```

## 📝 Componentes Faltantes (TODO)

Para completar a v3.0, os seguintes componentes precisam ser criados:

### 1. CounterPanel.vue
Painel de controle de guichês (chamar/finalizar).

```vue
<template>
  <div class="counter-panel">
    <div
      v-for="guiche in guichesExibicao"
      :key="guiche"
      @click="toggleCounter(guiche)"
      :class="['counter', { occupied: isOccupied(guiche) }]"
    >
      <div class="counter-name">{{ guiche }}</div>
      <div class="ticket-number">{{ getTicketNumber(guiche) }}</div>
    </div>
  </div>
</template>
```

### 2. StatisticsPanel.vue
Painel de estatísticas detalhadas.

```vue
<template>
  <div class="statistics-panel">
    <div class="stat-cards">
      <!-- Cards de estatísticas -->
    </div>
    <table class="stats-table">
      <!-- Tabela por tipo -->
    </table>
  </div>
</template>
```

### 3. TicketDetailsModal.vue
Modal com detalhes completos de uma senha.

```vue
<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <!-- Detalhes da senha -->
    </div>
  </div>
</template>
```

### 4. EditDescriptionModal.vue
Modal para editar descrição de senha.

### 5. ConfigurationPanel.vue
Painel de configurações (guichês, proporções).

### 6. HistoryPanel.vue
Painel de histórico de atendimentos.

## 🎯 Vantagens da v3.0

### Para Desenvolvimento Humano
✅ **Type Safety**: TypeScript previne erros em tempo de compilação
✅ **Hot Reload**: Mudanças aparecem instantaneamente
✅ **Componentização**: Código organizado em componentes reutilizáveis
✅ **DevTools**: Vue DevTools para debugging
✅ **Moderno**: Stack atualizada e mantida

### Para Manutenção por IA
✅ **Estrutura Previsível**: Sempre `<template>` → `<script>` → `<style>`
✅ **Tipos Explícitos**: IA vê contratos claros
✅ **Imports Explícitos**: Dependências sempre visíveis
✅ **Arquivos Pequenos**: ~100-200 linhas por componente
✅ **Lint Automático**: Erros detectados antes de rodar
✅ **Grafo de Dependências**: IA entende facilmente relações

### Comparação de Tamanho

| Arquivo | v2 (jQuery) | v3 (Vue) | Redução |
|---------|-------------|----------|---------|
| ui-controller | 931 linhas | ~100 linhas/componente | 90% |
| Lógica total | ~2000 linhas | ~800 linhas | 60% |

## 🔒 Funcionamento Offline

A v3.0 funciona **100% offline** após `npm install`:
- Todas as dependências em `node_modules`
- Build gera arquivos estáticos
- Servidor roda localmente
- Dados em `dados.json` local

## 🐛 Debug

### Servidor
```bash
cd v3/server
npm run dev
# Logs aparecem no terminal
```

### Cliente
1. Abrir http://localhost:5173
2. Pressionar F12 (DevTools)
3. Tab "Console" para logs
4. Tab "Vue" (Vue DevTools) para inspecionar componentes

### TypeScript Errors
```bash
# Servidor
cd v3/server
npm run type-check

# Cliente
cd v3/client
npm run type-check
```

## 📚 Recursos

- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Socket.IO Docs](https://socket.io/docs/v4/)

## 🎓 Para IAs Futuras

Esta arquitetura foi desenhada para facilitar manutenção por IA:

1. **Types compartilhados** eliminam ambiguidade
2. **Composables** isolam lógica reutilizável
3. **Componentes pequenos** reduzem contexto necessário
4. **Estrutura previsível** facilita navegação
5. **TypeScript** fornece autocomplete e validação

Ao fazer modificações:
- Sempre atualize types em `shared/types.ts` primeiro
- Rode `npm run type-check` antes de commitar
- Mantenha componentes < 200 linhas
- Use composables para lógica compartilhada
- Documente mudanças neste README

---

**Criado**: 2025-11-17
**Versão**: 3.0.0
**Stack**: TypeScript + Vue 3 + Vite + Express + Socket.IO
