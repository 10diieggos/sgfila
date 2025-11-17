# Guia de Troubleshooting - SGFILA v3.0

## 🐛 Problema: npm run dev fecha imediatamente no Windows

### Diagnóstico

O PowerShell fecha porque houve um erro. Vamos descobrir qual:

### 1. Ver o Erro Real

**No PowerShell, rode:**

```powershell
# Server
cd v3\server
npm run dev 2>&1 | Out-File -FilePath error.log
notepad error.log
```

```powershell
# Client
cd v3\client
npm run dev 2>&1 | Out-File -FilePath error.log
notepad error.log
```

Isso vai salvar o erro em um arquivo para você ler.

---

### 2. Problemas Comuns e Soluções

#### Problema A: "Cannot find module"

**Causa:** Dependências não instaladas corretamente

**Solução:**
```powershell
# Limpar e reinstalar
cd v3\server
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

cd ..\client
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### Problema B: "SyntaxError" ou "Unexpected token"

**Causa:** Código TypeScript com erro de sintaxe

**Solução:** Verificar erros de compilação
```powershell
cd v3\server
npm run type-check

cd ..\client
npm run type-check
```

#### Problema C: "Cannot use import statement outside a module"

**Causa:** Configuração de módulos ES incorreta

**Solução:** Já está configurado em package.json, mas verificar node version
```powershell
node --version
# Deve ser 18+
```

#### Problema D: "EADDRINUSE: address already in use"

**Causa:** Porta 3000 ou 5173 já está em uso

**Solução:**
```powershell
# Encontrar processos usando as portas
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID <numero> /F
```

---

### 3. Teste Simplificado

Vamos testar apenas o Node.js sem TypeScript:

**Criar arquivo de teste `v3/server/test.js`:**
```javascript
console.log('Node funcionando!')
console.log('Versão:', process.version)
```

**Rodar:**
```powershell
cd v3\server
node test.js
```

Se isso funcionar, o Node está OK. Problema está no TypeScript/TSX.

---

### 4. Verificar Instalação

```powershell
cd v3\server
npm list tsx
npm list typescript

cd ..\client
npm list vite
npm list vue
```

Todos devem mostrar as versões instaladas.

---

### 5. Executar Manualmente

**Server:**
```powershell
cd v3\server
npx tsx src/server.ts
```

**Client:**
```powershell
cd v3\client
npx vite
```

---

### 6. Modo Verboso

```powershell
# Server - modo debug
cd v3\server
set DEBUG=* && npm run dev

# Client - modo debug
cd v3\client
npm run dev -- --debug
```

---

### 7. Verificar PATH

Às vezes o problema é o PATH do Node:

```powershell
where.exe node
where.exe npm
```

Deve mostrar o caminho do Node portátil que você usa.

---

## 🔧 Solução Alternativa: Rodar sem Build Tools

Se nada funcionar, podemos usar a v2 (jQuery) que já está funcionando, ou criar uma versão simplificada da v3 sem precisar de `npm run dev`.

---

## 📞 Me envie o erro!

Por favor, rode isso e me envie o resultado:

```powershell
cd v3\server
npm run dev > error.txt 2>&1
type error.txt
```

Com o erro real, posso corrigir especificamente o problema!
