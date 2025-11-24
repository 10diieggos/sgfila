# Engenharia de Automação — SGFila v3

## Papel e Missão
- Papel: Test Automation Engineer (agent-test-automation).
- Missão: automatizar E2E/UI e integrações de socket, garantir qualidade, prevenir regressões e documentar resultados.

## Escopo
- E2E/UI: jornadas críticas do guichê e painel, acessibilidade e desempenho.
- Socket: smoke e cenários (emitir/chamar/finalizar/devolver/ausência/notificações).
- Build/Release: validação da pasta oficial `build/SGFila` e scripts de start/stop.
- Deploy Ubuntu: verificação de montagem NTFS, importação de build e start.

## Entregáveis
- Testes automatizados E2E (Playwright) e smoke de socket.
- Relatórios em `v3/team_agents/desenvolvimento/testes.md` com métricas e evidências.
- Atualizações em `v3/team_agents/desenvolvimento/proximos_passos.md` com plano e checkpoints.
- Scripts utilitários de operação (START/STOP prod/dev) revisados.

## Arquitetura de Testes
- Padrões: Page Object Model para UI; utilitários de socket; dados de teste isolados.
- Execução: paralela quando aplicável; ambiente limpo por teste; idempotência.
- Relato: screenshots, logs e tempos p95; histórico por sessão.

## Plano de Implementação
- Fase 1: Consolidação de Build/Release
  - Confirmar pasta oficial `build/SGFila` e remover duplicatas de runtime.
  - Validar `v3/servers_inicializar/START.bat`, `STOP.bat`, `START_dev.bat`, `STOP_dev.bat`.
- Fase 2: Automação E2E/UI
  - Adotar Playwright; estruturar POM e cenários: guichê alterna chamar/finalizar; preview JSED consistente; destaques de tempo‑limite; acessibilidade (foco/contraste/teclado).
  - Métricas: TTI, tempo de quadro, p95 de interações críticas.
- Fase 3: Integração de Socket
  - Smoke e cenários: emitir/chamar/finalizar, notificações, preview JSED.
  - Medição de latências (média/p95) e verificação de campos.
- Fase 4: Deploy Ubuntu
  - Instalação em segundo dispositivo; importação via NTFS; start; health; acesso por guichês.
- Fase 5: Relatórios e Gate
  - Publicar resultados em `testes.md`; atualizar `proximos_passos.md`; sugerir novos casos.

## Casos de Teste Prioritários
- Alternador de Guichê: chamar quando livre, finalizar quando em atendimento.
- Consistência preview JSED vs chamada real quando `algoritmo === 'jsed_fair_wrr'`.
- Aceitação de `mlHint` (top‑3 JSED, `score ≥ 0.65`, `latency ≤ 200 ms`).
- Notificações de correção (ausência/não comparecimento) com beep e UI.
- Destaque de `tempoLimiteAtingido` e persistência de estatísticas.
- Acessibilidade: foco visível, contraste AA, navegação por teclado.
- Performance: RTT de socket, tempo de quadro, orçamento de bundle.

## Procedimentos de Execução
- Produção (Windows):
  - Start: `v3/servers_inicializar/START.bat`.
  - Stop: `v3/servers_inicializar/STOP.bat`.
- Desenvolvimento (Windows):
  - Start: `v3/servers_inicializar/START_dev.bat` (usa `VITE_SERVER_URL`).
  - Stop: `v3/servers_inicializar/STOP_dev.bat`.
- Ubuntu (após instalar):
  - Montagem NTFS: `sudo mount -t ntfs3 -o ro /dev/<DISCO_PARTICAO> /mnt/win`.
  - Importar build: `sudo cp -r "/mnt/win/Users/Diego/Downloads/nodep/sgfila/build/SGFila" /opt/SGFila/`.
  - Start: `cd /opt/SGFila/SGFila/server/scripts && chmod +x start-sgfila.sh && ./start-sgfila.sh`.

## Métricas e Critérios de Aceite
- Socket: média < 100 ms, p95 < 200 ms.
- UI: quadro crítico ≤ 16 ms; TTI ≤ 1.5 s.
- Bundle: `app+vendor` gzip ≤ 250 KB; crescimento ≤ 10% por build.
- IA: `mlHint` aceito sob critérios; fallback sinalizado; telemetria gravada.

## Governança e Documentação
- Todas as saídas desta área serão registradas neste arquivo `engenharia_automacao.md`.
- Evidências, resultados e métricas consolidados em `testes.md`; planos e próximos passos em `proximos_passos.md`.
- Atualizações em documentos existentes devem preservar conteúdo e adicionar contexto/links.

## Próximos Passos (ação)
- Rodar automações na pasta oficial `build/SGFila` sem dependência de pendrive.
- Executar suíte inicial Playwright em produção local (START_build.bat).
- Implementar suíte Playwright mínima e smoke de socket; integrar reporting.
- Rodar validações completas e publicar evidências.

## Execução Registrada — 2025-11-23
- Preparação: `v3/e2e` criado com config e specs; instalação de browsers Playwright.
- Start produção: `v3/servers_inicializar/START_build.bat`.
- Testes: `npx playwright test`.
- Resultados: handshake Socket.IO e carga da UI bem sucedidos.
- Artefatos: `v3/e2e/test-results/`.
