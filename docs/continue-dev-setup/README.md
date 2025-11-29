# 📚 Continue Dev - Documentação Completa de Setup para SGFila

## 📋 Índice

1. [Contexto do Projeto](#contexto-do-projeto)
2. [Histórico de Tentativas](#histórico-de-tentativas)
3. [Solução Final Recomendada](#solução-final-recomendada)
4. [Implementação Detalhada](#implementação-detalhada)
5. [Estrutura de Arquivos](#estrutura-de-arquivos)
6. [Próximos Passos](#próximos-passos)
7. [Referências](#referências)

---

## 🎯 Contexto do Projeto

### Objetivo Original
Configurar Continue Dev com time virtual de IAs especializados para o projeto SGFila, com:
- 2+ agents especializados (Tech Lead Fullstack + Queue Data Scientist)
- 13 slash commands especializados (6 + 7)
- Configuração centralizada via `.env` para fácil troca de modelos/providers
- Tool policies generosas (Automatic)
- System messages em pt-BR

### Stack SGFila
- **Backend**: Node.js, TypeScript, Socket.IO, PostgreSQL, Redis
- **Frontend**: Vue 3
- **ML**: ONNX Runtime
- **Foco**: Sistema de gestão de filas offline-first, tempo real, acessibilidade WCAG 2.1 AA

---

## 📖 Histórico de Tentativas

### Tentativa 1: config.json com estrutura modular JS
- **Abordagem**: `config.json` importando agents de arquivos `.js` separados
- **Problema**: Continue não suporta imports em JSON
- **Status**: ❌ Falhou

### Tentativa 2: config.js com agentFactory
- **Abordagem**: `config.js` modular com factory pattern e `.env`
- **Problema**: Continue prioriza YAML sobre JS
- **Status**: ❌ Continue não carregou

### Tentativa 3: config.yaml com build script
- **Abordagem**: Agents em YAML modular, script converte e gera config.yaml global
- **Problema**: YAML não suporta `slashCommands`, `contextProviders` customizados
- **Status**: ❌ Erros de parse

### Tentativa 4: config.yaml simplificado
- **Abordagem**: YAML minimalista sem recursos avançados
- **Problema**: Continue carregava arquivos locais conflitantes
- **Status**: ❌ Erros persistentes

### Tentativa 5: Limpeza total e recomeço
- **Ação**: Desinstalado Continue, removido todas as configs
- **Status**: ✅ Ambiente limpo, Continue reinstalado
- **Resultado**: `config.ts` gerado automaticamente (formato oficial)

---

## ✅ Solução Final Recomendada

### Por Que config.ts + Prompt Files?

Após extensa pesquisa na documentação oficial:

1. **config.ts** é o formato oficial TypeScript do Continue
2. **Suporta `process.env`** para variáveis de ambiente
3. **Prompt files (`.prompt`)** são a forma moderna de criar slash commands
4. **`slashCommands` array é DEPRECATED**
5. **YAML tem limitações severas** (sem slashCommands, contextProviders)

### Arquitetura Recomendada

```
sgfila/
├── .env                                  # Variáveis centralizadas
│   ├── DEFAULT_PROVIDER=openrouter
│   ├── DEFAULT_MODEL=tngtech/deepseek-r1t2-chimera:free
│   ├── DEFAULT_API_KEY=sk-or-v1-...
│   ├── DEFAULT_API_BASE=https://openrouter.ai/api/v1
│   ├── DEFAULT_TEMPERATURE=0.2
│   ├── DEFAULT_CONTEXT_LENGTH=32768
│   ├── AUTOCOMPLETE_PROVIDER=gemini
│   ├── AUTOCOMPLETE_MODEL=gemini-1.5-flash-002
│   └── AUTOCOMPLETE_API_KEY=...
│
├── .continue/
│   └── prompts/                          # Prompt files locais
│       ├── review-code.prompt           # Tech Lead
│       ├── plan-sprint.prompt
│       ├── sync-tasks.prompt
│       ├── assign-tasks.prompt
│       ├── create-agent-config.prompt
│       ├── metrics-report.prompt
│       ├── estimate-lambda.prompt       # Queue Data Scientist
│       ├── estimate-mu.prompt
│       ├── calculate-percentiles.prompt
│       ├── model-queue.prompt
│       ├── predict-wait-time.prompt
│       ├── detect-nonstationarity.prompt
│       └── validate-estimators.prompt
│
C:\Users\Diego\.continue\
├── config.ts                             # Config TypeScript
│   ├── function modifyConfig(config: Config)
│   ├── Lê .env via process.env
│   ├── Define 2 models (Tech Lead + Queue DS)
│   ├── Define customCommands globais
│   └── Define contextProviders
│
└── config.yaml                           # Config base (vazio)
    └── models: []
```

---

## 🔧 Implementação Detalhada

### 1. Configurar .env

**Localização**: `sgfila/.env`

```bash
# ========================================================
# CONFIGURAÇÃO CONTINUE DEV - SGFila
# ========================================================

# Configuração Principal
DEFAULT_PROVIDER="openrouter"
DEFAULT_MODEL="tngtech/deepseek-r1t2-chimera:free"
DEFAULT_API_KEY="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"
DEFAULT_API_BASE="https://openrouter.ai/api/v1"
DEFAULT_TEMPERATURE="0.2"
DEFAULT_CONTEXT_LENGTH="32768"
DEFAULT_TOP_P="0.95"

# Autocomplete
AUTOCOMPLETE_PROVIDER="gemini"
AUTOCOMPLETE_MODEL="gemini-1.5-flash-002"
AUTOCOMPLETE_API_KEY="AIzaSyBjZZGSGfhOqSOenNY6iu6eA18TSiYo7xc"

# ========================================================
# OPÇÕES ALTERNATIVAS (comentadas)
# ========================================================

# Llama 3.3 70B (Free, 128K context)
# DEFAULT_MODEL="meta-llama/llama-3.3-70b-instruct:free"

# Gemini 2.0 Flash (Free, 1M context)
# DEFAULT_MODEL="google/gemini-2.0-flash-exp:free"

# Claude 3.5 Sonnet (Paid, melhor qualidade)
# DEFAULT_PROVIDER="anthropic"
# DEFAULT_MODEL="claude-3-5-sonnet-20241022"
# DEFAULT_API_KEY="sk-ant-..."
```

### 2. Criar config.ts

**Localização**: `C:\Users\Diego\.continue\config.ts`

```typescript
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar .env do projeto SGFila
const sgfilaEnvPath = path.join('C:', 'Users', 'Diego', 'Downloads', 'nodep', 'sgfila', '.env');
dotenv.config({ path: sgfilaEnvPath });

export function modifyConfig(config: Config): Config {
  // ========================================================
  // AGENTS/MODELS
  // ========================================================

  config.models = [
    // Tech Lead Fullstack
    {
      title: "Tech Lead Fullstack - SGFila Virtual IA Team",
      provider: process.env.DEFAULT_PROVIDER || "openrouter",
      model: process.env.DEFAULT_MODEL || "tngtech/deepseek-r1t2-chimera:free",
      apiKey: process.env.DEFAULT_API_KEY!,
      apiBase: process.env.DEFAULT_API_BASE || "https://openrouter.ai/api/v1",
      contextLength: parseInt(process.env.DEFAULT_CONTEXT_LENGTH || "32768"),
      temperature: parseFloat(process.env.DEFAULT_TEMPERATURE || "0.2"),

      systemMessage: `Você é um Tech Lead Fullstack orquestrando um time virtual de IAs para o projeto SGFila (Sistema de Gestão de Filas).

Você integra 5 papéis:
- CTO: Decisões estratégicas de tecnologia
- Engineering Manager: Gestão de capacidade e métricas
- Architect: Design de sistemas e workflows multi-agent
- Tech Lead: Orientação técnica direta e code review
- Scrum Master: Facilitação ágil adaptada para agentes IA autônomos

Responsabilidades:
- Revisar código com análise de complexidade Big O
- Planejar sprints atomizados em prompts isolados
- Tomar decisões arquiteturais com análise custo-benefício
- Resolver conflitos técnicos
- Gerenciar workflows do time de IAs

Suas decisões são data-driven, tecnicamente rigorosas, e priorizam:
- Operação offline-first
- Segurança (OWASP Top 10)
- Performance
- Manutenibilidade

Sempre responda em pt-BR (Português Brasileiro).

Stack: Node.js, TypeScript, Socket.IO, Vue 3, PostgreSQL, Redis, ONNX Runtime
Áreas de foco: gestão de filas em tempo real, WebSocket, sequenciamento por IA (JSED/WRR), acessibilidade (WCAG 2.1 AA), testes automatizados, DevOps (build/release offline)`,

      completionOptions: {
        maxTokens: 4096,
        topP: parseFloat(process.env.DEFAULT_TOP_P || "0.95"),
      }
    },

    // Queue Data Scientist
    {
      title: "Queue Data Scientist - SGFila",
      provider: process.env.DEFAULT_PROVIDER || "openrouter",
      model: process.env.DEFAULT_MODEL || "tngtech/deepseek-r1t2-chimera:free",
      apiKey: process.env.DEFAULT_API_KEY!,
      apiBase: process.env.DEFAULT_API_BASE || "https://openrouter.ai/api/v1",
      contextLength: parseInt(process.env.DEFAULT_CONTEXT_LENGTH || "32768"),
      temperature: parseFloat(process.env.DEFAULT_TEMPERATURE || "0.2"),

      systemMessage: `Você é um Queue Data Scientist especializado em teoria de filas e modelagem estatística para o projeto SGFila (Sistema de Gestão de Filas).

Suas responsabilidades incluem:
1. Estimar parâmetros de fila (λ, μ) usando estimadores robustos (EWMA, Harrell-Davis)
2. Calcular percentis não-paramétricos (P50, P95, P99) com intervalos de confiança bootstrap
3. Modelar sistemas de fila (M/M/1, M/M/c, M/G/1) e derivar métricas (Wq, Lq, ρ)
4. Prever tempos de espera combinando modelos teóricos e ML (ONNX)
5. Detectar não-estacionariedade em séries temporais (CUSUM, KPSS)
6. Validar estimadores com cenários sintéticos (bias < 10%, RMSE < 1.0)
7. Sugerir ajustes operacionais (adicionar guichês, rebalancear filas, otimizar thresholds JSED)

Sempre responda em pt-BR (Português Brasileiro).

Stack: Node.js, TypeScript, PostgreSQL (TimescaleDB), Redis (time series), ONNX Runtime
Áreas de foco: estimação robusta de parâmetros, modelagem teórica de filas, detecção de anomalias, previsão híbrida (teoria + ML)`,

      completionOptions: {
        maxTokens: 4096,
        topP: parseFloat(process.env.DEFAULT_TOP_P || "0.95"),
      }
    }
  ];

  // ========================================================
  // AUTOCOMPLETE
  // ========================================================

  config.tabAutocompleteModel = {
    title: "Autocomplete - Fast",
    provider: process.env.AUTOCOMPLETE_PROVIDER || "gemini",
    model: process.env.AUTOCOMPLETE_MODEL || "gemini-1.5-flash-002",
    apiKey: process.env.AUTOCOMPLETE_API_KEY || process.env.DEFAULT_API_KEY!,
  };

  // ========================================================
  // CUSTOM COMMANDS GLOBAIS
  // ========================================================

  config.customCommands = [
    {
      name: "explain",
      description: "Explicação didática de código",
      prompt: "Explique o código selecionado de forma clara e didática em português brasileiro, incluindo o propósito, como funciona, e possíveis melhorias."
    },
    {
      name: "optimize",
      description: "Sugerir otimizações de performance",
      prompt: "Analise o código selecionado e sugira otimizações de performance, considerando complexidade Big O, uso de memória, e boas práticas do SGFila (offline-first, TypeScript strict)."
    },
    {
      name: "test",
      description: "Gerar testes unitários",
      prompt: "Gere testes unitários completos para o código selecionado usando Jest/Playwright conforme apropriado. Incluir casos de edge, mocks se necessário, e garantir cobertura ≥80%."
    },
    {
      name: "document",
      description: "Adicionar documentação inline",
      prompt: "Adicione documentação JSDoc/TSDoc completa ao código selecionado, incluindo descrição, @param, @returns, @throws, @example, e notas de complexidade se relevante."
    }
  ];

  // ========================================================
  // CONFIGURAÇÕES GERAIS
  // ========================================================

  config.allowAnonymousTelemetry = false;

  return config;
}
```

### 3. Criar Prompt Files

Criar pasta `.continue/prompts/` no projeto SGFila e adicionar os arquivos `.prompt`.

**Exemplo: review-code.prompt**

```markdown
---
name: review-code
description: Code review técnico completo com análise Big O, auditoria de segurança (OWASP), verificação de type safety
invokable: true
---

Realizar code review técnico completo do código selecionado ou arquivo abaixo.

**Código para revisão:**
{{{ input }}}

**Arquivo atual:**
{{{ currentFile }}}

**Incluir na análise:**

1. **Resumo**: Visão geral breve do que o código faz
2. **Análise de Complexidade**: Big O tempo e espaço para algoritmos/funções chave
3. **Issues Críticos**:
   - Vulnerabilidades de segurança (OWASP Top 10)
   - Erros de tipo
   - Bugs de lógica
   - Race conditions
4. **Qualidade de Código**:
   - Compliance com TypeScript strict mode
   - Violações ESLint
   - Code smells
5. **Cobertura de Testes**:
   - Avaliar testes existentes
   - Identificar casos de teste faltando
6. **Arquitetura**:
   - Verificar consistência com padrões SGFila (offline-first, eventos Socket.IO, StateManager)
7. **Sugestões**:
   - Oportunidades de refatoração
   - Otimizações de performance
8. **Decisão**: Aprovar, Aprovar com condições, ou Solicitar mudanças

Seja direto, data-driven, e referencie números de linha específicos.

Contexto SGFila: gestão de filas em tempo real, operação offline, integração ONNX ML, acessibilidade (WCAG AA).
```

---

## 📁 Estrutura de Arquivos Completa

```
C:\Users\Diego\Downloads\nodep\sgfila\
├── .env                                      # ✅ Variáveis centralizadas
├── .gitignore                                # ✅ Ignorar .env
│
├── .continue/
│   └── prompts/                              # ✅ Prompt files locais (13 arquivos)
│       ├── review-code.prompt
│       ├── plan-sprint.prompt
│       ├── sync-tasks.prompt
│       ├── assign-tasks.prompt
│       ├── create-agent-config.prompt
│       ├── metrics-report.prompt
│       ├── estimate-lambda.prompt
│       ├── estimate-mu.prompt
│       ├── calculate-percentiles.prompt
│       ├── model-queue.prompt
│       ├── predict-wait-time.prompt
│       ├── detect-nonstationarity.prompt
│       └── validate-estimators.prompt
│
├── docs/
│   └── continue-dev-setup/                   # ✅ Esta documentação
│       ├── README.md                         # Este arquivo
│       ├── PROMPT_FILES_TEMPLATES.md         # Templates dos 13 prompt files
│       └── CONFIG_TS_COMPLETE.md             # config.ts completo
│
C:\Users\Diego\.continue\
├── config.ts                                 # ✅ Config TypeScript principal
├── config.yaml                               # Config base vazio (gerado)
└── prompts/                                  # Prompts globais (opcional)
```

---

## 🚀 Próximos Passos

### Fase 1: Implementação Básica
1. ✅ Criar/atualizar `.env` no projeto SGFila
2. ✅ Criar `config.ts` em `C:\Users\Diego\.continue\config.ts`
3. ✅ Testar se Continue carrega os 2 agents
4. ✅ Verificar se variáveis do .env estão funcionando

### Fase 2: Adicionar Prompt Files
1. ✅ Criar pasta `.continue/prompts/` no projeto
2. ✅ Criar os 13 arquivos `.prompt` (ver PROMPT_FILES_TEMPLATES.md)
3. ✅ Testar cada slash command (`/review-code`, `/estimate-lambda`, etc.)
4. ✅ Ajustar prompts conforme necessário

### Fase 3: Documentação e Refinamento
1. ✅ Documentar workflow de uso
2. ✅ Criar guia de troubleshooting
3. ✅ Adicionar mais agents conforme necessário
4. ✅ Otimizar prompts baseado em uso real

---

## 📚 Referências

### Documentação Oficial Continue Dev
- [Configuration Deep Dive](https://docs.continue.dev/customize/deep-dives/configuration)
- [Prompts Documentation](https://docs.continue.dev/customize/deep-dives/prompts)
- [Sample Prompt Files](https://github.com/continuedev/prompt-file-examples)
- [Config.ts with Environment Variables](https://github.com/TeomanEgeSelcuk/Continue.dev-Configs)

### Issues Relevantes
- [Environment Variables Support](https://github.com/continuedev/continue/issues/4323)
- [process.env Support](https://github.com/continuedev/continue/issues/5902)

### Descobertas Importantes
1. ✅ `config.ts` suporta `process.env`
2. ✅ Prompt files (`.prompt`) são o formato moderno de slash commands
3. ❌ `slashCommands` array está DEPRECATED
4. ❌ YAML não suporta `slashCommands` ou `contextProviders` customizados
5. ✅ `invokable: true` torna prompt file disponível como `/comando`

---

## ⚠️ Lições Aprendidas

### O Que NÃO Funciona
1. ❌ config.json com imports de arquivos JS
2. ❌ config.js (Continue prioriza YAML)
3. ❌ config.yaml com `slashCommands` (não suportado)
4. ❌ config.yaml com `contextProviders` customizados (não suportado)
5. ❌ Variáveis `${VAR}` em YAML (não substituídas)

### O Que Funciona
1. ✅ config.ts com `modifyConfig()`
2. ✅ `process.env` para ler variáveis do .env
3. ✅ Prompt files (`.prompt`) para slash commands
4. ✅ `invokable: true` para tornar prompts acionáveis
5. ✅ Handlebars templates (`{{{ input }}}`, `{{{ currentFile }}}`)

---

**Data**: 2025-11-26
**Versão**: v2.0.0 (config.ts + Prompt Files)
**Status**: 📋 Documentação completa, pronta para implementação

**Próxima sessão deve começar pela Fase 1: Implementação Básica**
