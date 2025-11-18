# SGFILA v3.0 - Estrutura e Implantação

Este documento descreve a estrutura essencial do projeto SGFILA v3.0 e como implantá-lo em outro ambiente.

## 📦 Estrutura de Arquivos Essenciais

### Arquivos Principais (Devem ser copiados)

```
v3/
├── .gitignore                          # Ignorar node_modules, dist, etc.
│
├── shared/                             # Tipos compartilhados
│   └── types.ts                        # ⭐ Interfaces TypeScript (Cliente + Servidor)
│
├── server/                             # Backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── StateManager.ts         # ⭐ Gerenciamento de estado e persistência
│   │   │   ├── StatisticsService.ts    # ⭐ Cálculo de estatísticas
│   │   │   └── QueueService.ts         # ⭐ Lógica de filas e senhas
│   │   ├── socket/
│   │   │   └── SocketHandlers.ts       # ⭐ Eventos Socket.IO
│   │   └── server.ts                   # ⭐ Entry point do servidor
│   ├── package.json                    # ⭐ Dependências do servidor
│   ├── tsconfig.json                   # Configuração TypeScript
│   ├── dev.bat                         # Script Windows para desenvolvimento
│   └── start-server.bat                # Script Windows para produção
│
├── client/                             # Frontend
│   ├── src/
│   │   ├── components/                 # Componentes Vue
│   │   │   ├── QueueList.vue           # ⭐ Lista de filas
│   │   │   ├── CurrentAttendanceList.vue # ⭐ Lista de atendimentos em andamento
│   │   │   ├── CounterPanel.vue        # ⭐ Painel de guichês
│   │   │   ├── StatisticsPanel.vue     # ⭐ Painel de estatísticas
│   │   │   ├── ConfigurationPanel.vue  # ⭐ Painel de configurações
│   │   │   ├── HistoryPanel.vue        # ⭐ Painel de histórico
│   │   │   ├── NewTicketModal.vue      # ⭐ Modal de nova senha
│   │   │   ├── TicketModal.vue         # ⭐ Modal de detalhes do ticket
│   │   │   ├── EditDescriptionModal.vue # ⭐ Modal de edição de descrição
│   │   │   ├── ConfirmActionModal.vue  # ⭐ Modal de confirmação
│   │   │   └── SystemResetModal.vue    # ⭐ Modal de reset do sistema
│   │   ├── composables/                # Lógica reutilizável
│   │   │   ├── useSocket.ts            # ⭐ Conexão Socket.IO e estado global
│   │   │   ├── useBeep.ts              # ⭐ Som de notificação
│   │   │   ├── useUtils.ts             # ⭐ Funções utilitárias
│   │   │   └── useRealtimeTimer.ts     # ⭐ Timers em tempo real
│   │   ├── styles/
│   │   │   └── main.css                # ⭐ CSS global
│   │   ├── App.vue                     # ⭐ Componente raiz
│   │   └── main.ts                     # ⭐ Entry point do cliente
│   ├── public/                         # Arquivos estáticos
│   │   ├── beep.mp3                    # Som de notificação (se houver)
│   │   └── favicon.ico                 # Ícone (se houver)
│   ├── index.html                      # ⭐ HTML principal
│   ├── package.json                    # ⭐ Dependências do cliente
│   ├── tsconfig.json                   # Configuração TypeScript
│   ├── tsconfig.node.json              # Configuração TypeScript para Vite
│   ├── vite.config.ts                  # ⭐ Configuração Vite
│   ├── dev.bat                         # Script Windows para desenvolvimento
│   ├── start-client.bat                # Script Windows para desenvolvimento
│   └── INSTALAR-CLIENT.bat             # Script Windows para instalação
│
├── README.md                           # ⭐ Documentação principal
├── ESTRUTURA-E-IMPLANTACAO.md          # ⭐ Este documento
├── QUICKSTART.md                       # Guia rápido
├── TROUBLESHOOTING.md                  # Solução de problemas
├── WINDOWS-FIX.md                      # Correções específicas Windows
├── WINDOWS-PORTABLE-NODE.md            # Node.js portável no Windows
├── INICIAR-WINDOWS.md                  # Instruções Windows
└── INSTALAR.bat                        # Script instalação Windows
```

### ⭐ = Arquivo essencial que deve sempre ser copiado

## 🚫 Arquivos que NÃO devem ser copiados

### Arquivos Gerados (podem ser regenerados)

```
# Dependências (reinstalar com npm install)
node_modules/                   # ❌ NUNCA copiar
server/node_modules/            # ❌ NUNCA copiar
client/node_modules/            # ❌ NUNCA copiar

# Builds (regenerar com npm run build)
server/dist/                    # ❌ Pode ser regenerado
client/dist/                    # ❌ Pode ser regenerado

# Dados em tempo de execução
server/dados.json               # ⚠️  Copiar apenas se quiser preservar dados
```

### Arquivos Obsoletos de v1 e v2 (na raiz do repositório)

```
# Arquivos da raiz que são obsoletos:
/index.html.backup              # ❌ v1/v2 - obsoleto
/server.js                      # ❌ v1/v2 - obsoleto
/server.js.backup               # ❌ v1/v2 - obsoleto
/package.json                   # ❌ v1/v2 - obsoleto (usar v3/server/ e v3/client/)
/package-lock.json              # ❌ v1/v2 - obsoleto
/node_modules/                  # ❌ v1/v2 - obsoleto
/public/                        # ❌ v1/v2 - obsoleto (usar v3/client/public/)
/server/                        # ❌ v1/v2 - obsoleto (usar v3/server/)
/npm.cmd                        # ❌ Atalho obsoleto
```

**⚠️ IMPORTANTE:** Esses arquivos na raiz do repositório eram da v1 e v2. A v3.0 completa está totalmente contida na pasta `v3/`.

## 📋 Pré-requisitos para Implantação

### Software Necessário

1. **Node.js 18 ou superior**
   - Baixar de: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **npm** (vem com Node.js)
   - Verificar instalação: `npm --version`

3. **Git** (opcional, mas recomendado)
   - Baixar de: https://git-scm.com/

### Conhecimentos Básicos

- Linha de comando (Terminal/CMD)
- Navegação em diretórios
- Execução de comandos npm

## 🚀 Guia de Implantação Passo a Passo

### Método 1: Clonar Repositório Git (Recomendado)

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd sgfila

# 2. Entrar na pasta v3
cd v3

# 3. Instalar dependências do servidor
cd server
npm install
cd ..

# 4. Instalar dependências do cliente
cd client
npm install
cd ..

# 5. Pronto! Veja seção "Executar o Sistema"
```

### Método 2: Copiar Arquivos Manualmente

```bash
# 1. Criar pasta de destino
mkdir sgfila-v3
cd sgfila-v3

# 2. Copiar APENAS a pasta v3/ do projeto original
#    (não copiar arquivos da raiz que são de v1/v2)
cp -r <origem>/v3/* .

# 3. Instalar dependências do servidor
cd server
npm install
cd ..

# 4. Instalar dependências do cliente
cd client
npm install
cd ..

# 5. Pronto! Veja seção "Executar o Sistema"
```

### Método 3: Usar Branch Limpo (v3-only)

Se você está usando o branch `v3-only` que contém apenas os arquivos essenciais:

```bash
# 1. Clonar apenas o branch v3-only
git clone -b v3-only <URL_DO_REPOSITORIO> sgfila-v3
cd sgfila-v3

# 2. Instalar dependências do servidor
cd server
npm install
cd ..

# 3. Instalar dependências do cliente
cd client
npm install
cd ..

# 4. Pronto! Veja seção "Executar o Sistema"
```

## ▶️ Executar o Sistema

### Modo Desenvolvimento (2 Terminais)

**Terminal 1 - Servidor:**
```bash
cd server
npm run dev
# Servidor roda em http://localhost:3000
# Deixar este terminal aberto
```

**Terminal 2 - Cliente:**
```bash
cd client
npm run dev
# Cliente roda em http://localhost:5173
# Deixar este terminal aberto
```

**Acessar:** Abrir navegador em http://localhost:5173

### Modo Produção (Build)

**1. Build do Cliente:**
```bash
cd client
npm run build
# Gera arquivos em client/dist/
```

**2. Build do Servidor:**
```bash
cd server
npm run build
# Gera arquivos em server/dist/
```

**3. Executar Produção:**
```bash
cd server
npm start
# Servidor serve cliente em http://localhost:3000
```

**Acessar:** Abrir navegador em http://localhost:3000

## 🪟 Implantação no Windows (Atalhos .bat)

Se você copiou os arquivos `.bat`, pode usar:

### Desenvolvimento

**Servidor:**
```cmd
v3\server\dev.bat
```

**Cliente:**
```cmd
v3\client\start-client.bat
```

### Instalação Automática

```cmd
v3\INSTALAR.bat
```

Este script instala todas as dependências automaticamente.

## 🔧 Configurações Importantes

### Porta do Servidor

Por padrão, o servidor roda na porta `3000`. Para mudar:

**Editar `v3/server/src/server.ts`:**
```typescript
const PORT = process.env.PORT || 3000; // Mudar 3000 para outra porta
```

### URL do Servidor no Cliente

Por padrão, o cliente conecta em `http://localhost:3000`. Para mudar:

**Editar `v3/client/src/composables/useSocket.ts`:**
```typescript
const socket = ref<Socket>(
  io('http://localhost:3000', { // Mudar URL aqui
    transports: ['websocket', 'polling']
  })
)
```

### Persistência de Dados

Os dados são salvos em `v3/server/dados.json`.

**Backup:**
```bash
cp v3/server/dados.json v3/server/dados.json.backup
```

**Restaurar:**
```bash
cp v3/server/dados.json.backup v3/server/dados.json
```

## 📊 Tamanho dos Arquivos

### Essenciais (código-fonte)
```
v3/shared/               ~10 KB
v3/server/src/           ~60 KB
v3/client/src/           ~200 KB
v3/*.md                  ~50 KB
Total:                   ~320 KB
```

### Após npm install (com node_modules)
```
v3/server/node_modules/  ~150 MB
v3/client/node_modules/  ~200 MB
Total:                   ~350 MB
```

### Build de Produção
```
v3/server/dist/          ~100 KB
v3/client/dist/          ~500 KB
Total:                   ~600 KB
```

## ✅ Checklist de Implantação

- [ ] Node.js 18+ instalado
- [ ] npm instalado
- [ ] Copiada apenas pasta `v3/` (não raiz com v1/v2)
- [ ] `cd v3/server && npm install` executado com sucesso
- [ ] `cd v3/client && npm install` executado com sucesso
- [ ] Servidor rodando em http://localhost:3000
- [ ] Cliente rodando em http://localhost:5173
- [ ] Interface abre sem erros
- [ ] Possível emitir senha de teste
- [ ] Possível chamar senha de teste
- [ ] Socket.IO conectado (indicador verde)

## 🐛 Problemas Comuns

### "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**
```bash
cd v3/server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"

**Causa:** Outra aplicação usa a porta 3000

**Solução:**
1. Matar processo na porta 3000, OU
2. Mudar porta no `server.ts` (ver seção Configurações)

### "Failed to fetch"

**Causa:** Servidor não está rodando

**Solução:**
1. Verificar se servidor está rodando
2. Verificar URL em `useSocket.ts`
3. Verificar firewall

### Build falha no Windows

**Causa:** Caminho muito longo ou permissões

**Solução:** Ver `WINDOWS-FIX.md` e `TROUBLESHOOTING.md`

## 📚 Documentação Adicional

- `README.md` - Documentação completa da arquitetura
- `QUICKSTART.md` - Guia rápido de início
- `TROUBLESHOOTING.md` - Solução de problemas
- `WINDOWS-FIX.md` - Correções específicas do Windows
- `WINDOWS-PORTABLE-NODE.md` - Node.js portável

## 🔐 Segurança

Para uso em produção:

1. **Mudar porta padrão** (3000 → outra)
2. **Adicionar autenticação** (se necessário)
3. **Configurar HTTPS** (se exposto na internet)
4. **Firewall** - Bloquear portas externas
5. **Backup regular** de `dados.json`

## 📞 Suporte

Para problemas ou dúvidas:

1. Verificar `TROUBLESHOOTING.md`
2. Verificar logs do servidor (terminal 1)
3. Verificar console do navegador (F12)
4. Verificar `dados.json` está sendo criado

## 📝 Notas de Versão

**Versão:** 3.0.0
**Data:** 2025-11-18
**Stack:** TypeScript + Vue 3 + Vite + Express + Socket.IO
**Compatibilidade:** Node.js 18+

---

## 🎯 Resumo Rápido

**Para implantar SGFILA v3.0:**

1. Copiar pasta `v3/` (não a raiz!)
2. `cd v3/server && npm install`
3. `cd v3/client && npm install`
4. Terminal 1: `cd v3/server && npm run dev`
5. Terminal 2: `cd v3/client && npm run dev`
6. Acessar: http://localhost:5173

**Arquivos essenciais:** ~320 KB (código-fonte)
**Com node_modules:** ~350 MB
**Build produção:** ~600 KB

✅ **Sem v1/v2, sem node_modules, pronto para deploy!**
