# Fix para Windows - SGFILA v3.0

## 🔧 Solução Rápida para PowerShell

O problema mais comum no Windows é que os erros não aparecem porque o PowerShell fecha rápido.

### Passo 1: Ver o Erro Real

**Abra PowerShell na pasta v3/server e rode:**

```powershell
npm run dev
```

**Se fechar rápido, rode isso:**

```powershell
npm run dev; Read-Host "Pressione Enter para fechar"
```

Isso vai manter a janela aberta e você vai ver o erro.

---

### Passo 2: Testando Individualmente

#### Testar Node.js

```powershell
node --version
```

Deve mostrar v18 ou superior.

#### Testar NPM

```powershell
npm --version
```

#### Verificar instalação das dependências

```powershell
cd v3\server
dir node_modules
```

Deve mostrar várias pastas (express, socket.io, tsx, etc.)

---

### Passo 3: Rodar com Mais Informações

```powershell
cd v3\server
npx tsx src/server.ts
```

Isso vai rodar diretamente e mostrar qualquer erro.

---

## 🎯 Solução Alternativa: Usar Node.js Direto

Se o TSX não funcionar, podemos compilar primeiro e depois rodar:

### Server:

```powershell
cd v3\server

# Compilar TypeScript para JavaScript
npx tsc

# Rodar o JavaScript compilado
node dist/server.js
```

### Client:

```powershell
cd v3\client

# Rodar Vite diretamente
npx vite
```

---

## 📋 Checklist de Diagnóstico

Rode esses comandos e me diga qual falha:

```powershell
# 1. Node instalado?
node --version

# 2. Na pasta certa?
cd v3\server
pwd

# 3. Dependências instaladas?
dir node_modules\tsx

# 4. TSX funciona?
npx tsx --version

# 5. Arquivo existe?
dir src\server.ts

# 6. Tentar rodar
npx tsx src/server.ts
```

---

## 🚨 Se NADA Funcionar

Use a **v2.0** que já está funcionando:

```powershell
cd ..\..\  # Voltar para raiz
node server.js
```

A v2.0 funciona sem build tools e vai rodar imediatamente!

---

## 💡 Dica

O erro mais comum é:
- **"Cannot find module '../shared/types.js'"** - Problema com imports

Se for esse, me avise que vou corrigir os imports!

---

## 📞 Me envie isso

Rode e me mande o resultado:

```powershell
cd v3\server
Write-Output "=== Node Version ===" > debug.txt
node --version >> debug.txt
Write-Output "`n=== NPM Version ===" >> debug.txt
npm --version >> debug.txt
Write-Output "`n=== TSX Installed? ===" >> debug.txt
npm list tsx >> debug.txt
Write-Output "`n=== Running Server ===" >> debug.txt
npx tsx src/server.ts 2>> debug.txt
type debug.txt
```

Com essas informações posso corrigir exatamente!
