# SGFILA v3.0 - Guia de Inicialização Rápida

## ⚡ Começar Imediatamente

### 1. Instalar Dependências (uma vez)

```bash
# Na raiz do projeto v3/
cd server && npm install
cd ../client && npm install
```

### 2. Rodar em Desenvolvimento

**Abra 2 terminais:**

**Terminal 1 - Servidor:**
```bash
cd v3/server
npm run dev
```
✅ Servidor roda em http://localhost:3000

**Terminal 2 - Cliente:**
```bash
cd v3/client
npm run dev
```
✅ Cliente roda em http://localhost:5173

### 3. Acessar

Abra http://localhost:5173 no navegador

---

## 🎯 Primeira Modificação

### Exemplo: Mudar cor do botão "Prioritária"

1. Abra `v3/client/src/App.vue`

2. Encontre:
```css
.btn-priority {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

3. Mude para:
```css
.btn-priority {
  background: linear-gradient(135deg, #ff0000 0%, #990000 100%);
}
```

4. Salve (Ctrl+S)

5. Navegador atualiza automaticamente! ✨

---

## 📦 Build para Produção

```bash
# Cliente
cd v3/client
npm run build
# Arquivos em v3/client/dist/

# Servidor
cd v3/server
npm run build
npm start
```

---

## 🐛 Problemas Comuns

### "Cannot find module"
```bash
# Reinstalar dependências
cd v3/server && rm -rf node_modules && npm install
cd ../client && rm -rf node_modules && npm install
```

### "Port 3000 already in use"
```bash
# Matar processo na porta 3000
npx kill-port 3000
```

### TypeScript Errors
```bash
# Verificar tipos
cd v3/server && npm run type-check
cd v3/client && npm run type-check
```

---

## 📝 Próximos Passos

1. ✅ Sistema rodando
2. 📖 Ler `v3/README.md` completo
3. 🎨 Criar componentes faltantes (ver seção TODO no README)
4. 🧪 Testar todas as funcionalidades

---

**Tempo estimado para setup**: 5 minutos
**Requer internet**: Somente para `npm install` inicial
