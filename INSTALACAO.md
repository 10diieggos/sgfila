# SGFILA v3.0 - Guia de Instalação e Configuração

## Sobre o Sistema

O SGFILA v3.0 é um sistema de gerenciamento de filas desenvolvido em TypeScript + Vue.js 3, projetado para operar em ambiente offline (intranet) sem necessidade de acesso administrativo ao Windows.

### Características Principais

- Sistema completamente offline (sem dependência de internet)
- Não requer instalação administrativa no Windows
- Usa Node.js portátil (não instalado no sistema)
- Armazena dados em arquivo JSON local
- Interface web moderna com Vue.js 3
- Comunicação em tempo real via Socket.IO
- Servidor backend em Express + TypeScript

---

## Pré-requisitos

### Estrutura de Pastas Necessária

A estrutura esperada é:

```
pasta-raiz/
├── node.exe                    (Node.js portátil)
├── npm                         (gerenciador de pacotes)
├── npm.cmd
├── node_modules/               (criado pelo npm)
└── sg/                         (este projeto)
    ├── v3/
    │   ├── client/            (Frontend Vue.js)
    │   ├── server/            (Backend Express)
    │   └── shared/            (Tipos compartilhados)
    ├── INSTALACAO.md          (este arquivo)
    └── instalar.bat           (script de instalação)
```

### Node.js Portátil

1. **Baixar Node.js portátil:**
   - Acesse: https://nodejs.org/
   - Baixe a versão LTS mais recente (formato ZIP para Windows)
   - Versão recomendada: Node.js 20.x ou superior

2. **Extrair o Node.js:**
   - Extraia o conteúdo do ZIP em uma pasta (ex: `C:\PortableApps\nodejs`)
   - A pasta deve conter `node.exe`, `npm`, `npm.cmd` e outros arquivos

3. **Posicionar o projeto:**
   - Coloque a pasta `sg` dentro da pasta do Node.js portátil
   - OU ajuste as variáveis de ambiente no script de instalação

---

## Instalação

### Método 1: Script Automático (Recomendado)

1. **Executar o script de instalação:**
   ```batch
   cd sg
   instalar.bat
   ```

2. **O script irá:**
   - Detectar o caminho do Node.js portátil
   - Instalar dependências do servidor
   - Instalar dependências do cliente
   - Compilar o código TypeScript
   - Fazer build de produção do frontend
   - Criar arquivo de dados inicial (se não existir)
   - Criar script de inicialização

3. **Aguarde a conclusão:**
   - O processo pode levar alguns minutos
   - Mensagens serão exibidas durante a instalação

### Método 2: Instalação Manual

Se preferir instalar manualmente ou o script automático falhar:

#### Passo 1: Configurar Variáveis de Ambiente

Abra o Prompt de Comando na pasta `sg` e configure:

```batch
REM Ajuste o caminho conforme sua instalação
set NODE_PATH=..\node.exe
set NPM_PATH=..\npm.cmd

REM Verificar se Node.js está acessível
%NODE_PATH% --version
%NPM_PATH% --version
```

#### Passo 2: Instalar Dependências do Servidor

```batch
cd v3\server
..\..\npm.cmd install
```

Dependências instaladas:
- express (servidor web)
- socket.io (comunicação em tempo real)
- typescript (compilador)
- tsx (executor TypeScript para desenvolvimento)
- @types/* (tipagens TypeScript)

#### Passo 3: Compilar o Servidor

```batch
..\..\npm.cmd run build
```

Isso criará a pasta `v3/server/dist/` com o código JavaScript compilado.

#### Passo 4: Instalar Dependências do Cliente

```batch
cd ..\client
..\..\npm.cmd install
```

Dependências instaladas:
- vue (framework frontend)
- socket.io-client (cliente Socket.IO)
- vite (bundler e dev server)
- vue-tsc (TypeScript para Vue)
- @vitejs/plugin-vue (plugin Vite para Vue)

#### Passo 5: Build de Produção do Cliente

```batch
..\..\npm.cmd run build
```

Isso criará a pasta `v3/client/dist/` com os arquivos HTML/CSS/JS otimizados.

#### Passo 6: Criar Arquivo de Dados Inicial

Crie o arquivo `v3/server/dados.json` com o conteúdo inicial:

```json
{
  "senhas": [],
  "senhasHoje": 0,
  "contadorPrioridade": 0,
  "contadorContratual": 0,
  "contadorNormal": 0,
  "contadorPrioridadeDesdeUltimaNormal": 0,
  "contadorContratualDesdeUltimaNormal": 0,
  "proporcaoPrioridade": 2,
  "proporcaoContratual": 1,
  "atendimentosAtuais": {},
  "guichesConfigurados": [],
  "dataReinicioSistema": "2025-01-01"
}
```

---

## Configuração

### Porta do Servidor

Por padrão, o servidor roda na porta **3000**. Para alterar:

**Opção 1: Variável de Ambiente**
```batch
set PORT=8080
```

**Opção 2: Editar o código**
Edite `v3/server/src/server.ts`:
```typescript
const PORT = process.env.PORT || 3000; // Altere 3000 para a porta desejada
```

Após alterar, recompile:
```batch
cd v3\server
..\..\npm.cmd run build
```

### Configuração de Rede

#### Acesso Local (Mesmo Computador)
- URL: `http://localhost:3000`
- Nenhuma configuração adicional necessária

#### Acesso na Rede Local (Intranet)

1. **Descobrir o IP local:**
   ```batch
   ipconfig
   ```
   Procure por "Endereço IPv4" (ex: `192.168.1.100`)

2. **Configurar Firewall do Windows:**
   - Abra "Windows Defender Firewall"
   - Clique em "Configurações Avançadas"
   - Regras de Entrada > Nova Regra
   - Tipo: Porta
   - Protocolo: TCP
   - Porta: 3000 (ou a porta configurada)
   - Ação: Permitir a conexão
   - Nome: "SGFILA v3"

   **NOTA:** Esta etapa pode requerer acesso administrativo.

3. **Acessar de outros computadores:**
   - URL: `http://192.168.1.100:3000` (use o IP do servidor)

### Arquivo de Dados (dados.json)

O arquivo `v3/server/dados.json` armazena:
- Senhas geradas e em atendimento
- Contadores de senhas por tipo
- Configurações de guichês
- Proporções de atendimento
- Data do último reset

**Localização:** `v3/server/dados.json`

**Backup Recomendado:**
```batch
REM Criar backup diário
copy v3\server\dados.json v3\server\dados_backup_%DATE%.json
```

---

## Inicialização do Sistema

### Usando o Script de Inicialização

Após a instalação, um script `iniciar.bat` é criado automaticamente:

```batch
iniciar.bat
```

Isso iniciará o servidor e abrirá o navegador automaticamente.

### Inicialização Manual

Se preferir iniciar manualmente:

```batch
cd sg\v3\server
..\..\node.exe dist\server.js
```

Você verá:
```
=================================
SGFILA v3.0 - TypeScript + Vue 3
=================================
Servidor rodando em http://localhost:3000
Pressione Ctrl+C para parar
=================================
```

### Acessar o Sistema

Abra um navegador e acesse:
- **Local:** http://localhost:3000
- **Rede:** http://[IP-DO-SERVIDOR]:3000

### Parar o Sistema

Para encerrar o servidor:
- Pressione `Ctrl+C` no terminal
- OU feche a janela do Prompt de Comando

---

## Solução de Problemas

### Erro: "node não é reconhecido como comando"

**Causa:** O caminho do Node.js não está configurado.

**Solução:**
```batch
REM Use o caminho absoluto
C:\caminho\para\node.exe --version

REM Ou configure a variável PATH temporariamente
set PATH=%PATH%;C:\caminho\para\nodejs
```

### Erro: "EACCES: permission denied"

**Causa:** Sem permissão para escrever arquivos.

**Solução:**
- Verifique permissões da pasta
- Execute de uma pasta onde você tem permissão de escrita
- Evite pastas do sistema (Program Files, Windows, etc.)

### Erro: "EADDRINUSE: address already in use"

**Causa:** A porta 3000 já está sendo usada por outro programa.

**Solução:**
```batch
REM Opção 1: Usar outra porta
set PORT=3001

REM Opção 2: Encontrar e encerrar o processo usando a porta
netstat -ano | findstr :3000
taskkill /PID [numero_do_pid] /F
```

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas corretamente.

**Solução:**
```batch
REM Reinstalar dependências do servidor
cd v3\server
del /s /q node_modules
..\..\npm.cmd install

REM Reinstalar dependências do cliente
cd ..\client
del /s /q node_modules
..\..\npm.cmd install
```

### Página não carrega ou erro 404

**Causa:** Build do cliente não foi feito ou está incompleto.

**Solução:**
```batch
cd v3\client
..\..\npm.cmd run build

REM Verificar se a pasta dist foi criada
dir dist
```

### Dados não estão sendo salvos

**Causa:** Arquivo `dados.json` não tem permissão de escrita.

**Solução:**
- Verifique se o arquivo `v3/server/dados.json` existe
- Verifique permissões de escrita na pasta
- Execute de uma pasta com permissões adequadas

---

## Estrutura de Arquivos Detalhada

```
sg/
├── v3/
│   ├── client/                     # Frontend Vue.js
│   │   ├── src/                    # Código-fonte Vue
│   │   │   ├── components/        # Componentes Vue
│   │   │   ├── services/          # Serviços (Socket.IO)
│   │   │   ├── App.vue            # Componente raiz
│   │   │   └── main.ts            # Entry point
│   │   ├── public/                # Arquivos estáticos
│   │   ├── dist/                  # Build de produção (gerado)
│   │   ├── package.json           # Dependências do cliente
│   │   ├── vite.config.ts         # Configuração Vite
│   │   └── tsconfig.json          # Configuração TypeScript
│   │
│   ├── server/                    # Backend Express
│   │   ├── src/                   # Código-fonte TypeScript
│   │   │   ├── services/         # Lógica de negócio
│   │   │   │   ├── QueueService.ts        # Gerenciamento de filas
│   │   │   │   ├── StateManager.ts        # Persistência de dados
│   │   │   │   └── StatisticsService.ts   # Estatísticas
│   │   │   ├── socket/           # Handlers Socket.IO
│   │   │   └── server.ts         # Entry point do servidor
│   │   ├── dist/                 # Código JavaScript compilado (gerado)
│   │   ├── dados.json            # Banco de dados JSON
│   │   ├── package.json          # Dependências do servidor
│   │   └── tsconfig.json         # Configuração TypeScript
│   │
│   ├── shared/                   # Tipos compartilhados
│   │   └── types.ts              # Definições TypeScript
│   │
│   └── .gitignore               # Arquivos ignorados pelo Git
│
├── INSTALACAO.md                # Este arquivo
├── instalar.bat                 # Script de instalação (gerado)
└── iniciar.bat                  # Script de inicialização (gerado)
```

---

## Manutenção

### Atualização do Sistema

Para atualizar o código:

1. **Fazer backup dos dados:**
   ```batch
   copy v3\server\dados.json dados_backup.json
   ```

2. **Atualizar o código-fonte** (via Git ou cópia manual)

3. **Reinstalar e recompilar:**
   ```batch
   instalar.bat
   ```

4. **Restaurar dados (se necessário):**
   ```batch
   copy dados_backup.json v3\server\dados.json
   ```

### Reset do Sistema

Para limpar todas as senhas e reiniciar:

1. **Método 1: Via Interface Web**
   - Acesse a interface de administração
   - Use o botão "Resetar Sistema"

2. **Método 2: Manual**
   ```batch
   REM Parar o servidor (Ctrl+C)

   REM Editar dados.json e resetar contadores
   notepad v3\server\dados.json

   REM Reiniciar o servidor
   iniciar.bat
   ```

### Backup Automático

Crie um script `backup.bat`:

```batch
@echo off
set DATA=%DATE:/=-%
set HORA=%TIME::=-%
copy v3\server\dados.json backups\dados_%DATA%_%HORA%.json
echo Backup criado: dados_%DATA%_%HORA%.json
```

Execute diariamente ou antes de operações críticas.

---

## Desenvolvimento

### Modo de Desenvolvimento

Para desenvolver com hot-reload:

**Terminal 1 - Servidor:**
```batch
cd v3\server
..\..\npm.cmd run dev:win
```

**Terminal 2 - Cliente:**
```batch
cd v3\client
..\..\npm.cmd run dev:win
```

Acesse: http://localhost:5173 (Vite dev server com proxy para servidor)

### Scripts Disponíveis

**Servidor (v3/server):**
- `npm run dev:win` - Modo desenvolvimento (hot-reload)
- `npm run build` - Compilar TypeScript
- `npm run start` - Iniciar servidor compilado
- `npm run lint` - Verificar código
- `npm run type-check` - Verificar tipos

**Cliente (v3/client):**
- `npm run dev:win` - Modo desenvolvimento (hot-reload)
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificar código
- `npm run type-check` - Verificar tipos

---

## Segurança

### Recomendações

1. **Rede Isolada:** Use apenas em rede interna confiável
2. **Firewall:** Configure regras específicas apenas para IPs autorizados
3. **Backup:** Faça backups regulares do `dados.json`
4. **Acesso:** Restrinja acesso físico ao servidor
5. **Monitoramento:** Verifique logs regularmente

### Limitações de Segurança

O sistema foi projetado para ambiente controlado e **NÃO deve ser exposto à internet** pois:
- Não possui autenticação de usuários
- Não usa HTTPS
- Aceita conexões de qualquer origem (CORS: *)
- Não possui proteção contra ataques comuns

---

## Suporte e Documentação

### Logs do Sistema

Os logs são exibidos no console onde o servidor foi iniciado:
- Conexões de clientes
- Operações realizadas (gerar senha, chamar, finalizar)
- Salvamento de dados
- Erros e warnings

### Informações do Sistema

Para verificar versões:
```batch
REM Versão do Node.js
..\node.exe --version

REM Versão do npm
..\npm.cmd --version

REM Informações do sistema
..\node.exe -p "process.platform + ' ' + process.arch"
```

### Recursos Adicionais

- **README.md:** Visão geral do projeto
- **Código-fonte:** Comentado em português
- **Types (shared/types.ts):** Documentação dos tipos de dados

---

## Perguntas Frequentes

### Posso usar em vários computadores?

Sim, um computador atua como servidor e os demais acessam via navegador usando o IP do servidor.

### Precisa de internet?

Não. O sistema funciona 100% offline após a instalação.

### Posso mudar a porta?

Sim, configure a variável `PORT` antes de iniciar o servidor.

### Os dados são perdidos ao reiniciar?

Não, tudo é salvo em `dados.json` automaticamente.

### Posso usar outro navegador?

Sim, qualquer navegador moderno (Chrome, Firefox, Edge, etc.).

### Precisa de banco de dados?

Não, usa apenas arquivo JSON.

---

## Changelog v3.0

- Migração completa para TypeScript
- Frontend reescrito em Vue.js 3 (Composition API)
- Arquitetura modular e escalável
- Melhor gerenciamento de estado
- Sistema de estatísticas integrado
- Configuração dinâmica de guichês
- Interface modernizada
- Melhor tratamento de erros
- Documentação completa

---

**Versão:** 3.0.0
**Data:** Novembro 2024
**Sistema:** SGFILA - Sistema de Gerenciamento de Filas
