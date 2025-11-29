# Tech Lead Fullstack - SGFila Virtual IA Team

**Configuração de Agent para Continue.dev**

---

## 📋 Visão Geral

Este documento descreve a configuração completa do Continue.dev para o agent **Tech Lead Fullstack**, projetado para orquestrar um time virtual de IAs para o projeto SGFila (Sistema de Gestão de Filas).

### Integração de 5 Papéis de Liderança

O Tech Lead Fullstack integra cinco papéis críticos de liderança:

1. **CTO (Chief Technology Officer)** - Decisões tecnológicas estratégicas
2. **Engineering Manager** - Planejamento de capacidade e gestão de métricas
3. **Architect** - Design de sistemas e orquestração de workflows multi-agent
4. **Tech Lead** - Orientação técnica direta e code review
5. **Scrum Master** - Facilitação ágil adaptada para agentes IA autônomos

---

## 🎯 Missão Principal

Orquestrar um time de 10 agentes IA especializados para entregar features de alta qualidade para o SGFila, garantindo:

- **Operação offline-first** (sem dependências externas em runtime)
- **Compliance de segurança** (OWASP Top 10)
- **Otimização de performance** (bundle size, latência, memória)
- **Acessibilidade** (WCAG 2.1 AA)
- **Testes automatizados** (unit, integration, E2E)
- **Excelência em DevOps** (CI/CD, automação de build, deploy offline)

---

## 🤖 Estrutura do Time Virtual de IAs

### Agentes Especializados

| ID do Agent | Papel Principal | Expertise Chave |
|-------------|-----------------|-----------------|
| `solo-coder` | Implementação geral | Codificação full-stack, integrações |
| `queue-data-scientist` | Modelagem de filas | Estimadores λ/μ, análise estatística, percentis |
| `edge-ai-engineer` | Integração ML/IA | Modelos ONNX, otimização de inferência, thresholds |
| `interface-designer` | Componentes UI | Design tokens, acessibilidade (WCAG), design visual |
| `uiux-planner` | Pesquisa UX | Fluxos de usuário, padrões de interação, microcopy |
| `qa-sgfila` | Garantia de qualidade | Planejamento de testes, smoke tests, validação |
| `test-automation-engineer` | Automação de testes | Suítes Playwright/Jest, integração CI |
| `security-reviewer` | Auditoria de segurança | Compliance OWASP, config CORS, gestão de secrets |
| `performance-engineer` | Otimização de performance | Profiling de latência, otimização de bundle |
| `build-release-engineer` | Build & deployment | Empacotamento offline, scripts de build, instaladores USB |

---

## 🛠️ Comandos Slash

### 1. `/review-code`

**Propósito**: Code review técnico completo com análise de complexidade Big O

**Seções do Output**:
- Resumo (o que o código faz)
- Análise de Complexidade (Big O tempo/espaço para algoritmos chave)
- Issues Críticos (vulnerabilidades de segurança, erros de tipo, bugs de lógica, race conditions)
- Qualidade de Código (TypeScript strict mode, violações ESLint, code smells)
- Cobertura de Testes (testes existentes, casos de teste faltando)
- Arquitetura (consistência com padrões SGFila)
- Sugestões (refatoração, otimizações de performance)
- Decisão (Aprovar / Aprovar com condições / Solicitar mudanças)

**Exemplo de Uso**:
```
Selecionar código no editor → Executar /review-code
```

**Critérios**:
- **Segurança**: Compliance OWASP Top 10
- **Performance**: Identificar algoritmos O(n²) ou piores
- **Manutenibilidade**: Complexidade ciclomática ≤ 15 por função
- **Testes**: Caminhos críticos devem ter testes

---

### 2. `/plan-sprint`

**Propósito**: Atomizar features em tarefas isoladas para agentes IA com dependências e critérios de validação

**Input**: Backlog de features (lista de bullets ou descrição)

**Output**: Breakdown de tarefas com:
- **Task ID** (formato: `[SPRINT-XXX]`)
- **Alocação de agent** (qual agent especializado)
- **Prompt** (instrução exata para o agent)
- **Dependências** (`depends_on: [SPRINT-XXX]`)
- **Critérios de validação** (condições de sucesso mensuráveis)
- **Orçamento de tokens** (tokens estimados para chamadas de API IA)

**Exemplo de Output**:
```markdown
## Plano de Sprint: Implementação de Fila Prioritária

### Breakdown de Tarefas
- **[SPRINT-001]** Agent: `queue-data-scientist`
  - **Prompt**: Analisar algoritmo de fila prioritária baseado em tempo de espera + categoria de serviço
  - **Output**: Análise técnica + pseudocódigo
  - **Depende De**: []
  - **Validação**: Algoritmo trata edge cases (fila vazia, empates)
  - **Orçamento de Tokens**: ~5000 tokens

- **[SPRINT-002]** Agent: `solo-coder`
  - **Prompt**: Implementar QueuePriorityService conforme análise SPRINT-001
  - **Output**: Código TypeScript + testes unitários
  - **Depende De**: [SPRINT-001]
  - **Validação**: 100% de aprovação nos testes, cobertura ≥ 80%
  - **Orçamento de Tokens**: ~8000 tokens
```

---

### 3. `/metrics-report`

**Propósito**: Analisar métricas de performance dos agentes IA e gerar recomendações acionáveis

**KPIs Monitorados**:
1. **Eficiência de Tokens**: Média de tokens por tarefa (alvo: minimizar mantendo qualidade)
2. **Taxa de Sucesso**: % de tarefas completadas sem retrabalho (alvo: >95%)
3. **Score de Qualidade**: Scores de code review, taxa de aprovação em testes (alvo: >90)
4. **Throughput**: Tarefas por hora por agent
5. **Confiabilidade da Cadeia**: % de handoffs bem-sucedidos entre agents (alvo: >98%)

**Output**:
- Resumo Executivo (2-3 frases)
- Tabela de KPIs (métrica, valor, alvo, status)
- Tendências (evolução de métricas ao longo do tempo)
- Gargalos (issues identificados)
- Recomendações (otimizações de prompts, ajustes de workflow)

---

### 4. `/resolve-conflict`

**Propósito**: Mediar conflitos técnicos entre agents (ex: outputs contraditórios, discordâncias de design)

**Processo de Resolução**:
1. **Análise de Causa Raiz**: Por que os agents discordam?
2. **Avaliação de Opções**: Prós/contras de cada abordagem (performance, segurança, manutenibilidade)
3. **Benchmarks**: Executar testes objetivos se possível
4. **Decisão**: Escolher melhor opção ou propor híbrido
5. **Justificativa**: Explicar com dados/métricas
6. **Escalação**: Sinalizar para revisão humana se irresolúvel

---

### 5. `/arch-decision`

**Propósito**: Tomar decisões arquiteturais com análise custo-benefício e documentar como ADR (Architecture Decision Record)

**Estrutura do ADR**:
- Título, Status, Contexto, Decisão
- Opções Consideradas (prós/contras/custo)
- Análise (performance, escalabilidade, manutenibilidade, segurança)
- Trade-offs, Consequências, Validação, Referências

**Local de Salvamento**: `team_agents/desenvolvimento/adr/ADR-XXX-titulo.md`

---

### 6. `/sync-tasks`

**Propósito**: Sincronizar tarefas completadas entre `proximos_passos.md` e `passos_concluidos.md`

**Processo**:
1. Identificar tarefas marcadas `[Concluído]` em `proximos_passos.md`
2. Extrair detalhes da tarefa (ID, descrição, peso, agent)
3. Mover para `passos_concluidos.md` com timestamp
4. Atualizar `proximos_passos.md` (remover completadas)
5. Gerar relatório resumido

---

### 7. `/plan-team`

**Propósito**: Projetar estrutura do time virtual de IAs com papéis, responsabilidades, protocolos de interação

**Output**:
- Definições de Papéis (por agent)
- Matriz de Interação (padrões de colaboração)
- Caminhos de Escalação
- Alocação de Capacidade
- Padrões de Workflow

**Local de Salvamento**: `team_agents/desenvolvimento/team_charter.md`

---

### 8. `/assign-tasks`

**Propósito**: Alocar tarefas de `proximos_passos.md` para agents apropriados baseado em expertise

**Processo**:
1. Parsear tarefas ativas
2. Analisar domínio, complexidade, dependências
3. Combinar com expertise do agent
4. Gerar filas de trabalho por agent

**Output**: `proximos_passos.md` atualizado + filas de trabalho por agent em `team_agents/desenvolvimento/work_queues/`

---

### 9. `/create-agent-config`

**Propósito**: Gerar configuração JSON completa do Continue.dev para um novo agent especializado

**Comandos Especializados por Tipo de Agent**:
- **Queue Data Scientist**: `/estimate-lambda`, `/calculate-percentiles`, `/model-queue`
- **Security Reviewer**: `/audit-security`, `/check-owasp`, `/scan-secrets`
- **Performance Engineer**: `/profile-latency`, `/optimize-bundle`, `/benchmark`
- **Edge AI Engineer**: `/validate-model`, `/optimize-inference`, `/tune-thresholds`
- **Build Release Engineer**: `/package-offline`, `/validate-build`, `/create-installer`

**Local de Salvamento**: `team_agents/Continue/[agent-id].json`

---

### 10. `/audit-architecture`

**Propósito**: Auditoria arquitetural completa do codebase SGFila

**Dimensões de Auditoria** (pontuadas 🟢/🟡/🔴):
1. Modularidade & Estrutura
2. Acoplamento & Coesão
3. Padrões de Design
4. Escalabilidade
5. Arquitetura de Segurança
6. Compliance Offline-First
7. Comunicação em Tempo Real
8. Fluxo de Dados & Gestão de Estado
9. Arquitetura de Testes
10. Débito Técnico

**Local de Salvamento**: `team_agents/desenvolvimento/audit/architecture-audit-[data].md`

---

### 11. `/define-quality-gates`

**Propósito**: Definir quality gates para o pipeline CI/CD

**Gates**:
1. **Qualidade de Código** (blocker): TypeScript, ESLint, complexidade, duplicação
2. **Segurança** (blocker): Scan OWASP, detecção de secrets, CORS
3. **Performance** (parcial): Bundle size, latência, TTI
4. **Acessibilidade** (blocker): WCAG 2.1 AA, contraste, teclado
5. **Testes** (blocker): Unit ≥80%, E2E ≥95%
6. **Build** (blocker): Build limpo, validação offline
7. **Documentação** (warning): ADRs, README, docs de API

**Locais de Salvamento**: `quality-gates.yml` + `quality-gates.md`

---

## 🔧 Configuração Técnica

### Model & API

```json
{
  "model": "tngtech/deepseek-r1t2-chimera:free",
  "apiBase": "https://openrouter.ai/api/v1",
  "contextLength": 32768,
  "temperature": 0.2
}
```

**Por Que DeepSeek-R1T2 Chimera?**
- 32K de contexto para codebases grandes
- Baixa temperatura (0.2) para outputs precisos
- Tier gratuito para custo-efetividade

### Context Providers

- **code**: `v3/server/src/**/*.ts`, `v3/client/src/**/*.vue`
- **docs**: `team_agents/desenvolvimento/`, `team_agents/TRAE/`
- **terminal**, **problems**, **diff**: Padrão

---

## 📊 Princípios de Tomada de Decisão

1. **Data-Driven**: Justificar com métricas/benchmarks
2. **Offline-First**: Sem dependências externas em runtime
3. **Security-First**: Compliance OWASP
4. **Performance-Conscious**: Bundle, latência, memória
5. **Accessibility-Mandatory**: WCAG 2.1 AA
6. **Testability**: Alta cobertura
7. **Simplicity**: Evitar over-engineering
8. **Escalar Quando**: Decisões de negócio, conflitos, impacto em produção

---

## 📐 Padrões de Qualidade

| Área | Padrões |
|------|---------|
| **Código** | TypeScript strict, ESLint Airbnb, complexidade ≤15 |
| **Testes** | Unit ≥80%, E2E smoke ≥95% |
| **Segurança** | OWASP Top 10, sem secrets, CORS restrito |
| **Performance** | Bundle ≤250KB, latência p95 ≤200ms, TTI ≤2s |
| **Acessibilidade** | WCAG 2.1 AA, contraste ≥4.5:1, acessível via teclado |
| **Docs** | ADRs, comentários inline, README atualizado |

---

## 🏗️ Stack Tecnológica do SGFila

- **Backend**: Node.js, TypeScript, Socket.IO, Express, PostgreSQL, Redis
- **Frontend**: Vue 3, TypeScript, Vite
- **ML/IA**: ONNX Runtime Web, algoritmos JSED/WRR
- **Testes**: Playwright, Jest, smoke-socket.js
- **Build**: Vite, npm, deploy offline (USB/Windows/somente LAN)

---

## 📁 Arquivos Chave

| Propósito | Caminho |
|-----------|---------|
| Planejamento | `team_agents/desenvolvimento/proximos_passos.md` |
| Completadas | `team_agents/desenvolvimento/passos_concluidos.md` |
| Requisitos | `team_agents/desenvolvimento/requisitos.md` |
| Testes | `team_agents/desenvolvimento/testes.md` |
| Queue Service | `v3/server/src/services/QueueService.ts` |
| IA Manager | `v3/server/src/services/IAManager.ts` |
| State Manager | `v3/server/src/services/StateManager.ts` |

---

## 🔄 Protocolo de Interação (Handoffs de Agents)

```json
{
  "from_agent": "solo-coder",
  "to_agent": "qa-sgfila",
  "task_context": "Implementado QueuePriorityService com JSED",
  "artifacts": ["QueuePriorityService.ts", "QueuePriorityService.test.ts"],
  "next_action": "Validar contra critérios de aceitação",
  "validation_criteria": ["Testes passam ≥80% cobertura", "Smoke test OK"]
}
```

---

## 🎯 KPIs

### Tech Lead Agent
- Qualidade de Decisão: ≥90% aceitas
- Precisão de Planejamento de Sprint: ≥85%
- Rigor de Code Review: ≥95% issues detectados
- Velocidade do Time: ≥20 tarefas/sprint
- Resolução de Conflitos: ≤24 horas

### Time Virtual de IAs
- Eficiência de Tokens: Minimizar
- Taxa de Sucesso: ≥95%
- Score de Qualidade: ≥90
- Throughput: Maximizar
- Confiabilidade da Cadeia: ≥98%

---

## 🚀 Começando

1. **Instalar Continue.dev** no VSCode
2. **Configurar**: Adicionar `tech_lead_fullstack.json` ao `.continue/config.json`
3. **Verificar**: Executar `/sync-tasks` para testar
4. **Primeiros Comandos**: `/plan-team`, `/assign-tasks`, `/metrics-report`

---

## 🔒 Considerações de Segurança

- **API Keys**: Nunca commitar, usar env vars
- **Code Review**: OWASP Top 10, detecção de secrets, CORS
- **Offline-First**: Sem `fetch()` externo, apenas assets locais

---

## 📈 Melhoria Contínua

### Retrospectiva Semanal
1. O que funcionou bem?
2. O que precisa melhorar?
3. O que devemos mudar?

### Cadência de Métricas
- **Diária**: Taxa de sucesso, throughput
- **Semanal**: Eficiência de tokens, qualidade
- **Sprint**: Confiabilidade da cadeia, completude
- **Mensal**: Auditoria de arquitetura, débito técnico

---

## 🛟 Troubleshooting

### Agent Não Responde
- Verificar status da API OpenRouter
- Verificar validade da API key
- Reduzir context window para 16K
- Verificar logs do Continue

### Qualidade Ruim no Code Review
- Aumentar `maxTokens` para 8192
- Prover mais contexto
- Revisar seções menores
- Baixar temperature para 0.1

### Conflitos de Alocação de Tarefas
- Executar `/plan-team` para clarificar papéis
- Usar `/assign-tasks` para realocar
- Verificar dependências em `proximos_passos.md`
- Usar `/resolve-conflict`

---

## 📚 Referências

### Internas
- Team Charter: `team_charter.md`
- Requisitos: `requisitos.md`
- Testes: `testes.md`
- Build: `engenharia_build.md`

### Externas
- Continue.dev: https://continue.dev/docs
- OpenRouter: https://openrouter.ai/docs
- OWASP: https://owasp.org/www-project-top-ten/
- WCAG: https://www.w3.org/WAI/WCAG21/quickref/
- ONNX: https://onnxruntime.ai/docs/

---

## 📝 Histórico de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0.0 | 2025-11-24 | Configuração inicial Continue.dev |

---

## 👤 Autor

**Diego Richard Lemos**
Tech Lead & Arquiteto de Sistemas IA
Projeto SGFila

---

**Fim da Documentação**
