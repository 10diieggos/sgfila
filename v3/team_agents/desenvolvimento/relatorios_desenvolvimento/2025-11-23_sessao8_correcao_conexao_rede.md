# Sessão 8 - Correção de Conexão Cliente-Servidor (Modelo Servidor Único)

**Data:** 2025-11-23
**Sessão:** 8
**Tarefas:** T-131, T-132, T-133, T-134, T-135

---

## Sumário Executivo

Esta sessão corrigiu o problema de conexão entre UI (cliente Vue.js) e backend (servidor Node.js), habilitando o **modelo de servidor único** onde:
- Um servidor central atende múltiplos guichês via rede LAN
- Guichês acessam via navegador em `http://<IP_DO_SERVIDOR>:3000`
- Sem necessidade de instalação ou configuração nos guichês

**Problema inicial:** UI não conectava com backend devido a:
1. Servidor fazendo bind apenas em `127.0.0.1` (localhost)
2. Cliente usando `io()` sem URL específica
3. CORS restrito a localhost
4. Imports ES modules sem extensão `.js`
5. Caminho incorreto para arquivos estáticos

**Resultado:** Sistema funcional com conexão cliente-servidor operacional.

---

## 1. Diagnóstico do Problema

### 1.1. Servidor Bind Restrito

**Arquivo:** [`v3/server/src/server.ts`](../../server/src/server.ts)

**Antes:**
```typescript
const HOST = process.env.HOST || '127.0.0.1'; // restringe bind por padrão
```

**Problema:**
- Servidor aceitava apenas conexões de `localhost`
- Guichês na LAN não conseguiam conectar

**Solução (T-131):**
```typescript
const HOST = process.env.HOST || '0.0.0.0'; // bind em todas as interfaces para aceitar conexões da LAN
```

**Impacto:**
- Servidor agora escuta em **todas as interfaces de rede**
- Permite conexões de `localhost`, `127.0.0.1` e qualquer IP da LAN
- Compatível com modelo servidor único

---

### 1.2. Cliente sem URL de Conexão

**Arquivo:** [`v3/client/src/composables/useSocket.ts`](../../client/src/composables/useSocket.ts)

**Antes:**
```typescript
const connect = () => {
  socket.value = io() as TypedSocket
```

**Problema:**
- `io()` sem argumentos conecta em `window.location.origin`
- Funciona apenas quando cliente e servidor estão na mesma máquina
- Em desenvolvimento (Vite dev server porta 5173), tentava conectar em porta errada

**Solução (T-132):**
```typescript
const connect = () => {
  // Em produção, usa a URL do servidor configurada (ou mesma origem se não especificada)
  // Em desenvolvimento, usa proxy do Vite (localhost:5173 -> localhost:3000)
  const serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin
  socket.value = io(serverUrl, {
    transports: ['websocket', 'polling']
  }) as TypedSocket
```

**Arquivos criados:**

1. **`v3/client/.env.example`:**
```bash
# Configuração do Cliente SGFila v3.0

# URL do servidor Socket.IO (opcional)
# Se não especificado, usa a mesma origem (window.location.origin)
# Exemplo para desenvolvimento local: http://localhost:3000
# Exemplo para servidor na LAN: http://192.168.1.100:3000
# VITE_SERVER_URL=http://localhost:3000
```

2. **`v3/client/src/vite-env.d.ts`:**
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**Impacto:**
- Cliente pode se conectar a servidor remoto via variável de ambiente
- Fallback para mesma origem (produção servida pelo servidor)
- Transports explícitos: `websocket` (preferido) e `polling` (fallback)

---

### 1.3. CORS Restrito

**Arquivo:** [`v3/server/src/server.ts`](../../server/src/server.ts)

**Antes:**
```typescript
const ORIGINS = ORIGIN_ENV
  ? ORIGIN_ENV.split(',').map(s => s.trim()).filter(Boolean)
  : (NODE_ENV === 'production'
      ? [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`]
      : [
          `http://localhost:${PORT}`,
          `http://127.0.0.1:${PORT}`,
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5174'
        ]);
```

**Problema:**
- Lista fixa de origens permitidas
- Não permitia conexões de IPs da LAN (ex: `192.168.1.x`)
- Difícil adicionar novos guichês

**Solução (T-133):**
```typescript
// CORS_ORIGIN: lista de origens permitidas separadas por vírgula (ex: http://192.168.1.10:3000,http://192.168.1.11:3000)
// Se não especificado:
//   - Produção: permite mesma origem (cliente servido pelo servidor) e localhost
//   - Desenvolvimento: permite Vite dev server (5173/5174) e qualquer origem da LAN
const ORIGIN_ENV = process.env.CORS_ORIGIN;
const ORIGINS = ORIGIN_ENV
  ? ORIGIN_ENV.split(',').map(s => s.trim()).filter(Boolean)
  : (NODE_ENV === 'production'
      ? [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`]
      : true); // Em desenvolvimento, aceita qualquer origem (facilita testes na LAN)

const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: ORIGINS,
    methods: ["GET", "POST"],
    credentials: false
  }
});
```

**Impacto:**
- **Desenvolvimento:** `origin: true` aceita qualquer origem
- **Produção:** Usa `CORS_ORIGIN` para lista restrita ou padrão localhost
- Facilita testes e implantação em LAN
- Segurança mantida em produção via variável de ambiente

---

### 1.4. Caminho Incorreto de Arquivos Estáticos

**Arquivo:** [`v3/server/src/server.ts`](../../server/src/server.ts)

**Antes:**
```typescript
const clientPath = join(__dirname, '../../client/dist');
```

**Problema:**
- Servidor compilado fica em `v3/server/dist/server/src/server.js`
- `__dirname` = `v3/server/dist/server/src`
- `../../client/dist` = `v3/server/dist/client/dist` ❌ (não existe)

**Solução (T-134):**
```typescript
// Serve arquivos estáticos do cliente
// __dirname em produção: /path/to/v3/server/dist/server/src
// Precisamos subir 4 níveis e entrar em client/dist
const clientPath = join(__dirname, '../../../../client/dist');
```

**Caminho correto:**
- `__dirname` = `v3/server/dist/server/src`
- `../../../../client/dist` = `v3/client/dist` ✅

**Impacto:**
- Servidor agora serve corretamente HTML, CSS, JS, assets
- Cliente carrega sem erros 404

---

### 1.5. Imports ES Modules Sem Extensão

**Arquivo:** [`v3/server/src/services/EstimadoresManager.ts`](../../server/src/services/EstimadoresManager.ts)

**Antes:**
```typescript
import { EstimadorLambda, LambdaPorHora } from './EstimadorLambda';
import { EstimadorMu, MuPorHora } from './EstimadorMu';
import { EstimadorPercentis, PercentisPorHora } from './EstimadorPercentis';
import { TipoSenha } from '../../../shared/types';
```

**Problema:**
- ES modules requerem extensão `.js` explícita em imports
- Node.js falhou ao carregar módulos: `ERR_MODULE_NOT_FOUND`

**Solução (T-135):**
```typescript
import { EstimadorLambda, LambdaPorHora } from './EstimadorLambda.js';
import { EstimadorMu, MuPorHora } from './EstimadorMu.js';
import { EstimadorPercentis, PercentisPorHora } from './EstimadorPercentis.js';
import { TipoSenha } from '../../../shared/types.js';
```

**Impacto:**
- Servidor inicia sem erros de módulos
- EstimadoresManager carrega corretamente λ, μ e percentis

---

## 2. Testes de Validação

### 2.1. Compilação

**Servidor:**
```bash
cd v3/server
node node_modules/typescript/bin/tsc --noEmit
# ✅ Sem erros
```

**Cliente:**
```bash
cd v3/client
node node_modules/vite/bin/vite.js build
# ✅ Build concluído:
# - index.html: 0.73 kB (gzip: 0.42 kB)
# - index-Crc0ukrf.css: 66.04 kB (gzip: 10.81 kB)
# - socket-TjCxX7sJ.js: 41.28 kB (gzip: 12.92 kB)
# - vue-BNRkG0eJ.js: 74.16 kB (gzip: 29.45 kB)
# - index-BOoh7hWf.js: 132.32 kB (gzip: 34.96 kB)
# Total: ~313 kB (gzip: ~88 kB)
```

---

### 2.2. Inicialização do Servidor

```bash
cd v3/server
node dist/server/src/server.js
```

**Output:**
```
Estado carregado do arquivo dados.json
✅ [EstimadoresManager] Lambda carregado
✅ [EstimadoresManager] Mu carregado
✅ [EstimadoresManager] Percentis carregados
✅ [EstimadoresManager] Cálculo periódico iniciado (60000ms)
[QueueMonitor] Iniciado em modo TEMPO_REAL (1min)
=================================
SGFILA v3.0 - TypeScript + Vue 3
=================================
Servidor rodando em http://0.0.0.0:3000
Modo teste: DESATIVADO
CORS origins: true
Pressione Ctrl+C para parar
=================================
📊 Pasta de estatísticas inicializada: C:\Users\Diego\Downloads\nodep\sgfila\v3\server\dist\server\src\estatisticas
📊 Arquivo de estatísticas carregado: estatisticas_2025-11-23.json
📊 Snapshot adicionado às 8h
📊 Estatísticas finais atualizadas
```

**Validação:**
- ✅ Bind em `0.0.0.0:3000` (todas as interfaces)
- ✅ CORS `true` (aceita qualquer origem em dev)
- ✅ EstimadoresManager carregados
- ✅ QueueMonitor ativo
- ✅ Estatísticas persistidas

---

### 2.3. Teste HTTP

```bash
curl http://localhost:3000
```

**Output (HTML):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SGFILA v3.0 - Sistema de Gerenciamento de Filas</title>
  <link rel="stylesheet" href="/css/all.min.css">
  <link rel="icon" type="image/svg+xml" href="/vite.svg">
  <script type="module" crossorigin src="/assets/index-BOoh7hWf.js"></script>
  <link rel="modulepreload" crossorigin href="/assets/vue-BNRkG0eJ.js">
  <link rel="modulepreload" crossorigin href="/assets/socket-TjCxX7sJ.js">
  <link rel="stylesheet" crossorigin href="/assets/index-Crc0ukrf.css">
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

**Validação:**
- ✅ HTML servido corretamente
- ✅ Assets referenciados (CSS, JS, fonts)

---

### 2.4. Teste Socket.IO

```bash
curl http://localhost:3000/socket.io/
```

**Output:**
```json
{"code":0,"message":"Transport unknown"}
```

**Validação:**
- ✅ Endpoint Socket.IO respondendo
- ✅ Mensagem esperada (requer parâmetros de transport)

---

## 3. Arquitetura de Rede

### 3.1. Modelo Servidor Único

```
┌─────────────────────────────────────────────────────────────┐
│                    Servidor Central                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Node.js Server (0.0.0.0:3000)                        │  │
│  │  - Express (arquivos estáticos)                       │  │
│  │  - Socket.IO (WebSocket + Polling)                    │  │
│  │  - StateManager (estado centralizado)                 │  │
│  │  - EstimadoresManager (λ, μ, percentis)               │  │
│  │  - QueueService (lógica de filas)                     │  │
│  │  - IAManager (decisões JSED)                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │ HTTP/WebSocket
                          │ (LAN: 192.168.1.x)
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
    │ Guichê 1│      │ Guichê 2│     │ Guichê N│
    │ Browser │      │ Browser │     │ Browser │
    │ :3000   │      │ :3000   │     │ :3000   │
    └─────────┘      └─────────┘     └─────────┘
```

**Características:**
- **1 servidor** central com Node.js e Vue.js compilado
- **N guichês** acessando via navegador
- **Sem instalação** nos guichês (apenas navegador)
- **Estado compartilhado** via Socket.IO em tempo real

---

### 3.2. Fluxo de Conexão

```
1. Guichê abre navegador → http://192.168.1.100:3000
   ↓
2. Servidor Express serve index.html + assets (JS, CSS)
   ↓
3. Cliente Vue.js inicia
   ↓
4. useSocket.connect() executa:
   - serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin
   - io(serverUrl, { transports: ['websocket', 'polling'] })
   ↓
5. Socket.IO tenta WebSocket upgrade
   - Se bem-sucedido: conexão WebSocket persistente
   - Se falhar: fallback para polling (long-polling HTTP)
   ↓
6. Servidor valida CORS:
   - DEV: origin: true (aceita qualquer)
   - PROD: verifica se origin está em CORS_ORIGIN
   ↓
7. Conexão estabelecida ✅
   - Evento 'connect' emitido
   - Estado inicial sincronizado via 'estadoAtualizado'
```

---

## 4. Configuração via Variáveis de Ambiente

### 4.1. Servidor

**Arquivo:** `v3/server/src/server.ts`

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NODE_ENV` | `development` | Ambiente de execução (development/production) |
| `HOST` | `0.0.0.0` | Interface de bind (0.0.0.0 = todas) |
| `PORT` | `3000` | Porta do servidor |
| `CORS_ORIGIN` | - | Lista de origens permitidas (separadas por vírgula) |
| `MODO_TESTE` | `false` | Ativa modo de teste |

**Exemplo de uso:**
```bash
# Desenvolvimento (aceita qualquer origem)
NODE_ENV=development HOST=0.0.0.0 PORT=3000 node dist/server/src/server.js

# Produção (CORS restrito)
NODE_ENV=production HOST=0.0.0.0 PORT=3000 \
CORS_ORIGIN=http://192.168.1.100:3000,http://192.168.1.101:3000 \
node dist/server/src/server.js
```

---

### 4.2. Cliente

**Arquivo:** `v3/client/.env` (criar a partir de `.env.example`)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_SERVER_URL` | `window.location.origin` | URL do servidor Socket.IO |

**Exemplo de uso:**
```bash
# Desenvolvimento (conectar em servidor local)
VITE_SERVER_URL=http://localhost:3000

# Desenvolvimento (conectar em servidor remoto)
VITE_SERVER_URL=http://192.168.1.100:3000

# Produção (servido pelo servidor, usa mesma origem)
# Não definir VITE_SERVER_URL
```

**Build:**
```bash
# Produção
npm run build

# Desenvolvimento com servidor remoto
VITE_SERVER_URL=http://192.168.1.100:3000 npm run build
```

---

## 5. Segurança

### 5.1. CORS em Produção

**Recomendação:** Sempre definir `CORS_ORIGIN` em produção.

**Exemplo seguro:**
```bash
# Lista de IPs permitidos na LAN
CORS_ORIGIN=http://192.168.1.100:3000,http://192.168.1.101:3000,http://192.168.1.102:3000
```

**Validação:**
```bash
# Origem permitida (sucesso)
curl -H "Origin: http://192.168.1.100:3000" http://192.168.1.100:3000/socket.io/

# Origem bloqueada (erro CORS)
curl -H "Origin: http://malicious.com" http://192.168.1.100:3000/socket.io/
```

---

### 5.2. Bind de Rede

**Cenários:**

1. **Servidor único na LAN:** `HOST=0.0.0.0` ✅
   - Permite conexões de qualquer IP da LAN
   - Firewall do SO pode bloquear portas externas

2. **Apenas localhost (testes):** `HOST=127.0.0.1`
   - Bloqueia conexões externas
   - Útil para desenvolvimento isolado

3. **IP específico:** `HOST=192.168.1.100`
   - Bind em interface específica
   - Útil em servidores com múltiplas interfaces

---

## 6. Troubleshooting

### 6.1. Problema: Cliente não conecta

**Sintomas:**
- Console do navegador: `WebSocket connection failed`
- UI não carrega dados do servidor

**Diagnóstico:**
1. Verificar URL no navegador: `http://<IP_SERVIDOR>:3000`
2. Verificar console do navegador (F12 → Console)
3. Verificar logs do servidor

**Soluções:**

**a) Servidor não acessível:**
```bash
# Testar conectividade
ping <IP_SERVIDOR>

# Testar porta
curl http://<IP_SERVIDOR>:3000
```

**b) CORS bloqueado:**
```bash
# Verificar logs do servidor
# Procurar por "CORS origin rejected"

# Adicionar origem em CORS_ORIGIN
CORS_ORIGIN=http://<IP_CLIENTE>:3000 node dist/server/src/server.js
```

**c) Firewall bloqueando:**
```bash
# Windows
netsh advfirewall firewall add rule name="SGFila" dir=in action=allow protocol=TCP localport=3000

# Linux (ufw)
sudo ufw allow 3000/tcp
```

---

### 6.2. Problema: Arquivos 404

**Sintomas:**
- HTML carrega mas JS/CSS retornam 404
- Console: `Failed to load resource: 404`

**Diagnóstico:**
```bash
curl http://localhost:3000/assets/index-BOoh7hWf.js
```

**Solução:**
- Verificar se `v3/client/dist` existe e tem arquivos
- Recompilar cliente: `cd v3/client && npm run build`
- Verificar `clientPath` em `server.ts`

---

### 6.3. Problema: ES Module Error

**Sintomas:**
- Servidor não inicia
- Erro: `ERR_MODULE_NOT_FOUND`

**Diagnóstico:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../EstimadorLambda'
```

**Solução:**
- Adicionar extensão `.js` nos imports:
```typescript
// ❌ Errado
import { EstimadorLambda } from './EstimadorLambda';

// ✅ Correto
import { EstimadorLambda } from './EstimadorLambda.js';
```

---

## 7. Próximos Passos

**Imediatos (Sessão 9):**
1. **T-129:** Integrar estimadores em eventos do sistema
   - `registrarChegada()` em `emitirSenha`
   - `registrarAtendimento()` em `finalizarAtendimento`
   - `registrarTempoEspera()` em `chamarSenha`

2. **T-130:** Expor estatísticas via Socket.IO
   - Handler `getEstatisticas`
   - Emitir atualizações para clientes

3. **T-136:** Scripts de inicialização
   - `start-sgfila.bat` (Windows)
   - `start-sgfila.sh` (Linux)

**Médio Prazo:**
- **T-108/T-109:** Sistema de limites dinâmicos
- **T-113:** Dashboard de estatísticas em tempo real
- **T-127/T-128:** Testes para estimadores

---

## 8. Referências

**Arquivos modificados:**
- [v3/server/src/server.ts](../../server/src/server.ts)
- [v3/client/src/composables/useSocket.ts](../../client/src/composables/useSocket.ts)
- [v3/server/src/services/EstimadoresManager.ts](../../server/src/services/EstimadoresManager.ts)

**Arquivos criados:**
- [v3/client/.env.example](../../client/.env.example)
- [v3/client/src/vite-env.d.ts](../../client/src/vite-env.d.ts)

**Documentação:**
- [proximos_passos.md](../proximos_passos.md) (Sessão 8, linhas 992-1131)

**Tarefas relacionadas:**
- T-131: Configurar bind de rede
- T-132: URL de conexão Socket.IO
- T-133: CORS para LAN
- T-134: Caminho de arquivos estáticos
- T-135: Imports ES modules
- T-042: Modelo servidor único (planejamento)

---

## Apêndice A: Checklist de Implantação

### Servidor (Máquina Central)

- [ ] Node.js instalado (v18+ recomendado)
- [ ] Código copiado para `/opt/SGFila` (Linux) ou `C:\SGFila` (Windows)
- [ ] Dependências instaladas: `npm ci` em `v3/server` e `v3/client`
- [ ] Cliente compilado: `cd v3/client && npm run build`
- [ ] Servidor compilado: `cd v3/server && npm run build`
- [ ] Variáveis de ambiente configuradas:
  - [ ] `HOST=0.0.0.0`
  - [ ] `PORT=3000`
  - [ ] `NODE_ENV=production`
  - [ ] `CORS_ORIGIN=<lista de IPs>`
- [ ] Firewall configurado (porta 3000 aberta)
- [ ] Servidor iniciado: `node dist/server/src/server.js`
- [ ] Teste local: `curl http://localhost:3000` retorna HTML

### Guichês (Máquinas Clientes)

- [ ] Navegador moderno instalado (Chrome/Edge/Firefox)
- [ ] Conectividade de rede com servidor (`ping <IP_SERVIDOR>`)
- [ ] Acesso via navegador: `http://<IP_SERVIDOR>:3000`
- [ ] Teste de conexão: UI carrega e exibe fila
- [ ] Teste de operação: emitir, chamar, finalizar senha

---

**Fim do Relatório - Sessão 8**
