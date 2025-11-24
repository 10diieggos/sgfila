# Fluxo de Execução por Turno — Equipe SGFILA

## Objetivo
- Estabelecer o processo padrão de desenvolvimento e testes executado a cada turno, orquestrado pelo `SOLO Coder`, envolvendo todos os agentes.
- Garantir atualização contínua de planejamento (`proximos_passos.md`), testes (`testes.md`) e requisitos (`requisitos.md`).

## Orquestração e Papéis
- `SOLO Coder`: orquestrador do turno; consolida planos, resolve conflitos, implementa e faz handoff para testes/auditoria.
- `UI/UX Planner`: planeja UI/UX e atualiza testes de interface.
- `Interface Designer`: padroniza estilos, acessibilidade e componentes visuais.
- `QA‑SGFila`: executa testes manuais; registra resultados e bloqueios.
- `Test Automation Engineer`: cria/executa testes E2E/UI automatizados e integra evidências.
- `Edge‑AI Engineer`: planeja/valida IA embarcada e testes de ML/telemetria/offline.
- `Queue Data Scientist`: evolui métricas/modelagem (λ/μ, percentis) e testes analíticos.
- `Build/Release Engineer`: planeja e valida empacotamento offline e scripts de execução.
- `Security Reviewer`: audita CORS/telemetria/privilégios; atualiza recomendações.
- `Performance Engineer`: define KPIs e otimiza performance cliente/servidor.
- `Supervisor Crítico`: gate de conformidade (exatidão, requisitos offline/admin, alinhamento com `requisitos.md`).

## Artefatos
- Planejamento: `v3/team_agents/desenvolvimento/proximos_passos.md`
- Testes: `v3/team_agents/desenvolvimento/testes.md`
- Requisitos: `v3/team_agents/desenvolvimento/requisitos.md`
- Configurações dos agentes: `v3/team_agents/*.md`

## Início do Turno (Checklist)
- `SOLO Coder` carrega: `proximos_passos.md`, `testes.md`, `requisitos.md`, `interacoes_arquivos.md`, `mcp_matriz.md` e configs dos agentes (`*.md`).
- Verifica pendências abertas e prioridades (peso/impacto/risco).
- Confirma execução offline e sem privilégios administrativos.
- Valida MCPs aplicáveis (apenas leitura/planejamento) conforme `mcp_matriz.md`.

## Passos do Turno
1) Planejamento Conjunto (Agentes)
- `UI/UX Planner`, `Interface Designer`, `Edge‑AI Engineer`, `Queue Data Scientist`, `Build/Release Engineer`, `Test Automation Engineer`, `Security Reviewer`, `Performance Engineer` consultam seus `.md` de configuração e atualizam:
  - `proximos_passos.md`: épicos/tarefas priorizadas, critérios de aceite, dependências.
  - `testes.md`: casos de teste planejados/atualizados, passos, dados e resultados esperados.
- Cada agente pode propor melhorias em seu próprio arquivo `.md` (processo, responsabilidades, priorização).

2) Revisão e Consolidação (SOLO Coder)
- Analisa alterações propostas nos `.md` dos agentes; resolve conflitos; rejeita o que diverge de requisitos.
- Consolida o plano em `proximos_passos.md` (status, prioridade, critérios).
- Garante aderência a `requisitos.md` e execução offline/sem admin.

3) Implementação (SOLO Coder)
- Executa tarefas priorizadas do `proximos_passos.md` em lote controlado.
- Atualiza progresso (status concluído/em andamento) no `proximos_passos.md`.
- Mantém rastros mínimos e evita dependências externas; prepara notas para QA em `testes.md`.
- Coordena com `Interface Designer` para ajustes visuais e com `Build/Release Engineer` para verificações de executabilidade offline.

4) Testes (QA‑SGFila)
- Executa a bateria definida em `testes.md` (socket, UI, IA, estatísticas); coleta evidências.
- Atualiza resultados e status dos casos em `testes.md`; registra bloqueios/regressões.
- `Test Automation Engineer` executa scripts automatizados, agrega logs e falhas, e insere links/trechos pertinentes em `testes.md`.
- `Performance Engineer` registra KPIs e observações de latência.

5) Auditoria (Supervisor Crítico)
- Verifica exatidão do que foi reportado vs. implementado.
- Confere cumprimento integral das instruções do usuário.
- Valida requisitos offline/admin e alinhamento com `requisitos.md`.
- Atualiza `requisitos.md` com novos requisitos levantados; registra decisão de gate (allow/deny) e recomendações.
- Revisa recomendações do `Security Reviewer` e as integra ao gate.

6) Fechamento do Turno
- `SOLO Coder` sincroniza `proximos_passos.md` (itens concluídos, próximos, bloqueios) e `testes.md` (estado, evidências).
- Traz novos requisitos (se houver) para o backlog e agenda do próximo turno.

## Regras de Atualização
- `proximos_passos.md`: fonte única do plano; manter pesos/prioridades, status e critérios de aceite.
- `testes.md`: projetar/atualizar casos, registrar resultados e evidências; manter estado por seção (planejado/em execução/concluído/bloqueios).
- `requisitos.md`: incorporar novos requisitos identificados por qualquer agente ou pelo Supervisor.
- Configs dos agentes (`*.md`): agentes podem propor melhorias; `SOLO Coder` revisa e aprova para evitar conflitos.
- `interacoes_arquivos.md`: manter matriz atualizada quando papéis mudarem.
- `mcp_matriz.md`: manter a lista de MCPs por agente consistente com os arquivos `.md` dos agentes.

## Critérios de Aceite por Turno
- Sem bloqueios críticos no `QA‑SGFila`.
- Gate do `Supervisor Crítico` aprovado ou com recomendações registradas.
- Requisitos offline/admin respeitados; sem dependências externas obrigatórias.
- Planejamento e testes refletidos e atualizados nos arquivos.

## Observabilidade e Feedback
- Registrar métricas leves (latências de operações principais, taxa de falhas de testes) no `testes.md` quando pertinente.
- Incorporar feedback do QA/Supervisor no plano do próximo turno.

## Checklists por Agente (Apêndice)
- `SOLO Coder`:
  - Carregar todos os artefatos (`proximos_passos.md`, `testes.md`, `requisitos.md`, `interacoes_arquivos.md`, `mcp_matriz.md`).
  - Consolidar prioridades e iniciar implementação.
- `UI/UX Planner`:
  - Revisar requisitos e propor épicos/tarefas de UX com critérios de aceite.
  - Atualizar `proximos_passos.md` e `testes.md` (UI/UX).
- `Interface Designer`:
  - Definir/ajustar tokens e componentes visuais prioritários.
  - Atualizar casos de acessibilidade em `testes.md`.
- `QA‑SGFila`:
  - Executar smoke e cenários manuais; registrar resultados e bloqueios.
- `Test Automation Engineer`:
  - Rodar automações E2E/UI; anexar logs e falhas.
- `Edge‑AI Engineer`:
  - Validar thresholds e fallback; medir latência; atualizar plano/testes.
- `Queue Data Scientist`:
  - Atualizar cenários analíticos e validações estatísticas.
- `Build/Release Engineer`:
  - Validar executabilidade offline e artefatos; registrar passos.
- `Security Reviewer`:
  - Auditar CORS, autochamada, telemetria, privilégios; registrar recomendações.
- `Performance Engineer`:
  - Medir KPIs; sugerir otimizações leves; atualizar testes de performance.