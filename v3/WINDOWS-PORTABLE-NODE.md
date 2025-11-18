# SGFILA v3.0 - Iniciar no Windows (Node.js Portátil)

## ✅ Solução para Node.js Portátil sem npx

### Opção 1: Usar os arquivos .bat (MAIS FÁCIL)

**Terminal 1 - Servidor:**
```cmd
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\server
dev.bat
```

**Terminal 2 - Cliente:**
```cmd
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\client
dev.bat
```

---

### Opção 2: Usar npm run dev (funciona agora)

**Terminal 1 - Servidor:**
```cmd
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\server
C:\Users\Diego\Downloads\nodep\npm run dev
```

**Terminal 2 - Cliente:**
```cmd
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\client
C:\Users\Diego\Downloads\nodep\npm run dev
```

---

### Opção 3: Rodar direto com node

**Terminal 1 - Servidor:**
```cmd
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\server
C:\Users\Diego\Downloads\nodep\node node_modules\tsx\dist\cli.mjs watch src\server.ts
```

**Terminal 2 - Cliente:**
```cmd
cd C:\Users\Diego\Downloads\nodep\sgfila\v3\client
C:\Users\Diego\Downloads\nodep\node node_modules\vite\bin\vite.js
```

---

## 🎯 O Mais Simples: Use os .bat

Basta dar **duplo clique** em:
- `v3/server/dev.bat`
- `v3/client/dev.bat`

Ou rodar via PowerShell:
```powershell
.\dev.bat
```

---

## 🚀 Após Iniciar

**Servidor deve mostrar:**
```
=================================
SGFILA v3.0 - TypeScript + Vue 3
=================================
Servidor rodando em http://localhost:3000
Pressione Ctrl+C para parar
=================================
```

**Cliente deve mostrar:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Acesse:** http://localhost:5173

---

## ❓ Se ainda der erro

Verifique se você rodou `npm install` nas duas pastas:

```cmd
cd v3\server
C:\Users\Diego\Downloads\nodep\npm install

cd ..\client
C:\Users\Diego\Downloads\nodep\npm install
```

---

## 💡 Explicação

Seu Node.js portátil não tem `npx` no PATH, então:
- Os scripts agora chamam `node` diretamente
- Os arquivos `.bat` facilitam ainda mais
- Tudo funciona sem configurar PATH do Windows

---

**Dica:** Se preferir, pode adicionar o Node portátil ao PATH do Windows permanentemente, mas não é necessário com os `.bat` files!
