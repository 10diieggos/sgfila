# Instruções para Integração do ReturnToQueueModal no App.vue

O sistema de devolução de senhas foi implementado. Falta apenas integrar o modal no `App.vue`.

## Mudanças Necessárias

### 1. Adicionar Import (linha ~284)

```typescript
import NewTicketModal from './components/NewTicketModal.vue'
import EditDescriptionModal from './components/EditDescriptionModal.vue'
import ConfirmActionModal from './components/ConfirmActionModal.vue'
import TicketModal from './components/TicketModal.vue'
import ReturnToQueueModal from './components/ReturnToQueueModal.vue' // ⬅️ ADICIONAR
```

### 2. Adicionar devolverSenhaComMotivo ao useSocket (linha ~287)

```typescript
const {
  connected,
  estado,
  estatisticas,
  emitirSenha,
  chamarSenha,
  chamarSenhaEspecifica,
  finalizarAtendimento,
  excluirSenha,
  excluirAtendimento,
  devolverSenha,
  devolverSenhaComMotivo, // ⬅️ ADICIONAR
  atualizarDescricao,
  atualizarProporcao,
  atualizarProporcaoContratual,
  atualizarGuichesGlobais,
  reiniciarSistema
} = useSocket()
```

### 3. Adicionar Estados do Modal (linha ~310, após outros ref)

```typescript
// Estados dos modais
const showNewTicketModal = ref(false)
const showEditModal = ref(false)
const showConfirmModal = ref(false)
const showTicketModal = ref(false)
const showHistoryModal = ref(false)
const showStatsModal = ref(false)
const showConfigModal = ref(false)
const showReturnModal = ref(false) // ⬅️ ADICIONAR
const senhaSelecionadaRetorno = ref<Senha | null>(null) // ⬅️ ADICIONAR
```

### 4. Modificar handleDevolverSenha (linha ~386)

**ANTES:**
```typescript
const handleDevolverSenha = (numeroSenha: string) => {
  devolverSenha(numeroSenha)
}
```

**DEPOIS:**
```typescript
const handleDevolverSenha = (numeroSenha: string) => {
  const senha = estado.value?.senhas.find(s => s.numero === numeroSenha)
  if (senha) {
    senhaSelecionadaRetorno.value = senha
    showReturnModal.value = true
  }
}
```

### 5. Adicionar Novos Handlers (depois de handleDevolverSenha)

```typescript
const handleCloseReturnModal = () => {
  showReturnModal.value = false
  senhaSelecionadaRetorno.value = null
}

const handleConfirmarDevolucao = (numeroSenha: string, motivo: string) => {
  devolverSenhaComMotivo(numeroSenha, motivo)
  handleCloseReturnModal()
}

const handleEmitirNovaSenhaFromReturn = (tipo: string) => {
  emitirSenha(tipo as any, '')
  handleCloseReturnModal()
}
```

### 6. Adicionar Componente no Template (após TicketModal, linha ~227)

```vue
    <!-- Modal Ticket -->
    <TicketModal
      :show="showTicketModal"
      :numero-senha="numeroSenhaSelecionada"
      :estatisticas="estatisticas"
      :estado="estado"
      @close="handleCloseTicketModal"
      @chamar="handleChamarFromTicketModal"
      @editar="handleEditarFromTicketModal"
      @excluir="handleExcluirFromTicketModal"
      @retornar="handleRetornarFromTicketModal"
      @ausente="handleAusenteFromTicketModal"
    />

    <!-- Modal Devolver para Fila -->
    <ReturnToQueueModal
      :show="showReturnModal"
      :senha="senhaSelecionadaRetorno"
      @close="handleCloseReturnModal"
      @devolver="handleConfirmarDevolucao"
      @emitir-nova="handleEmitirNovaSenhaFromReturn"
    />

    <!-- Modal Histórico -->
    <Teleport to="body">
```

## Testando

Após as mudanças:

1. Restart do servidor: `cd v3/server && npm run dev`
2. Restart do cliente: `cd v3/client && npm run dev`
3. Emitir algumas senhas
4. Atender ou marcar como ausente
5. No Histórico, clicar "Devolver para Fila"
6. Testar cada um dos 4 cenários

## Cenários de Teste

### 1. Retorno após Impressão
- ✅ Sem limite de tempo
- ✅ Deve ir para primeira posição (alta prioridade)

### 2. Erro Operacional
- ✅ Sem limite de tempo
- ✅ Deve manter posição original aproximada

### 3. Cliente Ausente Retornou
- ✅ Bloqueado após 15 minutos
- ✅ Deve ir para terceira posição

### 4. Reabertura de Atendimento
- ✅ Bloqueado após 30 minutos
- ✅ Deve ir para terceira posição

## Validações

- [ ] Modal abre ao clicar "Devolver para Fila"
- [ ] Mostra número da senha corretamente
- [ ] Mostra tempo decorrido desde histórico
- [ ] Bloqueios aparecem quando tempo excedido
- [ ] Botão "Emitir Nova Senha" aparece quando bloqueado
- [ ] Senhas retornam para fila na posição correta
- [ ] Histórico de devoluções é registrado
