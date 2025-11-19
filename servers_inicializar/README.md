# Scripts de Inicialização SGFILA

Pasta contendo scripts robustos para inicializar e gerenciar os servidores do SGFILA.

## 📁 Arquivos

### `iniciar-sgfila.bat`
Script principal para iniciar os servidores backend e frontend com configuração persistente.

**Características:**
- ✅ Configuração persistente em `config.ini`
- ✅ Menu interativo para configurar caminho do Node.js
- ✅ Validação de dependências
- ✅ Verificação de portas em uso
- ✅ Logs detalhados em `logs/`
- ✅ Tratamento robusto de erros
- ✅ Ordem correta de inicialização (backend → frontend)

### `parar-sgfila.bat`
Script auxiliar para parar todos os servidores em execução.

### `config.ini`
Arquivo de configuração (criado automaticamente no primeiro uso).

## 🚀 Como Usar

### Primeira Execução

1. Execute `iniciar-sgfila.bat`
2. O script criará automaticamente `config.ini` com valores padrão
3. Escolha uma das opções do menu:
   - **[P]** Usar caminho padrão
   - **[A]** Usar caminho alternativo (temporário)
   - **[C]** Configurar novo caminho padrão
   - **[T]** Testar Node.js atual
   - **[S]** Sair

### Execuções Subsequentes

O script lembrará suas configurações e perguntará novamente apenas se necessário.

## ⚙️ Configurações (config.ini)

```ini
[NODE]
# Caminho para o Node.js portátil
NODE_PATH=C:\portable\node\node.exe

[PORTAS]
# Portas dos servidores
PORT_BACKEND=3000
PORT_FRONTEND=5173

[PATHS]
# Caminhos relativos à pasta do script
DIR_BACKEND=..\v3\server
DIR_FRONTEND=..\v3\client

[OPCOES]
# Opções adicionais
AUTO_OPEN_BROWSER=false
RESTART_ON_ERROR=false
WAIT_BACKEND_SECONDS=5
```

### Configurações Disponíveis

| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `NODE_PATH` | Caminho completo para `node.exe` | `C:\portable\node\node.exe` |
| `PORT_BACKEND` | Porta do servidor backend | `3000` |
| `PORT_FRONTEND` | Porta do servidor frontend (Vite) | `5173` |
| `DIR_BACKEND` | Diretório do backend (relativo) | `..\v3\server` |
| `DIR_FRONTEND` | Diretório do frontend (relativo) | `..\v3\client` |
| `AUTO_OPEN_BROWSER` | Abrir navegador automaticamente | `false` |
| `WAIT_BACKEND_SECONDS` | Segundos para aguardar backend | `5` |

## 📋 Fluxo de Execução

1. **Verificação de Configuração**
   - Carrega ou cria `config.ini`
   - Valida caminho do Node.js

2. **Menu Interativo** (se necessário)
   - Permite escolher/configurar Node.js
   - Testa execução

3. **Validação do Ambiente**
   - Verifica diretórios do projeto
   - Valida `package.json`
   - Verifica `node_modules`

4. **Instalação de Dependências** (se necessário)
   - Oferece instalar automaticamente
   - Backend e Frontend separadamente

5. **Verificação de Portas**
   - Avisa se portas já estão em uso
   - Permite continuar ou cancelar

6. **Inicialização dos Servidores**
   - **Backend primeiro** (obrigatório)
   - Aguarda backend estar pronto
   - Frontend em seguida
   - Janelas minimizadas

7. **Confirmação e Logs**
   - Exibe URLs de acesso
   - Mostra caminhos dos logs
   - Opcionalmente abre navegador

## 📝 Logs

Todos os logs são salvos em `logs/`:

- `sgfila_AAAAMMDD.log` - Log geral do script
- `backend_AAAAMMDD.log` - Saída do servidor backend
- `frontend_AAAAMMDD.log` - Saída do servidor frontend

**Formato:** `[AAAA-MM-DD HH:MM:SS] [TIPO] Mensagem`

## 🛠️ Resolução de Problemas

### "Node.js não encontrado"
- Execute novamente e escolha opção **[C]** para configurar
- Verifique se o caminho em `config.ini` está correto
- Use opção **[T]** para testar

### "Porta já em uso"
1. Execute `parar-sgfila.bat`
2. Ou altere as portas em `config.ini`
3. Ou finalize manualmente o processo

### "Dependências não instaladas"
O script oferecerá instalar automaticamente. Se falhar:
```batch
cd ..\v3\server
node_portátil\node.exe -e "require('child_process').execSync('npm install', {stdio:'inherit'})"

cd ..\v3\client
node_portátil\node.exe -e "require('child_process').execSync('npm install', {stdio:'inherit'})"
```

### "Backend não iniciou"
1. Verifique o log: `logs\backend_AAAAMMDD.log`
2. Procure por erros de compilação TypeScript
3. Verifique se todas as dependências estão instaladas
4. Confirme que a porta 3000 está livre

### "Frontend não conecta ao backend"
1. Confirme que backend iniciou primeiro
2. Verifique se o proxy está configurado em `vite.config.ts`
3. Aguarde mais tempo (aumentar `WAIT_BACKEND_SECONDS`)

## 🔧 Personalização

### Alterar Caminho Padrão do Node.js

**Opção 1:** Pelo menu do script
1. Execute `iniciar-sgfila.bat`
2. Escolha **[C]** Configurar novo caminho
3. Digite o caminho completo
4. O script salvará automaticamente

**Opção 2:** Editar diretamente
1. Abra `config.ini` em um editor de texto
2. Altere `NODE_PATH=...`
3. Salve o arquivo

### Alterar Portas

Edite `config.ini`:
```ini
[PORTAS]
PORT_BACKEND=8080
PORT_FRONTEND=3000
```

### Abrir Navegador Automaticamente

Edite `config.ini`:
```ini
[OPCOES]
AUTO_OPEN_BROWSER=true
```

## ⚡ Atalhos

### Criar Atalho na Área de Trabalho

1. Clique direito em `iniciar-sgfila.bat`
2. "Enviar para" → "Área de trabalho (criar atalho)"
3. Renomeie para "Iniciar SGFILA"
4. (Opcional) Clique direito → Propriedades → "Executar minimizado"

### Executar na Inicialização do Windows

1. Pressione `Win + R`
2. Digite `shell:startup`
3. Cole um atalho de `iniciar-sgfila.bat`

**⚠️ Atenção:** Configure `AUTO_OPEN_BROWSER=false` para evitar abrir navegador na inicialização.

## 🔒 Segurança

- Logs podem conter informações sensíveis - revise antes de compartilhar
- `config.ini` não contém senhas, mas contém caminhos do sistema
- Scripts executam apenas em contexto local (sem acesso à rede)

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs em `logs/`
2. Teste o Node.js manualmente: `node --version`
3. Confirme estrutura de diretórios do projeto
4. Reporte o problema com os logs anexados

---

**Desenvolvido para SGFILA v3.0**
Sistema de Gerenciamento de Filas - Correios
