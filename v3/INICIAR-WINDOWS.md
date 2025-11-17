# Como Iniciar SGFILA v3.0 no Windows (Node Portátil)

## 🚀 MÉTODO 1: Duplo-clique nos arquivos .bat (MAIS FÁCIL)

### 1. Abra o Windows Explorer

### 2. Navegue até as pastas e dê **duplo-clique**:

**Para o Servidor:**
```
C:\Users\Diego\Downloads\nodep\sgfila\v3\server\start-server.bat
```
👆 Duplo-clique neste arquivo

**Para o Cliente (abra outra janela):**
```
C:\Users\Diego\Downloads\nodep\sgfila\v3\client\start-client.bat
```
👆 Duplo-clique neste arquivo

### 3. Duas janelas vão abrir

**Janela 1 (Servidor) deve mostrar:**
```
====================================
SGFILA v3.0 - Server
====================================

Iniciando servidor TypeScript...

=================================
SGFILA v3.0 - TypeScript + Vue 3
=================================
Servidor rodando em http://localhost:3000
```

**Janela 2 (Cliente) deve mostrar:**
```
====================================
SGFILA v3.0 - Client
====================================

Iniciando Vite dev server...

VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
```

### 4. Abra o navegador em: http://localhost:5173

---

## 🚀 MÉTODO 2: Via PowerShell (alternativo)

### Terminal 1 - Servidor:
```powershell
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\server
C:\Users\Diego\Downloads\nodep\node node_modules/tsx/dist/cli.mjs watch src/server.ts
```

### Terminal 2 - Cliente:
```powershell
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\client
C:\Users\Diego\Downloads\nodep\node node_modules/vite/bin/vite.js
```

---

## 🚀 MÉTODO 3: npm run dev

Se você adicionou o Node ao PATH:

```powershell
# Servidor
cd v3\server
C:\Users\Diego\Downloads\nodep\npm run dev

# Cliente
cd v3\client
C:\Users\Diego\Downloads\nodep\npm run dev
```

---

## ❌ Solução de Problemas

### "O sistema não pode encontrar o caminho especificado"

**Causa:** node_modules não instalado

**Solução:**
```powershell
# Instalar dependências do servidor
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\server
C:\Users\Diego\Downloads\nodep\npm install

# Instalar dependências do cliente
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\client
C:\Users\Diego\Downloads\nodep\npm install
```

### "EADDRINUSE: address already in use"

**Causa:** Porta já está em uso

**Solução:**
```powershell
# Matar processos nas portas
netstat -ano | findstr :3000
netstat -ano | findstr :5173
# Depois: taskkill /PID <numero> /F
```

### Verificar se está funcionando:

```powershell
# 1. Verificar Node
C:\Users\Diego\Downloads\nodep\node -v
# Deve mostrar: v24.11.1

# 2. Verificar se node_modules existe
dir C:\Users\Diego\Downloads\nodep\sgfila\v3\server\node_modules
dir C:\Users\Diego\Downloads\nodep\sgfila\v3\client\node_modules
# Deve listar várias pastas
```

---

## ✅ Checklist

- [ ] Rodou `npm install` no server
- [ ] Rodou `npm install` no client
- [ ] Deu duplo-clique em `start-server.bat`
- [ ] Deu duplo-clique em `start-client.bat`
- [ ] Abriu http://localhost:5173 no navegador
- [ ] Sistema funcionando! 🎉

---

## 📝 Arquivos .bat criados:

1. **start-server.bat** - Usa caminho completo do node portátil
2. **start-client.bat** - Usa caminho completo do node portátil
3. **dev.bat** - Usa `node` genérico (precisa estar no PATH)

**Use os `start-*.bat` para máxima compatibilidade!**

---

## 🎯 Resumo Rápido

1. Duplo-clique em `v3\server\start-server.bat`
2. Duplo-clique em `v3\client\start-client.bat`
3. Abra http://localhost:5173
4. Pronto! ✨
