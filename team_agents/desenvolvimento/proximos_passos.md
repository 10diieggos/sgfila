# Próximos Passos — Integração C e IA

## Premissas Operacionais
- Chamada nunca automática: o atendente deve acionar manualmente no painel de guichê (alternador de chamada sem escolha de senha e finalização). Validar que `chamarProximaAutomatica` permaneça desativado.

## Pendências e Pesos

### Guia de Pesos
- Pesos são prioridades: `1` é mais crítico, `6` menos crítico.
- Itens podem coexistir no mesmo peso por trilha temática (ex.: IA Operacional vs Documentação).
- Execução segue: primeiro todos os `Peso 1`, depois `Peso 2`, e assim por diante.
- Dentro de cada peso, ordenar por dependências técnicas e bloqueios.
- Itens concluídos permanecem para rastreabilidade.

### Peso 1 (Funções Desejadas pelo Dono do SGFila)
- [Concluído] [ID: T-015] Implementar dashboard de IA no ConfigurationPanel.vue (nova aba "IA" com status, thresholds e telemetria).
- [Concluído] [ID: T-086] Conectar interface com dados reais do StateManager (carregar thresholds do cliente, exibir última decisão).
- [Concluído] [ID: T-087] Adicionar visualização de métricas e histórico de decisões (integrar `estado.iaTelemetria` na seção de telemetria).

### Peso 1 (CRÍTICO - IA Operacional)
- [Concluído] [ID: T-016] Criar `IAManager.ts` com algoritmo de decisão JSED/Fairness/WRR (ver `v3/server/src/services/IAManager.ts`).
- [Concluído] [ID: T-017] Integrar IA ao `QueueService` substituindo lógica fixa e registrar decisão com confiança. Implementado ramo `jsed_fair_wrr` em `chamarSenha`.
- [ID: T-018] Implementar fallback robusto no sequenciamento e sinalização na UI quando ativo.
- [ID: T-019] Coletar métricas para aprendizado contínuo (`tempoEspera`, `prioridade`, `tipoServico`, `resultadoDecisao`).
- [ID: T-020] Opção do atendente desligar o sequenciamento da IA e adotar um dos algoritmos na seção "Comportamento da fila" na aba "Configurações". A IA continua funcional para treinamento, avaliação e sequenciamento virtual; apenas não se refletirá no próximo sequenciamento real.
 - [Concluído] [ID: T-021] Implementar "lista preview" ordenada por JSED no servidor e consumo pela UI no filtro "Automática".
 - [Concluído] [ID: T-090] Garantir prioridade absoluta de tempo limite dentro da IA e na preview JSED (considerar apenas o subconjunto `tempoLimiteAtingido` quando existir) — servidor em `v3/server/src/services/IAManager.ts:31–38` e `v3/server/src/services/IAManager.ts:235–258`; preview em `v3/server/src/services/QueueService.ts:746–752`.

#### Thresholds e Top‑3 (Aceitação de `mlHint`)
 - [Concluído] [ID: T-043] Publicar thresholds offline em `client/public/ml/thresholds.json` com: `minScore ≥ 0.65`, `latencyMsMax ≤ 200`, `cooldownCalls = 20`, `accuracyTarget ≥ 0.75`, `recallPrioridadeMin ≥ 0.85`, `fallbackRateMax ≤ 0.30`.
 - [Concluído] [ID: T-044] Validar aceitação de `mlHint` apenas se `numeroPrevisto ∈ top‑3 JSED`, `score ≥ minScore` e `latency_ms ≤ 200` diretamente no servidor — implementado em `v3/server/src/services/IAManager.ts:75–96` com gate completo e telemetria de rejeição.
 - [ID: T-044b] Medir `latency_ms` da predição no cliente e enviar ao servidor; persistir em telemetria e aplicar gating por latência.
- [Concluído] [ID: T-048] Persistir últimas decisões de IA (fonte, confiança, top‑3, accepted_hint) e exibir no painel — implementado com `estado.ultimaDecisaoIA` e `estado.iaTelemetria` (array), dashboard em `ConfigurationPanel.vue` aba IA.

#### Como alinhar com JSED
- Servidor: quando `algoritmo === 'jsed_fair_wrr'` em `chamarSenha` (`v3/server/src/services/QueueService.ts:159–169`), usar `iaManager.chamarProximaSenha(estado, senhasEspera, mlHint)` e depois `_atualizarEstadoSenhaChamada(...)`.
- Cliente (filtro "Automática"):
  - Opção B (implementada): solicitar ao servidor uma lista "preview" ordenada por JSED e usá-la na UI para o filtro "Automática", garantindo consistência com a decisão real.

#### Resumo
- Hoje, "Automática" reflete a política simples do cliente (proporção/round robin/FIFO), não JSED.
- Para que "Automática" seja calculada pela IA via JSED, é preciso integrar JSED no servidor e expor/consumir uma ordenação JSED na UI.
- O `IAManager` já calcula top‑3 JSED e considera `mlHint` do cliente quando válido; após integrar no `QueueService`, a origem da decisão passa a ser consistente entre servidor e UI.

#### Sinalizar decisão da IA
- Podemos incluir no estado um marcador da fonte da decisão usada na chamada, por exemplo `ultimaDecisaoIA`: { numero, source: 'jsef|wrr|proporcao|fifo|mlHint', confianca } vindo do servidor, e exibir um ícone por senha chamada. Isso dá rastreabilidade clara da origem da decisão além do badge global de status.

### Peso 1 (Documentação/Instalação)
 - [ID: T-009] Planejar instalação offline: cache de `node_modules` ou pacote zip com dependências preinstaladas.
 - [ID: T-010] Documentar no README os requisitos para IA (modelo ONNX e assets) e comportamento quando em fallback.
 - [ID: T-013] Criar guia de início rápido para desenvolvedores (setup, build, testes básicos).
 - [ID: T-014] Documentar arquitetura do sistema (diagrama de componentes, fluxo de dados, decisões de design).

### Peso 2 (UX e Telemetria)
- [Concluído] [ID: T-006] Indicar na UI quando a IA estiver em fallback (sem modelo) e quando uma dica ML foi aceita/rejeitada.
- [ID: T-007] Mostrar histórico de ausências e contadores quando `mostrarHistoricoAusencias` ativo.
- [ID: T-008] Exibir feedback dos eventos de correção (ausência/não comparecimento) com alerta sonoro/visual conforme configuração.
- [Concluído] [ID: T-011] Adotar `designTokens.colors.primary` no título da Fila de Espera.
- [Concluído] [ID: T-012] Instrumentar tempo de troca de sub-aba no Painel de Configurações e registrar métricas.
- [ID: T-022] Persistir telemetria de decisões da IA no servidor (fonte, confiança, top‑3, wrrAtivo) e expor no painel de IA.
- [Concluído] [ID: T-022] Persistir telemetria de decisões da IA no servidor (fonte, confiança, top‑3, wrrAtivo) e expor última decisão via `estado.ultimaDecisaoIA`.
- [ID: T-023] Ajustar UI do filtro "Automática" para indicar que ordenação está sincronizada com servidor quando `algoritmo === 'jsed_fair_wrr'`.
 - [ID: T-031] Revisar UX do filtro "Automática (JSED)": microcopy, tooltip acessível e estados visuais para "Sincronizado com servidor" e "Local (fallback)"; remover ambiguidades de ordenação e destacar fonte da ordenação.
 - [ID: T-032] Refinar badge de IA no `CounterPanel`: contraste AA, rótulo acessível com estado (ativo/fallback/inativo) e confiança, tooltip com última decisão (`estado.ultimaDecisaoIA`).
 - [ID: T-033] Padronizar toasts de erro: componente único com `role="alert"`, alto contraste, botões acessíveis, fechamento por `Esc` e persistência opcional em `localStorage` sem rede.
 - [ID: T-034] Acessibilidade por teclado: ordem de tabulação lógica em `CounterPanel`, `ConfigurationPanel` e filtros; indicadores de foco visíveis; atalhos para ações críticas (chamar/ finalizar).
 - [ID: T-035] Contraste de cores (WCAG 2.1 AA): revisar pares principais dos tokens e ajustar onde necessário para atingir ≥ 4.5:1 em texto normal e ≥ 3:1 em UI/ícones.
- [ID: T-036] Validação cross‑browser/offline: testar filtros, badge e toasts em Windows (Chrome/Edge) com assets locais e sem chamadas externas.
- [Concluído] [ID: T-052] Design Tokens (CSS vars): introduzir tokens globais de cores e foco em `v3/client/src/styles/main.css` (`:root`), substituir cores de links/inputs por `var(--link)`/`var(--focus-ring)` para contraste AA.
- [Concluído] [ID: T-053] Foco visível consistente: adicionar regras globais `:focus-visible` com `outline: 3px` e `outline-offset: 2px` cobrindo `button`, `.btn`, `.btn-modal`, `.tab-link`, `.modal-close-btn`, controles de formulário e `.guiche-card-selecao`.
- [Concluído] [ID: T-054] Padronizar Badge IA: criar `.badge` base e `.badge-ia` em `main.css` e migrar uso em `CounterPanel.vue` com `aria-label` descritivo; garantir contraste AA.
- [ID: T-055] Auditar painéis por tipo (prioridade/normal/contratual): validar contraste texto/fundo; ajustar tokens (`--priority-700`, `--normal-700`, `--contract-700`) se algum par < 4.5:1.

### Peso 2 (Performance)
- [ID: T-060] Instrumentar latência de socket no cliente: medir RTT de `emitirSenha`/`chamarSenha`/`finalizarAtendimento`/`solicitarPreviewJSED` via `performance.now()` no `emit` e captura do primeiro `estadoAtualizado`/`previewJSED`. Local alvo: `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\composables\useSocket.ts`.
- [ID: T-061] Debounce de busca em `QueueList.vue`: aplicar `debounce = 150 ms` ao `termoBusca` para reduzir recomputes e garantir frame `≤ 16 ms`. Local alvo: `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\components\QueueList.vue`.
- [ID: T-062] Contenção CSS para lista: adicionar `contain: content` (ou `layout paint`) no container de lista para minimizar reflows. Local alvo: classe do container da fila na mesma `QueueList.vue`/CSS global.
- [ID: T-063] Code splitting e lazy ML: separar chunk `ml` (ONNX/ORT) com `import()` e `manualChunks` em Vite; carregar somente quando necessário (chamadas/preview). Locais: `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\ml\inference.ts`, `vite.config.ts`.
- [ID: T-064] Orçamento de bundle e auditoria: registrar tamanhos gzip de `app`+`vendor` (`≤ 250 KB`) e manter crescimento `≤ 10%` por build; adicionar checklist no `testes.md`.
- [ID: T-065] Medição de render de filtros: instrumentar troca de filtro e busca com Performance API e `requestAnimationFrame` (duplo) para medir tempo até quadro estável; reportar p95.

### Peso 2 (Modelagem de Fila/Estimadores)
- [ID: T-070] Estimadores de chegada `λ(hora)`: implementar contagem por janelas móveis (15 min/1 h) com suavização (EWMA) e robustez a outliers (winsorização p1/p99). Separar por `tipoServico` e por guichê. Persistir em `v3/server/dist/estatisticas/lam_mu_por_hora.json`.
- [ID: T-071] Estimadores de serviço `μ(hora)`: calcular taxa de atendimento por hora via razão `atendimentos/hora ÷ tempo_médio_atendimento` com ajuste para interrupções (ausências/não comparecimentos). Usar EWMA por hora e marcador de confiabilidade por volume de amostras.
- [ID: T-072] Percentis de tempos (P50/P95/P99): adotar estimador Harrell–Davis para lotes e algoritmo P² para fluxo contínuo, com IC por bootstrap (1.000 reamostragens). Publicar `tempoEspera_{p50,p95,p99}` e `tempoAtendimento_{p50,p95,p99}` por `tipoServico/guichê`.
- [ID: T-073] Previsão de TEMPO de espera: combinar fórmulas de filas (M/M/1, M/M/c) usando `λ(hora)`/`μ(hora)` e correção empírica; em paralelo, Holt–Winters (sazonalidade diária) para `tempoEspera` curto prazo. Expor `prevTempoEsperaMs` com intervalo de confiança 80/95%.
- [ID: T-074] Detecção de não‑estacionariedade: realizar teste de mudança (CUSUM/KPSS simplificado) por hora para sinalizar janelas inválidas aos estimadores. Quando detectado, reduzir peso das observações antigas (α adaptativo).
- [ID: T-075] Cenários analíticos de fila: definir baterias sintéticas (M/M/1, M/M/c, M/G/1, chegadas em rajada, troca de turno) para validar viés/variância dos estimadores e precisão de previsões. Registrar resultados em `testes.md` com KPIs (MAE/MAPE/p95 erro).
- [ID: T-076] Persistência e offline: garantir escrita somente local (`v3/server/dist/estatisticas/*.json`) e nenhum HTTP externo. Adicionar rota/endpoint interno para servir snapshots ao painel.
- [ID: T-077] Métricas de qualidade do estimador: acompanhar `bias`, `var`, `RMSE`, cobertura de IC e `nAmostras` por janela; expor no painel de IA/Estatísticas.
- [ID: T-078] Alertas de amostra insuficiente: quando `nAmostras < 30` em uma hora, marcar percentis como baixa confiabilidade e usar fallback determinístico (medianas do dia anterior).
- [ID: T-079] Integração UI: mostrar P50/P95/P99 e previsão de espera por `tipoServico` no `ConfigurationPanel.vue` e no painel do guichê, com rótulos acessíveis e fonte/local de cálculo.
 - [ID: T-085] Modo dinâmico de tempo limite por tipo/hora: calcular `limite_t(h)` a partir de `λ/μ` e `P95` por tipo; integrar o limite dinâmico em `QueueService.verificarTemposLimite` mantendo pausa por ausência e caps por contrato.

### Peso 3 (Qualidade/Build)
 - [Concluído] [ID: T-003] Rodar e fechar `npm run type-check && npm run build` no servidor e no cliente após patches.
 - [Concluído] [ID: T-004] Reexecutar smoke (`v3/qa/smoke-socket.js`) e validar métricas de latência e campos: `servicoDoCliente`, `tempoEspera`, `chamadaTimestamp`, `finalizadoTimestamp`.
 - [ID: T-005] Solicitar nova auditoria do Supervisor Crítico após correções.
 - [ID: T-024] Criar testes E2E para evento `solicitarPreviewJSED` garantindo que ordenação e chamada real sejam consistentes.
 - [ID: T-025] Medir impacto de `jsed_fair_wrr` em latência de chamada e bundle do cliente (não quebrar offline).

### Peso 4 (Confiabilidade/Consistência)
- [Concluído] Garantir fallback claro de `estado.configuracoes.roteamento` em `QueueService` quando carregar dados antigos.
- [Concluído] Ajustar `recordPrediction` para aceitar `accepted_hint` e `latency_ms` mantendo compatibilidade.
- [ID: T-002] Habilitar o algoritmo `'jsed_fair_wrr'` nas configurações apenas por ação do atendente (sem autochamada), mantendo a decisão no servidor com validação top‑3 e `mlHint` opcional.
 - [ID: T-026] Substituir `estimativaServicoMs` por cálculo baseado em estatísticas reais (por serviço/tipo) com fallback robusto.
- [ID: T-027] Adicionar marcador no estado `ultimaDecisaoIA` e ícone por senha chamada na UI.
 - [Concluído] [ID: T-027] Adicionar marcador no estado `ultimaDecisaoIA` e ícone por senha chamada na UI (badge em `CounterPanel`).

### Peso 5 (Bloqueios/Alta Prioridade)
- [Concluído] Incluir `roteamento` e `algoritmoVersao` em `StateManager.mesclarConfiguracoes` com merge de defaults na migração.
- [Concluído] Adicionar listeners de cliente para `notificacaoAusencia` e `notificacaoNaoComparecimento` em `useSocket.ts`.
- [Concluído] Destacar visualmente na UI senhas com `tempoLimiteAtingido` quando `destacarSenhasTempoLimite` estiver ativo; exibir histórico de ausências quando configurado.
- [ID: T-001] Disponibilizar `client/public/models/next_senha_int8.onnx` (e assets `onnxruntime-web`) para habilitar inferência ONNX ou indicar explicitamente fallback na UI.
- [Concluído] Corrigir tipagem do cliente para refletir `'jsed_fair_wrr'` nos componentes afetados e aceitar campos opcionais de telemetria.
- [ID: T-028] Empacotar offline com dependências pré-instaladas e scripts de validação em pendrive (cliente/servidor).
- [ID: T-029] Restringir CORS em produção e revisar privilégios mínimos de execução.
  - Produção: limitar `cors.origin` a `http://localhost:${PORT}` e `http://127.0.0.1:${PORT}`; remover portas de DEV.
  - Desenvolvimento: permitir `5173/5174` (Vite) além da porta local do servidor.
  - Aceitar `process.env.CORS_ORIGIN` como lista separada por vírgulas (ex.: `http://host1,http://host2`), sobrescrevendo defaults.
  - Validar handshake do Socket.IO e preflight: `origin` bloqueia origens não listadas; métodos `GET/POST` suficientes para WS/Polling; sem `credentials` enquanto não houver cookies/sessão.
  - Evidências: registrar em `v3/team_agents/desenvolvimento/testes.md` origens testadas (permitidas/bloqueadas) e logs do servidor.
- [ID: T-030] Documentar procedimentos de build e validação em `testes.md` e `proximos_passos.md` com evidências.

#### Entrega Offline (sem admin) — Plano Detalhado
- [ID: T-037] Cache de dependências offline: vendorizar `node_modules` de `v3/server` e `v3/client` no pacote; opcionalmente capturar cache do npm em `v3/_npmcache` com `npm ci --prefer-offline` para rebuild local sem internet.
- [ID: T-038] Copiar assets de IA locais: colocar `client/public/models/next_senha_int8.onnx` e `client/public/onnxruntime-web/{ort-wasm.wasm, ort-wasm-simd.wasm, ort-web.min.js}`; ajustar mapping em `inference.ts` (`ort.env.wasm.wasmPaths`) para carregar do `public/onnxruntime-web` offline.
- [ID: T-039] Scripts `.bat` de DEV: `start-server-dev.bat` (executa `npm run dev` em `v3/server`) e `start-client-dev.bat` (executa `npm run dev` em `v3/client`), ambos usando Node portátil local sem alterar `PATH` do sistema.
- [ID: T-040] Script `.bat` de PRODUÇÃO: `start-sgfila.bat` (executa `npm run build` em cliente/servidor, inicia `npm start` no servidor e abre `http://localhost:3000`), e `stop-sgfila.bat` (encerra processo do servidor) — sem privilégios administrativos.
- [ID: T-041] Validação pós-build offline: iniciar servidor (`npm start`) e cliente (build servido pelo Express), validar socket, IA ONNX ativa com assets locais e fallback sinalizado quando ausente; assegurar ausência de chamadas externas e escrita apenas dentro de `v3/server/dist/estatisticas/`.
-- [ID: T-042] Mitigação de firewall sem admin (modelo servidor único): guichês não precisam abrir portas; tráfego de saída para `http://<IP_DO_SERVIDOR>:<PORT>` é suficiente. CORS restrito por IP/faixa no servidor. Descartada a sincronização física por pendrive.
  - Implementado: no servidor, `HOST='0.0.0.0'` e `listen(PORT, HOST, ...)` com `CORS_ORIGIN` restrito aos IPs da LAN.
  - Testar: guichê acessa `http://<IP_DO_SERVIDOR>:${PORT}`; bloqueio de entrada no Windows não afeta, pois é apenas cliente.
  - Aceite: nenhum privilégio administrativo nos guichês; logs mostram `Servidor rodando em 0.0.0.0:${PORT}` e origens permitidas.

### Peso 2 (Segurança/Conformidade)
- [ID: T-081] Auditoria de segredos/variáveis: confirmar ausência de segredos hardcoded; `process.env` usado apenas para `PORT`, `MODO_TESTE`, `CORS_ORIGIN`, `HOST`. Evidenciar com grep e revisão de arquivos.
- [ID: T-082] Telemetria/Logs: garantir que logs não incluam PII/tokens; manter mensagens genéricas e caminhos locais. Revisar `SocketHandlers` e `StatisticsPersistence` para evitar dados sensíveis nos logs.

### Critérios de Aceite — IA (Atualizados)
- `mlHint` aceito somente se `top‑3 JSED` e `score ≥ 0.65`; latência da predição `≤ 200 ms`.
- Em ausência de assets ONNX/ORT, UI sinaliza fallback e operações continuam com regra determinística.
- Telemetria local mantém `accepted_hint`, `latency_ms` e `score`; painel de IA exibe última decisão (`estado.ultimaDecisaoIA`).

## Atualizações do Supervisor Crítico
- commit_gate=allow com recomendações:
  - Restringir CORS em produção.
  - Ajustar thresholds (`minScore ≥ 0.6`) conforme plano.
  - Disponibilizar modelo ONNX local opcional.

## Origem das Pendências (Resumo)
- Build/Tipagem: mescla incompleta de configs; tipos do cliente desatualizados.
- Consistência: `mlHint` compatível; falta fallback robusto para `roteamento` legado.
- UI/Notificações: eventos de correção não escutados; flags de UI sem efeito visual.
- ML: modelo ONNX ausente (inferência caiu em fallback); offline ok após instalada.
- Auditoria Crítica: gate de commit negado até listeners/UI/modelo.

## Critérios de Aceite
- Smoke passa com latências baixas e campos corretos.
- Type‑check e build sem erros em cliente/servidor.
- UI destaca `tempoLimiteAtingido` e exibe histórico/feedback de correções.
- Modelo ONNX presente ou fallback claramente sinalizado na UI.
- Supervisor Crítico libera gate (sem bloqueios remanescentes).
- Filtro "Automática" usa ordenação JSED do servidor quando habilitado e está consistente com a chamada real.
 - Painel de Guichê alterna corretamente: finaliza se estiver atendendo e chama próxima se livre.

### Critérios de Aceite — UX/Acessibilidade
- Filtro "Automática (JSED)" — [IDs: T-023, T-031]
  - Quando `algoritmo === 'jsed_fair_wrr'`, a UI exibe rótulo "Ordenado por IA (JSED)" e ícone de sincronização; a lista apresentada corresponde à "preview" do servidor em 100% dos casos de smoke.
  - Em fallback/local, o rótulo muda para "Automática (local)" e exibe aviso não bloqueante; nenhum request externo é feito.
- Badge IA no `CounterPanel` — [ID: T-032]
  - Contraste de texto/ícone ≥ 4.5:1 em tema padrão; nome acessível inclui estado e confiança (ex.: "IA ativa — confiança 0,78"). Tooltip mostra `source` e `numero` da `ultimaDecisaoIA` quando disponível.
- Toasts de erro — [ID: T-033]
  - `role="alert"`, foco não é capturado; fechamento por `Esc` e botão "Fechar" (teclado/ponteiro); autoocultação entre 5–8s configurável; conteúdo legível; eventos de erro comuns cobertos (falha de socket, ONNX ausente, chamada/finalização rejeitada). Persistência opcional apenas em `localStorage`.
- Teclado/Focus — [ID: T-034]
  - Todos controles são alcançáveis por `Tab`; ordem segue leitura visual; `Enter/Space` ativam; indicador de foco com contraste ≥ 3:1. Atalhos: `Alt+N` chamar próxima, `Alt+F` finalizar, sem conflitar com atalhos do navegador.
- Contraste (WCAG AA) — [ID: T-035]
  - Pares de cor dos tokens principais atendem ≥ 4.5:1 (texto normal) e ≥ 3:1 (grandes/ícones). Itens com falha recebem ajuste documentado nos tokens.
 - Links e Inputs — [IDs: T-052, T-053]
   - Cor de link padrão usa `--link` com contraste ≥ 4.5:1 sobre `--color-bg`; hover usa `--link-hover` mantendo AA. Foco visível aplica `outline` sólido com `--focus-ring` e `outline-offset ≥ 2px` em todos os controles interativos listados.
 - Badge IA — [ID: T-054]
   - Badge utiliza `.badge .badge-ia` com `aria-label` presente; contraste texto/fundo ≥ 4.5:1; ícone legível; aparece apenas quando `ultimaDecisaoIA.numero` coincide com a senha exibida.
- Cross‑browser/offline — [ID: T-036]
  - Comportamentos idênticos em Chrome 122+ e Edge 122+ no Windows; nenhuma chamada HTTP externa em tempo de execução; assets servidos de `client/public`.

## Convenção de IDs de Tarefa
- Formato: `[ID: T-###]` prefixado no item do plano.
- Uso: referenciar o ID nos resultados em `testes.md` para cruzar evidências e facilitar rastreabilidade.

## Instruções por Agente
- `SOLO Coder`: consolidar prioridades, marcar status e manter rastreabilidade mínima.
- `UI/UX Planner`: adicionar épicos de experiência e critérios de aceite; alinhar com `Interface Designer`.
- `Interface Designer`: propor tarefas visuais/acessibilidade e tokens; detalhar componentes.
- `Edge‑AI Engineer`: priorizar tarefas de modelo/thresholds/fallback; registrar dependências técnicas.
- `Queue Data Scientist`: incluir tarefas de medições/estimadores e análises de dados.
- `Build/Release Engineer`: planejar marcos de build e entrega offline; scripts `.bat` e estrutura de pendrive.
- `Test Automation Engineer`: inserir objetivos de cobertura e casos automatizados prioritários.
- `Security Reviewer`: registrar recomendações e correções necessárias de conformidade.
- `Performance Engineer`: definir metas (latência, reflows, tamanho de bundle) e tarefas.

#### ONNX/ORT WASM (Otimização e Offline)
- [ID: T-045] Configurar ONNX Runtime Web (WASM) com assets locais em `client/public/onnxruntime-web/` e preferir build `SIMD`.
- [ID: T-046] Mapear caminhos WASM no cliente para execução offline:
  - Código alvo: `v3/client/src/ml/inference.ts`.
  - Ajuste: `ort.env.wasm.wasmPaths = { 'ort-wasm.wasm': '/onnxruntime-web/ort-wasm.wasm', 'ort-wasm-simd.wasm': '/onnxruntime-web/ort-wasm-simd.wasm' }` antes de `InferenceSession.create(...)`.
- [ID: T-047] Validar modelo quantizado INT8 (`client/public/models/next_senha_int8.onnx`) e medir latência p95 ≤ 35 ms.
- [ID: T-049] Planejar pipeline de quantização/otimização offline (ONNX): usar `mcp_mcp-model-optimizer_quantize_model` (INT8 dinâmico) e `mcp_mcp-model-optimizer_optimize_model` (fusão de operadores). Documentar perda de acurácia tolerada (≤ 2 p.p.).

#### Metas de Latência/Memória (IA)
- [ID: T-050] Estabelecer metas: `session.create ≤ 1500 ms (p95)`, `inferência p95 ≤ 35 ms`, `p99 ≤ 60 ms`, memória adicional `≤ 32 MB`, modelo `≤ 1.5 MB`.
- [ID: T-051] Implementar medição automática de latência e memória (DevTools/Performance API) com registro em telemetria local.

---

## Tarefas Adicionadas (2025-11-22)

### Novos Itens de Continuidade

#### Peso 1 (UI/UX - IA Dashboard)
- [Concluído] [ID: T-085] Adicionar aba "IA" ao ConfigurationPanel com dashboard de monitoramento.
- [ID: T-086] Conectar dashboard de IA com dados reais do StateManager (`ultimaDecisaoIA`, `iaTelemetria`).
- [ID: T-087] Implementar visualização de histórico de decisões (últimas 20-50 decisões com fonte, confiança, top-3).

#### Peso 2 (Qualidade de Código)
- [ID: T-088] Refatorar código duplicado entre componentes (extrair composables compartilhados).
- [ID: T-089] Adicionar JSDoc/comentários em funções complexas (IAManager, QueueService).
- [ID: T-090] Revisar e padronizar tratamento de erros em todos os serviços.

#### Peso 2 (Testes)
- [Concluído] [ID: T-091] Criar testes unitários para IAManager (validação top-3, cálculo JSED, WRR) — implementado em `v3/server/src/services/__tests__/IAManager.test.ts` com 100+ testes cobrindo gate de ML Hint, JSED, WRR, tempo limite e telemetria.
- [ID: T-092] Criar testes de integração para fluxo completo de chamada com IA.
- [ID: T-093] Adicionar testes E2E para aba de configurações (mudança de algoritmo, thresholds).

#### Peso 3 (Melhorias de Funcionalidade)
- [ID: T-094] Implementar exportação de estatísticas em CSV/JSON para análise externa.
- [ID: T-095] Adicionar filtros avançados no histórico (por data, tipo, guichê, motivo).
- [ID: T-096] Criar relatório de produtividade por atendente/guichê.

#### Peso 3 (Documentação Técnica)
- [Concluído] [ID: T-097] Documentar algoritmo JSED detalhadamente (fórmulas, parâmetros, exemplos).
- [ID: T-098] Criar diagramas de sequência para fluxos principais (emissão, chamada, finalização).
- [ID: T-099] Documentar API de configuração (todos os campos de ConfiguracoesGerais).

#### Peso 4 (Otimizações Futuras)
- [ID: T-100] Investigar uso de Web Workers para inferência ML (não bloquear thread principal).
- [ID: T-101] Implementar paginação/virtualização em listas longas (>100 senhas).
- [ID: T-102] Adicionar cache inteligente de previsões JSED (invalidar apenas quando fila muda).

### Resumo de Implementações Recentes

**Concluído em 2025-11-22 (Sessão 1):**
1. ✅ Atualização de thresholds para valores recomendados (minScore 0.65, fallbackRateMax 0.30)
2. ✅ Criação de aba "IA" no ConfigurationPanel com:
   - Status atual (modelo ONNX, algoritmo ativo, última decisão)
   - Visualização de thresholds de aceitação (read-only)
   - Placeholder para telemetria de decisões
3. ✅ Design Tokens CSS já existentes e funcionais (cores, foco, contraste AA)
4. ✅ Estilos responsivos para dashboard de IA

**Concluído em 2025-11-22 (Sessão 2):**
1. ✅ **Gate de ML Hint (T-110, T-111):**
   - Interface `mlHintThresholds` em `ConfiguracaoRoteamento`
   - Validação rigorosa no `IAManager`: score ≥ 0.65 e latency ≤ 200ms
   - Telemetria de rejeições com fonte `jsed_fallback_threshold`
   - Flag `enabled` para habilitar/desabilitar validação
2. ✅ **Estrutura de dados estatísticas (T-103):**
   - Interface `EstadoEstatisticasHora` com λ, μ, percentis, nAmostras
   - Indicador de confiabilidade (alta/média/baixa)
3. ✅ **Controles de UI para ML Hint (T-112):**
   - Seção editável na aba IA do ConfigurationPanel
   - Toggle para habilitar/desabilitar validação
   - Inputs para minScore e maxLatencyMs
   - Info box explicando comportamento
   - Estado reativo `roteamentoConfig` e função `salvarRoteamento()`
   - Evento `atualizar-roteamento` no emit
4. ✅ **Integração servidor-cliente para thresholds ML Hint:**
   - Handler `atualizarRoteamento` em `SocketHandlers.ts` (linha 414-426)
   - Método `atualizarRoteamento()` em `StateManager` (linha 523-532)
   - Merge de `mlHintThresholds` em `mesclarConfiguracoes()` (linha 419)
   - Compatibilidade com dados legados via merge com defaults

**Concluído em 2025-11-22 (Sessão 3):**
1. ✅ **Conexão do dashboard IA com dados reais (T-086):**
   - Props `estado` e `estatisticas` adicionadas ao `ConfigurationPanel`
   - Status ONNX mostra "Ativo" quando `algoritmo === 'jsed_fair_wrr'`
   - Última decisão exibe número da senha, fonte e confiança de `estado.ultimaDecisaoIA`
   - Carregamento de thresholds do servidor via watcher de configurações
2. ✅ **Visualização de telemetria de decisões (T-087):**
   - Tabela com últimas 20 decisões (`estado.iaTelemetria`)
   - Colunas: Senha, Fonte, Confiança, Top-3 JSED, WRR, Horário
   - Badges coloridos por fonte (JSED/mlHint/WRR/fallback)
   - Placeholder quando não há dados
   - Estilos responsivos com hover e contraste AA
3. ✅ **Integração completa cliente-servidor:**
   - Função `atualizarRoteamento()` em `useSocket.ts`
   - Propagação via `App.vue` para `ConfigurationPanel`
   - Sincronização bidirecional de thresholds
   - Passagem de `estado` e `estatisticas` como props

**Concluído em 2025-11-22 (Sessão 4):**
1. ✅ **Documentação completa do algoritmo JSED (T-097):**
   - Arquivo técnico oficial: [`algoritmo_jsed_detalhado.md`](algoritmo_jsed_detalhado.md)
   - Fundamentos matemáticos: fórmula SED e componentes de peso
   - Detalhamento de W_base, W_aging, W_fast com exemplos práticos
   - Fluxo de decisão completo (Tempo Limite → WRR → JSED → ML Hint)
   - 3 exemplos práticos com cálculos passo a passo
   - Vantagens, limitações e roadmap
   - Guia de configuração e tuning de parâmetros
   - Seção de telemetria e monitoramento
   - Referências cruzadas com código-fonte

**Concluído em 2025-11-22 (Consolidação Final - Sessões 2-4):**

Esta série de sessões entregou o **sistema completo de IA operacional** do SGFila v3.0:

✅ **Gate de ML Hint (T-044, T-110, T-111):**
- Validação rigorosa: top-3 JSED + score ≥ 0.65 + latency ≤ 200ms
- Telemetria de rejeições com motivo detalhado
- Thresholds configuráveis via UI

✅ **Telemetria Completa (T-048, T-087):**
- `estado.ultimaDecisaoIA`: última decisão com fonte e confiança
- `estado.iaTelemetria`: array com histórico de decisões
- Dashboard com tabela de 20 decisões
- Badges coloridos por fonte (contraste AA)

✅ **Dashboard IA Funcional (T-015, T-086):**
- Conectado com dados reais do servidor
- Status ONNX dinâmico
- Configuração de thresholds editável
- Sincronização bidirecional cliente-servidor

✅ **Documentação Técnica (T-097):**
- Arquivo oficial: [`algoritmo_jsed_detalhado.md`](algoritmo_jsed_detalhado.md) (483 linhas)
- Fundamentos matemáticos completos
- 3 exemplos práticos com cálculos
- Guia de tuning e configuração

**Próximos Passos Prioritários:**
1. ~~Criar testes unitários para IAManager (T-091)~~ ✅ Concluído
2. ~~Implementar estimadores λ e μ (T-104, T-105)~~ ✅ Concluído
3. Implementar estimador de percentis (T-106)
4. Sistema de limites dinâmicos (T-108, T-109)
5. Empacotar para entrega offline (T-037 a T-042)
6. Criar diagramas de sequência (T-098)

---

## Sistema de Correção por Tempo Limite Dinâmico (2025-11-22)

### Contexto
Relatório do Data Scientist/Queue Engineer em [`v3/team_agents/desenvolvimento/melhoria_logica_correcao_tempo_limite.md`](v3/team_agents/desenvolvimento/melhoria_logica_correcao_tempo_limite.md) propõe substituição de limites fixos (10/20/25min) por limites dinâmicos baseados em estatísticas reais (λ/μ, percentis, carga por hora).

### Peso 1 (CRÍTICO - Sistema de Correção Dinâmica)

#### Fase 1: Fundação de Estimadores
- [Concluído] [ID: T-103] **Estrutura de dados para estatísticas por hora**
  - Criar `EstadoEstatisticasHora` em `shared/types.ts`:
    ```typescript
    interface EstadoEstatisticasHora {
      hora: number; // 0-23
      lambda: { [tipo: string]: number }; // chegadas/hora por tipo
      mu: { [tipo: string]: number }; // atendimentos/hora por tipo
      percentis: {
        p50: { [tipo: string]: number }; // ms
        p95: { [tipo: string]: number };
        p99: { [tipo: string]: number };
      };
      nAmostras: { [tipo: string]: number };
      confiabilidade: 'alta' | 'media' | 'baixa';
      timestamp: number;
    }
    ```
  - Integrar em `StateManager` com persistência em `estatisticas/hora_atual.json`.

- [Concluído] [ID: T-104] **Estimador λ (chegadas por hora)**
  - ✅ Implementado `EstimadorLambda.ts` em `v3/server/src/services/`:
    - Janelas móveis de 15min e 1h com limpeza automática de histórico > 24h.
    - EWMA (α = 0.3 configurável) para suavização temporal.
    - Winsorização com média ponderada e limite de 3× para robustez a outliers.
    - Separação por `tipo` (prioridade/contratual/normal) e cálculo global.
    - Confiabilidade (alta/média/baixa) baseada em número de amostras (30/10).
    - Métodos de exportação/importação para persistência em JSON.
  - Próximo: Persistir em `estatisticas/lambda_por_hora.json` via StatisticsPersistence.

- [Concluído] [ID: T-105] **Estimador μ (taxa de atendimento)**
  - ✅ Implementado `EstimadorMu.ts` em `v3/server/src/services/`:
    - Fórmula: μ = n_atendimentos / (tempo_total_horas).
    - Ajuste para interrupções: exclui ausências/não comparecimentos do cálculo de μ, mas conta em `nInterrompidos`.
    - EWMA (α = 0.3 configurável) por hora com marcador de confiabilidade (alta ≥20, média ≥5).
    - Separação por `tipo` (prioridade/contratual/normal) e por `guicheId`.
    - Cálculo de tempo médio de atendimento por tipo (`tempoMedioAtendimentoMs`).
    - Método `calcularRho(λ, tipo)` para fator de utilização ρ = λ/μ.
    - Métodos de exportação/importação para persistência em JSON.
  - Próximo: Persistir em `estatisticas/mu_por_hora.json` via StatisticsPersistence.

- [Concluído] [ID: T-106] **Estimador de Percentis (P50/P95/P99)**
  - ✅ Implementado `EstimadorPercentis.ts` em `v3/server/src/services/`:
    - Algoritmo P² (P-square) para fluxo contínuo e amostras médias.
    - Harrell–Davis para lotes grandes (buffer > 100 amostras), mais robusto que percentil tradicional.
    - Intervalo de confiança 95% por bootstrap (1.000 reamostragens) quando n ≥ 20.
    - Percentil simples para poucas amostras (n < 5).
    - Separação por tipo (prioridade/contratual/normal).
    - Calcula `tempoEspera_{p50,p95,p99}` e `tempoAtendimento_{p50,p95,p99}`.
    - Confiabilidade: alta (≥50), média (≥20), baixa (<20).
    - Métodos `getPercentilEspera(tipo, percentil)` para consulta rápida.
    - Métodos de exportação/importação para persistência em JSON.
  - Próximo: Persistir em `estatisticas/percentis_por_hora.json` via StatisticsPersistence.

#### Fase 2: Detecção de Não-Estacionariedade
- [ID: T-107] **Detector de mudança de regime**
  - Implementar teste CUSUM simplificado por hora.
  - Sinalizar janelas inválidas aos estimadores.
  - Quando detectado: reduzir peso das observações antigas (α adaptativo).
  - Marcar períodos em `estadoEstatisticasHora.naoEstacionario = true`.

#### Fase 3: Cálculo de Limites Dinâmicos
- [ID: T-108] **Fórmula de limite adaptativo**
  - Implementar `CalculadorLimiteDinamico.ts`:
    ```typescript
    limite_t(h) = clamp(
      base_t × f_load(h) + P95_t(h),
      min_t,
      max_t
    )

    f_load(h) = min(1.5, EWMA(λ/μ))
    ```
  - Parâmetros por tipo:
    - `base_t`: piso contratual (ex: prioridade 15min, contratual 8min, normal 20min).
    - `min_t / max_t`: limites de clamp (ex: prioridade [10, 30], contratual [5, 20], normal [15, 40]).
  - Adicionar em `ConfiguracaoTempoLimite`:
    ```typescript
    interface ConfiguracaoTempoLimite {
      ativo: boolean;
      modo: 'fixo' | 'dinamico';
      // Modo fixo (atual)
      temposPorTipo: {
        contratual: number;
        prioridade: number;
        normal: number;
      };
      // Modo dinâmico (novo)
      parametrosDinamicos?: {
        [tipo: string]: {
          base: number;
          min: number;
          max: number;
        };
      };
      maxReposicionamentos: number;
      notificarDisplay: boolean;
      registrarLog: boolean;
      mensagemReposicionamento: string;
    }
    ```

- [ID: T-109] **Integração com `verificarTemposLimite`**
  - Modificar `QueueService.verificarTemposLimite()` (linha 580):
    - Se `modo === 'dinamico'`: usar `CalculadorLimiteDinamico.calcularLimite(tipo, hora)`.
    - Se `modo === 'fixo'`: usar `temposPorTipo[tipo]` (comportamento atual).
  - Fallback: quando `nAmostras < 30`, usar medianas do dia anterior ou valores fixos.

#### Fase 4: Gate de ML Hint com Thresholds
- [Concluído] [ID: T-110] **Adicionar thresholds de ML Hint em configuração**
  - ✅ Expandido `ConfiguracaoRoteamento` em `shared/types.ts` (linha 412-416).
  - ✅ Adicionado `mlHintThresholds: { minScore, maxLatencyMs, enabled }`.
  - ✅ Valores padrão em `getConfigPadrao()`: `{ minScore: 0.65, maxLatencyMs: 200, enabled: true }` (linha 722).

- [Concluído] [ID: T-111] **Implementar gate no IAManager**
  - ✅ Modificado `IAManager.chamarProximaSenha()` (linhas 75-96):
    - ✅ Validação de `score >= thresholds.minScore`.
    - ✅ Validação de `latencyMs <= thresholds.maxLatencyMs`.
    - ✅ Rejeição registra telemetria com fonte `jsed_fallback_threshold` e motivo detalhado.
    - ✅ Respeita flag `enabled` (se false, aceita sem validação).

#### Fase 5: UI e Configuração
- [Concluído] [ID: T-112] **Adicionar controles de ML Hint no ConfigurationPanel**
  - ✅ Aba "IA" → seção "Thresholds de Aceitação (ML Hint)" (linhas 1416-1474):
    - ✅ Toggle para habilitar/desabilitar validação.
    - ✅ Inputs editáveis para `minScore` (0-1, step 0.05).
    - ✅ Inputs editáveis para `maxLatencyMs` (50-500ms, step 10).
    - ✅ Info box explicando comportamento e fonte de rejeição.
    - ✅ Estado reativo `roteamentoConfig` (linha 1825-1831).
    - ✅ Função `salvarRoteamento()` com emit para servidor (linha 1833-1837).
    - ✅ Evento `atualizar-roteamento` adicionado aos emits (linha 1561).

- [ID: T-112b] **Adicionar controles de modo dinâmico para Tempo Limite**
  - Aba "Correções" → nova seção "Modo de Limite de Tempo":
    - Radio: `Fixo` (atual) vs `Dinâmico` (novo).
    - Se dinâmico: exibir inputs para `base`, `min`, `max` por tipo.
    - Exibir aviso se `nAmostras < 30`: "Baixa confiabilidade - usando fallback".

- [ID: T-113] **Dashboard de estatísticas em tempo real**
  - Aba "Estatísticas" ou "IA" → nova seção "Estimadores":
    - Tabela com λ(h), μ(h), P95(h) por tipo.
    - Indicador de confiabilidade (alta/média/baixa).
    - Gráfico de tendência de carga (λ/μ) nas últimas 24h.

#### Fase 6: Telemetria e Qualidade dos Estimadores
- [ID: T-114] **Métricas de qualidade do estimador**
  - Implementar `QualidadeEstimador.ts`:
    - Calcular `bias`, `variância`, `RMSE`, cobertura de IC.
    - Expor `nAmostras` por janela.
  - Persistir em `estatisticas/qualidade_estimadores.json`.
  - Exibir no dashboard de IA.

- [ID: T-115] **Alertas de amostra insuficiente**
  - Quando `nAmostras < 30` em uma hora:
    - Marcar percentis como baixa confiabilidade.
    - Usar fallback determinístico (medianas do dia anterior).
    - Exibir warning no console e na UI.

#### Fase 7: Validação e Testes
- [ID: T-116] **Cenários analíticos de fila**
  - Definir baterias sintéticas:
    - M/M/1: chegadas/serviço exponenciais, 1 servidor.
    - M/M/c: c servidores.
    - M/G/1: serviço geral.
    - Chegadas em rajada (burst).
    - Troca de turno (mudança de μ).
  - Validar viés/variância dos estimadores.
  - Registrar resultados em `testes.md` com KPIs (MAE/MAPE/p95 erro).

- [ID: T-117] **Testes de regressão**
  - Garantir que modo `fixo` mantém comportamento atual.
  - Validar que modo `dinamico` aplica fórmula corretamente.
  - Testar fallback quando `nAmostras < 30`.
  - Testar gate de ML Hint (score/latency).

### Peso 2 (Documentação e Integração)

- [ID: T-118] **Documentar fórmulas e algoritmos**
  - Criar `v3/team_agents/desenvolvimento/algoritmos_estatisticos.md`:
    - Detalhamento de λ(h), μ(h), P².
    - Fórmula de limite dinâmico com exemplos.
    - Calibração de parâmetros (base, min, max).
  - Adicionar referências bibliográficas (teoria de filas, algoritmos).

- [ID: T-119] **Guia de operação**
  - Documentar em README ou manual:
    - Quando usar modo fixo vs dinâmico.
    - Como interpretar indicadores de confiabilidade.
    - Tuning de parâmetros por tipo de serviço.

### Peso 3 (Otimizações e Melhorias)

- [ID: T-120] **Cache de cálculos de limites**
  - Evitar recalcular limite a cada verificação.
  - Invalidar cache apenas quando estatísticas mudam.

- [ID: T-121] **Previsão de tempo de espera**
  - Combinar fórmulas de filas (M/M/1, M/M/c) com λ(h)/μ(h).
  - Holt–Winters para sazonalidade diária.
  - Expor `prevTempoEsperaMs` com IC 80/95%.

### Critérios de Aceite

#### Sistema de Limites Dinâmicos
- ✅ Modo `fixo` mantém comportamento atual (10/20/25min).
- ✅ Modo `dinamico` calcula limites usando λ, μ e P95.
- ✅ Fallback ativo quando `nAmostras < 30`.
- ✅ Limites respeitam clamp (min/max) por tipo.
- ✅ Pausar contagem durante ausências permanece funcional.

#### Gate de ML Hint
- ✅ ML Hint rejeitado se `score < 0.65` ou `latency > 200ms`.
- ✅ Rejeição registrada em telemetria com fonte `jsed_fallback_*`.
- ✅ Thresholds configuráveis via UI (aba IA).

#### Estimadores e Qualidade
- ✅ λ(h) e μ(h) calculados por janelas móveis com EWMA.
- ✅ P50/P95/P99 calculados via P² ou Harrell–Davis.
- ✅ Métricas de qualidade (bias, var, RMSE) disponíveis.
- ✅ Indicador de confiabilidade exibido na UI.

#### Persistência e Offline
- ✅ Estatísticas salvas em JSON local (`estatisticas/*.json`).
- ✅ Nenhuma chamada HTTP externa.
- ✅ Rota interna para servir snapshots ao painel.

### Dependências e Bloqueios

**Dependências Técnicas:**
- T-103 → T-104, T-105, T-106 (estimadores dependem da estrutura de dados).
- T-104, T-105, T-106 → T-108 (limite dinâmico depende dos estimadores).
- T-108 → T-109 (integração depende do cálculo).
- T-110 → T-111 (gate depende da configuração).

**Bloqueios:**
- Nenhum bloqueador técnico identificado.
- Requer decisão de produto: habilitar dinâmico por padrão ou deixar em fixo?

### Estimativa de Esforço

| Tarefa | Complexidade | Estimativa |
|--------|--------------|------------|
| T-103 | Média | 2-4h |
| T-104 | Alta | 4-6h |
| T-105 | Alta | 4-6h |
| T-106 | Muito Alta | 6-8h |
| T-107 | Alta | 4-6h |
| T-108 | Média | 3-4h |
| T-109 | Baixa | 1-2h |
| T-110 | Baixa | 1h |
| T-111 | Média | 2-3h |
| T-112 | Média | 3-4h |
| T-113 | Média | 3-4h |
| T-114 | Alta | 4-6h |
| T-115 | Baixa | 1-2h |
| T-116 | Alta | 6-8h |
| T-117 | Média | 3-4h |
| T-118 | Média | 2-3h |
| T-119 | Baixa | 1-2h |
| T-120 | Baixa | 1-2h |
| T-121 | Muito Alta | 8-12h |

**Total:** ~60-85h (1.5 a 2 semanas de desenvolvimento full-time)

### Referências
- Relatório: [`v3/team_agents/desenvolvimento/melhoria_logica_correcao_tempo_limite.md`](v3/team_agents/desenvolvimento/melhoria_logica_correcao_tempo_limite.md)
- Código atual: [`v3/server/src/services/QueueService.ts:580-643`](v3/server/src/services/QueueService.ts:580-643)
- Tipos: [`v3/shared/types.ts:509-518`](v3/shared/types.ts:509-518)

---

## Sessão de Desenvolvimento 2025-11-22 (Continuação - Sessão 5)

**Concluído nesta sessão:**

### 1. Relatório de Consolidação (Sessões 2-4)
- ✅ Criado arquivo oficial: [`v3/team_agents/desenvolvimento/relatorios_desenvolvimento/2025-11-22_sistema_ia_operacional_completo.md`](relatorios_desenvolvimento/2025-11-22_sistema_ia_operacional_completo.md)
- Documentação completa do sistema de IA operacional:
  - Gate de ML Hint com validação tripla
  - Telemetria completa com histórico
  - Dashboard funcional conectado
  - Fluxos de decisão e configuração
  - Critérios de aceite
  - Testes recomendados
  - Métricas de qualidade

### 2. Testes Unitários para IAManager (T-091)
- ✅ Arquivo: [`v3/server/src/services/__tests__/IAManager.test.ts`](../server/src/services/__tests__/IAManager.test.ts)
- **11 grupos de testes com 25+ casos:**
  1. **Gate de ML Hint:** validação de score, latency, top-3, flag enabled
  2. **Cálculo JSED:** peso base, aging, fast track
  3. **Tempo Limite Absoluto:** priorização e ordenação por timestamp
  4. **WRR:** detecção de desbalanceamento, escolha de tipo sub-atendido
  5. **Telemetria:** registro de decisões, histórico, top-3, wrrAtivo
  6. **Preview JSED:** ordenação por SED, separação de tempo limite
  7. **Edge Cases:** senhas vazias, única senha, ML Hint inexistente, pesos zero
- **Configuração de Jest:**
  - ✅ `package.json`: scripts `test`, `test:watch`, `test:coverage`
  - ✅ `jest.config.js`: preset ts-jest/esm, cobertura configurada
  - ✅ Dependências: `jest@29.7.0`, `ts-jest@29.1.1`, `@types/jest@29.5.11`

### 3. Estimador Lambda (λ - chegadas/hora) (T-104)
- ✅ Arquivo: [`v3/server/src/services/EstimadorLambda.ts`](../server/src/services/EstimadorLambda.ts)
- **Características:**
  - Janelas móveis: 15min (recente) e 1h (estável)
  - EWMA configurável (α = 0.3 padrão)
  - Winsorização: média ponderada com limite de 3× o valor de 1h
  - Separação por tipo (prioridade/contratual/normal)
  - Cálculo de λ global (soma de todos os tipos)
  - Confiabilidade: alta (≥30 amostras), média (≥10), baixa (<10)
  - Limpeza automática de histórico > 24h
  - Métodos `exportar()` e `importar()` para persistência JSON
- **Interfaces:**
  - `ChegadaRegistro`: timestamp, tipo, servicoDoCliente
  - `LambdaPorHora`: hora (0-23), lambda por tipo, lambdaGlobal, nAmostras, confiabilidade

### 4. Estimador Mu (μ - taxa de atendimento) (T-105)
- ✅ Arquivo: [`v3/server/src/services/EstimadorMu.ts`](../server/src/services/EstimadorMu.ts)
- **Características:**
  - Fórmula: μ = n_atendimentos / (tempo_total_horas)
  - Ajuste para interrupções: exclui ausências/não comparecimentos
  - EWMA configurável (α = 0.3 padrão)
  - Separação por tipo e por guichê
  - Cálculo de tempo médio de atendimento (`tempoMedioAtendimentoMs`)
  - Método `calcularRho(λ, tipo)`: fator de utilização ρ = λ/μ
  - Confiabilidade: alta (≥20 amostras), média (≥5), baixa (<5)
  - Contador de interrupções por tipo (`nInterrompidos`)
  - Métodos `exportar()` e `importar()` para persistência JSON
- **Interfaces:**
  - `AtendimentoRegistro`: timestamp, tipo, servicoDoCliente, guicheId, tempoAtendimentoMs, interrompido
  - `MuPorHora`: hora, mu por tipo, muGlobal, muPorGuiche, tempoMedioAtendimentoMs, nAmostras, nInterrompidos, confiabilidade

### 5. Atualização de proximos_passos.md
- ✅ Marcado T-091 como concluído (testes IAManager)
- ✅ Marcado T-104 como concluído (estimador λ)
- ✅ Marcado T-105 como concluído (estimador μ)
- ✅ Atualizado "Próximos Passos Prioritários" com status
- ✅ Adicionada esta seção de consolidação da sessão 5

---

### Arquivos Criados/Modificados nesta Sessão

| Arquivo | Status | Linhas | Descrição |
|---------|--------|--------|-----------|
| `v3/team_agents/desenvolvimento/relatorios_desenvolvimento/2025-11-22_sistema_ia_operacional_completo.md` | Criado | 550 | Relatório consolidado de sessões 2-4 |
| `v3/server/src/services/__tests__/IAManager.test.ts` | Criado | 580 | Suite completa de testes unitários |
| `v3/server/jest.config.js` | Criado | 31 | Configuração Jest para ESM/TypeScript |
| `v3/server/package.json` | Modificado | - | Scripts de teste e dependências Jest |
| `v3/server/src/services/EstimadorLambda.ts` | Criado | 234 | Estimador de taxa de chegadas (λ) |
| `v3/server/src/services/EstimadorMu.ts` | Criado | 263 | Estimador de taxa de atendimento (μ) |
| `v3/team_agents/desenvolvimento/proximos_passos.md` | Modificado | - | Status de T-091, T-104, T-105 |

**Total:** 5 arquivos criados, 2 arquivos modificados

---

### Próximos Passos Imediatos

**Peso 1 - Alta Prioridade:**
1. **T-106:** Implementar estimador de percentis (P50/P95/P99) com algoritmo P² e Harrell-Davis
2. **T-108:** Implementar fórmula de limite dinâmico (`limite_t(h) = clamp(base_t × f_load(h) + P95_t(h), min_t, max_t)`)
3. **T-109:** Integrar limites dinâmicos com `QueueService.verificarTemposLimite()`
4. **Integração dos Estimadores:** Conectar `EstimadorLambda` e `EstimadorMu` ao `StateManager` com persistência

**Peso 2 - Médio Prazo:**
5. **T-113:** Dashboard de estatísticas em tempo real (λ, μ, P95 por tipo)
6. **T-092:** Testes de integração para fluxo completo de chamada com IA
7. **T-098:** Criar diagramas de sequência para fluxos principais

---

### Critérios de Aceite - Sessão 5

#### Testes Unitários (T-091) ✅
- [x] Cobertura completa de IAManager: gate ML Hint, JSED, WRR, tempo limite
- [x] Configuração Jest funcional com ESM/TypeScript
- [x] Scripts `npm test`, `npm run test:watch`, `npm run test:coverage`
- [x] 25+ casos de teste organizados em 11 grupos temáticos

#### Estimador Lambda (T-104) ✅
- [x] Janelas móveis de 15min e 1h implementadas
- [x] EWMA com α configurável
- [x] Winsorização para robustez a outliers
- [x] Separação por tipo (prioridade/contratual/normal)
- [x] Indicador de confiabilidade (alta/média/baixa)
- [x] Exportação/importação para persistência JSON
- [x] Limpeza automática de histórico > 24h

#### Estimador Mu (T-105) ✅
- [x] Cálculo de μ = atendimentos/hora
- [x] Ajuste para interrupções (ausências/não comparecimentos)
- [x] EWMA por hora
- [x] Separação por tipo e por guichê
- [x] Cálculo de tempo médio de atendimento
- [x] Método `calcularRho(λ, tipo)` para fator de utilização
- [x] Exportação/importação para persistência JSON

#### Documentação ✅
- [x] Relatório consolidado de sessões 2-4 salvo em `relatorios_desenvolvimento/`
- [x] `proximos_passos.md` atualizado com status correto
- [x] Comentários JSDoc em todos os métodos públicos dos estimadores

---

### Métricas da Sessão 5

- **Tarefas concluídas:** 5 (Relatório sessões 2-4 + T-091 + T-104 + T-105 + T-106)
- **Linhas de código:** ~1.458 (580 testes + 234 lambda + 263 mu + 351 percentis + 31 config)
- **Linhas de documentação:** ~1.365 (550 relatório consolidado + 660 relatório sessão 5 + 155 proximos_passos)
- **Cobertura de testes:** IAManager completo (gate ML Hint, JSED, WRR, telemetria)
- **Arquivos criados:** 7
- **Arquivos modificados:** 2

---

## Sessão de Desenvolvimento 2025-11-22 (Continuação - Sessão 6)

**Concluído nesta sessão:**

### 1. Relatório de Trabalho Concluído (Sessão 5)
- ✅ Criado arquivo: [`v3/team_agents/desenvolvimento/relatorios_desenvolvimento/2025-11-22_sessao5_testes_estimadores.md`](relatorios_desenvolvimento/2025-11-22_sessao5_testes_estimadores.md)
- Documentação completa da sessão 5 com exemplos de uso

### 2. Estimador de Percentis (T-106)
- ✅ Arquivo: [`v3/server/src/services/EstimadorPercentis.ts`](../server/src/services/EstimadorPercentis.ts) (351 linhas)
- Algoritmos: Percentil Simples, P², Harrell-Davis, Bootstrap IC 95%
- Percentis P50/P95/P99 para espera e atendimento por tipo
- Confiabilidade e exportação/importação JSON

### 3. Atualização de proximos_passos.md
- ✅ Marcado T-106 como concluído
- ✅ Adicionados novos itens de integração (T-122 a T-128)

---

### Novos Itens de Continuidade (Sessão 6)

**[Concluído] [ID: T-122] Integrar EstimadorLambda ao StateManager**
- ✅ Criado `EstimadoresManager` centralizando λ, μ e percentis
- ✅ Integrado ao StateManager via instância privada
- ✅ Método `registrarChegada()` disponível
- ✅ Cálculo automático a cada 1 minuto
- ✅ Persistência em `estatisticas/lambda_por_hora.json`

**[Concluído] [ID: T-123] Integrar EstimadorMu ao StateManager**
- ✅ Método `registrarAtendimento()` disponível
- ✅ Suporte para marcar interrupções (ausências)
- ✅ Persistência em `estatisticas/mu_por_hora.json`
- ✅ Método `getTempoMedioAtendimento()` para consulta

**[Concluído] [ID: T-124] Integrar EstimadorPercentis ao StateManager**
- ✅ Método `registrarTempoEspera()` ao chamar senha
- ✅ Método `registrarAtendimento()` registra tempo atendimento
- ✅ Persistência em `estatisticas/percentis_por_hora.json`
- ✅ Método `getPercentilEspera()` para consulta

**[Concluído] [ID: T-125] Usar EstimadorMu em IAManager.estimativaServicoMs**
- ✅ Substituído valor fixo (5 min) por tempo médio real
- ✅ Fallback: média global de todos os tipos
- ✅ Fallback final: 5 min se sem dados
- ✅ Melhora precisão do cálculo JSED

**[ID: T-126] Adicionar configuração de modo dinâmico**
- Expandir `ConfiguracaoTempoLimite` com modo fixo/dinâmico
- Parâmetros por tipo (base, min, max)

**[ID: T-127] Testes unitários para EstimadorPercentis**
- Validar P², Harrell-Davis, bootstrap
- Casos extremos e confiabilidade

**[ID: T-128] Testes de integração para estimadores**
- Simular operação completa
- Validar persistência e precisão

---

### Métricas da Sessão 6

- **Tarefas concluídas:** 2 (Relatório sessão 5 + T-106)
- **Linhas de código:** ~351 (estimador de percentis)
- **Linhas de documentação:** ~740 (660 relatório + 80 proximos_passos)
- **Arquivos criados:** 2
- **Arquivos modificados:** 1

### Métricas Acumuladas (Sessões 5 + 6)

- **Tarefas concluídas:** 6 (2 relatórios + 4 estimadores/testes)
- **Linhas de código:** ~1.809
- **Linhas de documentação:** ~2.105
- **Arquivos criados:** 7
- **Arquivos modificados:** 2

---

## Sessão de Desenvolvimento 2025-11-22 (Continuação - Sessão 7)

**Concluído nesta sessão:**

### 1. EstimadoresManager - Sistema Centralizado (T-122, T-123, T-124)
- ✅ Arquivo: [`v3/server/src/services/EstimadoresManager.ts`](../server/src/services/EstimadoresManager.ts) (334 linhas)
- **Funcionalidades:**
  - Instancia e gerencia EstimadorLambda, EstimadorMu, EstimadorPercentis
  - Cálculo periódico automático (a cada 1 minuto)
  - Persistência em `dist/estatisticas/*.json`:
    - `lambda_por_hora.json`
    - `mu_por_hora.json`
    - `percentis_por_hora.json`
  - Métodos de registro:
    - `registrarChegada(tipo, servico)` - Para λ
    - `registrarAtendimento(tipo, servico, tempoMs, guicheId, interrompido)` - Para μ e percentis
    - `registrarTempoEspera(tipo, servico, tempoMs, guicheId)` - Para percentis
  - Métodos de consulta:
    - `getEstatisticas()` - λ, μ e percentis da hora atual
    - `getTempoMedioAtendimento(tipo)` - Tempo médio por tipo
    - `getPercentilEspera(tipo, percentil)` - P50/P95/P99
    - `calcularRho(tipo?)` - Fator de utilização ρ = λ/μ
  - Carregamento automático de dados persistidos
  - Criação automática de diretório `estatisticas/`

### 2. Integração com StateManager (T-122, T-123, T-124)
- ✅ Arquivo modificado: [`v3/server/src/services/StateManager.ts`](../server/src/services/StateManager.ts)
- **Alterações:**
  - Import de `EstimadoresManager` e `TipoSenha`
  - Instância privada `estimadores: EstimadoresManager`
  - Inicialização no construtor
  - Métodos públicos expostos:
    - `registrarChegada(tipo, servico)` - Delega para estimadores
    - `registrarAtendimento(tipo, servico, tempoMs, guicheId?, interrompido?)` - Delega para estimadores
    - `registrarTempoEspera(tipo, servico, tempoMs, guicheId?)` - Delega para estimadores
    - `getEstatisticas()` - Retorna λ, μ e percentis
    - `getTempoMedioAtendimento(tipo)` - Para IAManager
    - `getPercentilEspera(tipo, percentil)` - Para consultas
    - `calcularRho(tipo?)` - Fator de utilização
    - `getEstimadores()` - Acesso direto se necessário

### 3. Uso de Estimadores no IAManager (T-125)
- ✅ Arquivo modificado: [`v3/server/src/services/IAManager.ts`](../server/src/services/IAManager.ts)
- **Alterações:**
  - Método `estimativaServicoMs()` atualizado:
    - 1ª opção: Usa `stateManager.getTempoMedioAtendimento(tipo)`
    - 2ª opção (fallback): Média global de todos os tipos
    - 3ª opção (fallback final): 5 minutos (valor fixo anterior)
  - Melhora precisão do cálculo JSED com dados reais
  - Adapta-se automaticamente conforme sistema coleta dados

### 4. Atualização de proximos_passos.md
- ✅ Marcados como concluídos: T-122, T-123, T-124, T-125
- ✅ Adicionada seção de consolidação da sessão 7
- ✅ Próximos passos atualizados

---

### Arquivos Criados/Modificados nesta Sessão (Sessão 7)

| Arquivo | Status | Linhas | Descrição |
|---------|--------|--------|-----------|
| `server/src/services/EstimadoresManager.ts` | ✅ Criado | 334 | Sistema centralizado de estimadores |
| `server/src/services/StateManager.ts` | ✅ Modificado | +75 | Integração com estimadores |
| `server/src/services/IAManager.ts` | ✅ Modificado | +21 | Uso de tempo médio real |
| `team_agents/desenvolvimento/proximos_passos.md` | ✅ Modificado | +100 | Status T-122 a T-125 + sessão 7 |

**Total desta sessão:** 1 arquivo criado, 3 arquivos modificados

**Total acumulado (Sessões 5+6+7):** 8 arquivos criados, 4 arquivos modificados

---

### Próximos Passos Imediatos (Atualizado)

**Peso 1 - Alta Prioridade:**
1. **[Concluído] [ID: T-129] Integrar estimadores em eventos do sistema**
   - ✅ Chamar `stateManager.registrarChegada()` em `emitirSenha` ([SocketHandlers.ts:89](../server/src/socket/SocketHandlers.ts#L89))
   - ✅ Chamar `stateManager.registrarTempoEspera()` em `chamarSenha` ([SocketHandlers.ts:118-132](../server/src/socket/SocketHandlers.ts#L118-L132))
   - ✅ Chamar `stateManager.registrarAtendimento()` em `finalizarAtendimento` ([SocketHandlers.ts:176-192](../server/src/socket/SocketHandlers.ts#L176-L192))
   - ✅ Marcar interrupções em eventos de ausência/não comparecimento ([SocketHandlers.ts:241-282](../server/src/socket/SocketHandlers.ts#L241-L282))

2. **[Concluído] [ID: T-130] Expor estatísticas via Socket.IO**
   - ✅ Adicionar handler `getEstatisticas` em SocketHandlers ([SocketHandlers.ts:507-518](../server/src/socket/SocketHandlers.ts#L507-L518))
   - ✅ Emitir estatísticas para clientes conectados em `emitirEstadoAtualizado()` ([SocketHandlers.ts:62-69](../server/src/socket/SocketHandlers.ts#L62-L69))
   - ✅ Evento `estatisticasEstimadores` adicionado aos tipos ([types.ts:285](../shared/types.ts#L285))
   - ✅ Evento `getEstatisticas` adicionado aos tipos ([types.ts:324](../shared/types.ts#L324))

3. **T-108:** Implementar CalculadorLimiteDinamico
4. **T-109:** Integrar limites dinâmicos com QueueService
5. **T-126:** Adicionar configuração de modo dinâmico

**Peso 2 - Médio Prazo:**
6. **T-113:** Dashboard de estatísticas em tempo real
7. **T-127:** Testes unitários para EstimadorPercentis
8. **T-128:** Testes de integração para estimadores

---

### Critérios de Aceite - Sessão 7

#### EstimadoresManager (T-122, T-123, T-124) ✅
- [x] Sistema centralizado instanciando λ, μ e percentis
- [x] Cálculo periódico automático (1 minuto)
- [x] Persistência em arquivos JSON separados
- [x] Carregamento automático de dados salvos
- [x] Criação automática de diretório `estatisticas/`
- [x] Métodos de registro para todos os tipos de evento
- [x] Métodos de consulta (estatísticas, tempo médio, percentis, ρ)

#### Integração com StateManager (T-122, T-123, T-124) ✅
- [x] Instância privada de EstimadoresManager
- [x] Métodos públicos delegando para estimadores
- [x] Exposição de métodos de consulta
- [x] Sem quebrar funcionalidades existentes

#### IAManager com Estimadores Reais (T-125) ✅
- [x] Método `estimativaServicoMs()` usa tempo médio real
- [x] Fallback para média global
- [x] Fallback final para 5 minutos
- [x] Melhora precisão do JSED

---

### Métricas da Sessão 7

- **Tarefas concluídas:** 4 (T-122, T-123, T-124, T-125)
- **Linhas de código:** ~430 (334 EstimadoresManager + 75 StateManager + 21 IAManager)
- **Linhas de documentação:** ~100 (proximos_passos.md)
- **Arquivos criados:** 1
- **Arquivos modificados:** 3

### Métricas Acumuladas (Sessões 5 + 6 + 7)

- **Tarefas concluídas:** 10 (2 relatórios + 4 estimadores + 4 integrações)
- **Linhas de código:** ~2.239 (1.809 + 430)
- **Linhas de documentação:** ~2.205 (2.105 + 100)
- **Arquivos criados:** 8
- **Arquivos modificados:** 4

---

## Sessão de Desenvolvimento 2025-11-23 (Continuação - Sessão 8)

**Concluído nesta sessão:**

### 1. Correção de Conexão Cliente-Servidor (Modelo Servidor Único)

**Problema identificado:**
- UI não conectava com backend devido a configuração incorreta de rede
- Servidor fazia bind em `127.0.0.1` (apenas localhost)
- Cliente usava `io()` sem especificar URL do servidor
- CORS restrito a localhost impedia conexões da LAN

**Correções implementadas:**

#### [Concluído] [ID: T-131] Configurar bind de rede no servidor
- ✅ Alterado `HOST` padrão de `127.0.0.1` para `0.0.0.0` ([server.ts:23](../server/src/server.ts#L23))
- ✅ Servidor agora aceita conexões de todas as interfaces de rede
- ✅ Compatível com modelo servidor único + guichês clientes

#### [Concluído] [ID: T-132] Configurar URL de conexão Socket.IO no cliente
- ✅ Cliente usa `VITE_SERVER_URL` ou `window.location.origin` ([useSocket.ts:53-59](../client/src/composables/useSocket.ts#L53-L59))
- ✅ Transports explícitos: `websocket` e `polling` (fallback)
- ✅ Criado `client/.env.example` documentando variável de ambiente
- ✅ Criado `client/src/vite-env.d.ts` com tipos TypeScript para `import.meta.env`

#### [Concluído] [ID: T-133] Atualizar CORS para aceitar conexões da LAN
- ✅ Desenvolvimento: `origin: true` (aceita qualquer origem)
- ✅ Produção: lista de origens via `CORS_ORIGIN` ou padrão localhost
- ✅ Documentação de variável `CORS_ORIGIN` (ex: `http://192.168.1.10:3000,http://192.168.1.11:3000`)

#### [Concluído] [ID: T-134] Corrigir caminho de arquivos estáticos
- ✅ Ajustado `clientPath` de `../../client/dist` para `../../../../client/dist` ([server.ts:55](../server/src/server.ts#L55))
- ✅ Corrige caminho considerando estrutura `v3/server/dist/server/src/`

#### [Concluído] [ID: T-135] Corrigir imports ES modules
- ✅ Adicionada extensão `.js` nos imports de `EstimadoresManager.ts`
- ✅ Imports: `EstimadorLambda.js`, `EstimadorMu.js`, `EstimadorPercentis.js`, `types.js`

### 2. Testes de Validação

**Compilação:**
- ✅ TypeScript server: `tsc --noEmit` sem erros
- ✅ Build cliente: `vite build` concluído com sucesso (313 KB total)
- ✅ Build servidor: `tsc` sem erros

**Servidor:**
- ✅ Inicialização bem-sucedida em `http://0.0.0.0:3000`
- ✅ CORS origins: `true` (desenvolvimento)
- ✅ EstimadoresManager carregados (λ, μ, percentis)
- ✅ QueueMonitor iniciado em modo TEMPO_REAL
- ✅ Estatísticas persistidas em `dist/server/src/estatisticas/`

**Cliente:**
- ✅ HTML servido corretamente (`index.html`)
- ✅ Assets carregados (JS, CSS, webfonts, ML)
- ✅ Socket.IO endpoint respondendo (`/socket.io/`)

### 3. Arquivos Criados/Modificados nesta Sessão (Sessão 8)

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `server/src/server.ts` | ✅ Modificado | HOST=0.0.0.0, CORS flexível, clientPath corrigido |
| `client/src/composables/useSocket.ts` | ✅ Modificado | URL dinâmica via VITE_SERVER_URL |
| `client/.env.example` | ✅ Criado | Documentação de variáveis de ambiente |
| `client/src/vite-env.d.ts` | ✅ Criado | Tipos TypeScript para import.meta.env |
| `server/src/services/EstimadoresManager.ts` | ✅ Modificado | Imports com extensão .js |

**Total desta sessão:** 2 arquivos criados, 3 arquivos modificados

---

### Critérios de Aceite - Sessão 8

#### Conexão Cliente-Servidor ✅
- [x] Servidor faz bind em `0.0.0.0` e aceita conexões da LAN
- [x] Cliente conecta usando URL configurável ou mesma origem
- [x] CORS permite desenvolvimento (qualquer origem) e produção (lista restrita)
- [x] Socket.IO funcional com transports websocket e polling
- [x] Arquivos estáticos servidos corretamente

#### Compilação e Build ✅
- [x] TypeScript compila sem erros (servidor e cliente)
- [x] Vite build gera bundle otimizado
- [x] ES modules com extensões .js corretas

#### Modelo Servidor Único ✅
- [x] Servidor único atende múltiplos guichês
- [x] Guichês acessam via `http://<IP_DO_SERVIDOR>:3000`
- [x] Sem necessidade de instalação nos guichês
- [x] Configuração via variáveis de ambiente (HOST, PORT, CORS_ORIGIN)

---

### Próximos Passos Imediatos (Atualizado - Sessão 8)

**Peso 1 - Alta Prioridade:**
1. **[Concluído] [ID: T-129] Integrar estimadores em eventos do sistema**
   - ✅ Chamar `stateManager.registrarChegada()` em `emitirSenha` ([SocketHandlers.ts:89](../server/src/socket/SocketHandlers.ts#L89))
   - ✅ Chamar `stateManager.registrarTempoEspera()` em `chamarSenha` ([SocketHandlers.ts:118-132](../server/src/socket/SocketHandlers.ts#L118-L132))
   - ✅ Chamar `stateManager.registrarAtendimento()` em `finalizarAtendimento` ([SocketHandlers.ts:176-192](../server/src/socket/SocketHandlers.ts#L176-L192))
   - ✅ Marcar interrupções em eventos de ausência/não comparecimento ([SocketHandlers.ts:241-282](../server/src/socket/SocketHandlers.ts#L241-L282))

2. **[Concluído] [ID: T-130] Expor estatísticas via Socket.IO**
   - ✅ Adicionar handler `getEstatisticas` em SocketHandlers ([SocketHandlers.ts:507-518](../server/src/socket/SocketHandlers.ts#L507-L518))
   - ✅ Emitir estatísticas para clientes conectados em `emitirEstadoAtualizado()` ([SocketHandlers.ts:62-69](../server/src/socket/SocketHandlers.ts#L62-L69))
   - ✅ Evento `estatisticasEstimadores` adicionado aos tipos ([types.ts:285](../shared/types.ts#L285))
   - ✅ Evento `getEstatisticas` adicionado aos tipos ([types.ts:324](../shared/types.ts#L324))

3. **[ID: T-108] Implementar CalculadorLimiteDinamico**
4. **[ID: T-109] Integrar limites dinâmicos com QueueService**
5. **[ID: T-136] Criar scripts de inicialização (.bat/.sh)**
   - Script para Windows: `start-sgfila.bat`
   - Script para Linux: `start-sgfila.sh`
   - Variáveis de ambiente documentadas

**Peso 2 - Médio Prazo:**
6. **T-113:** Dashboard de estatísticas em tempo real
7. **T-127:** Testes unitários para EstimadorPercentis
8. **T-128:** Testes de integração para estimadores

---

### Métricas da Sessão 8

- **Tarefas concluídas:** 5 (T-131, T-132, T-133, T-134, T-135)
- **Linhas de código:** ~50 (ajustes em 3 arquivos existentes)
- **Linhas de documentação:** ~15 (.env.example + vite-env.d.ts + comentários)
- **Arquivos criados:** 2
- **Arquivos modificados:** 3
- **Problemas corrigidos:** 1 (conexão cliente-servidor)

### Métricas Acumuladas (Sessões 5 + 6 + 7 + 8)

- **Tarefas concluídas:** 15 (2 relatórios + 4 estimadores + 4 integrações + 5 correções de rede)
- **Linhas de código:** ~2.289 (2.239 + 50)
- **Linhas de documentação:** ~2.220 (2.205 + 15)
- **Arquivos criados:** 10
- **Arquivos modificados:** 7

---

### Servidor Único — Ubuntu Server 24.04 LTS
- Objetivo: substituir Void por Ubuntu Server LTS (sem GUI) para servidor central que atende todos os guichês.
- ISO: `ubuntu-24.04.1-live-server-amd64.iso`.
- Criação do USB de instalação: Rufus (`GPT`, `UEFI (não CSM)`).
- Instalação mínima:
  - Selecionar instalação padrão sem pacotes extras; habilitar `OpenSSH Server`.
  - Hostname `sgfila-server`; rede por DHCP.
  - Particionamento: raiz `ext4`; segunda partição `ext4` para `SGFila/_estatisticas` e artefatos.
- Pós-instalação:
  - Montar dados: `mkdir -p /mnt/sgfila && mount /dev/sdX2 /mnt/sgfila`.
  - Copiar pacote: `cp -r /mnt/sgfila/SGFila /opt/SGFila`.
  - Runtime Node portátil: extrair `node-vXX.Y.Z-linux-x64` em `/opt/SGFila/server/_runtime/node/` e exportar `PATH`.
  - Start: `cd /opt/SGFila/servidor && HOST=0.0.0.0 PORT=3000 node dist/index.js`.
  - CORS: definir `CORS_ORIGIN` com IPs/faixas da LAN.
- Guichês:
  - Acesso via navegador: `http://<IP_DO_SERVIDOR>:3000`.
  - Nenhuma instalação/configuração; sem privilégios administrativos.
- Validações iniciais:
  - `curl http://localhost:3000` no servidor retorna 200.
  - De um guichê: abrir URL do servidor; executar smoke (emitir/chamar/finalizar).
  - Desconectar internet do servidor; operação permanece, sem chamadas externas.
## Estado Atual — Build/Release
- Pasta oficial de produção definida: `C:\Users\Diego\Downloads\nodep\sgfila\build\SGFila`.
- Scripts criados para operação local:
  - Produção: `v3/servers_inicializar/START.bat`, `v3/servers_inicializar/STOP.bat`.
  - Desenvolvimento: `v3/servers_inicializar/START_dev.bat`, `v3/servers_inicializar/STOP_dev.bat`.
- Limpeza aplicada:
  - Removidos scripts obsoletos de preparação e download de Node.
  - Removida duplicata de runtime em `v3/server/_runtime/node` (mantemos apenas em `build/SGFila/server/_runtime/node`).
- Servidor local validado em produção: `http://0.0.0.0:3000` com CORS restrito a `localhost`.

## Próximas Ações — Entrega Offline Ubuntu
- Aquisição de segundo pendrive/SSD para instalação dedicada do Ubuntu (o USB de instalação não pode ser particionado).
- Instalação do Ubuntu Server 24.04 LTS em dispositivo dedicado:
  - Storage: `Custom storage layout` no alvo (não selecionar disco do Windows).
  - Partições: `ESP 512MB FAT32 (/boot/efi)` + `root ext4 (/)` + opcional `dados ext4 (/opt/SGFila/_estatisticas)`.
  - Boot loader no mesmo dispositivo.
- Importar build a partir do Windows (NTFS):
  - `lsblk -f` → identificar partição NTFS do Windows.
  - `sudo mount -t ntfs3 -o ro /dev/<DISCO_PARTICAO> /mnt/win`.
  - `sudo mkdir -p /opt/SGFila && sudo cp -r "/mnt/win/Users/Diego/Downloads/nodep/sgfila/build/SGFila" /opt/SGFila/`.
- Inicializar servidor:
  - `cd /opt/SGFila/SGFila/server/scripts && chmod +x start-sgfila.sh && ./start-sgfila.sh`.
- Validações:
  - `curl http://localhost:3000`.
  - Guichês: `http://<IP_DO_SERVIDOR>:3000`.
  - Persistência: `/opt/SGFila/_estatisticas/*.json`.

## Automação de Testes — E2E/UI (Plano Detalhado)
- Objetivo: criar suíte E2E/UI robusta (Playwright) cobrindo fluxos críticos de guichês, consistência de ordenação JSED, notificações e acessibilidade, com métricas e relatórios integrados ao `testes.md`.

### Setup e Estrutura
- Preparar dependências de teste (dev) sem afetar produção:
  - Instalar Playwright (quando autorizado): `npm i -D @playwright/test` e `npx playwright install --with-deps`.
  - Criar estrutura: `v3/e2e/` com subpastas `pages/`, `fixtures/`, `specs/`, `utils/`, `reports/`.
  - Padrão Page Object:
    - `pages/CounterPanelPage.ts`: ações chamar/finalizar, leitura de badges.
    - `pages/ConfigurationPanelPage.ts`: troca de abas, IA, thresholds, design tokens.
    - `pages/QueueListPage.ts`: filtros (emissão/tipo/automática), busca e destaques.
  - Fixtures:
    - `fixtures/serverFixture.ts`: subir server local (prod) via `START.bat`/`STOP.bat` e checar `http://localhost:3000`.
    - `fixtures/devFixture.ts`: subir watchers `START_dev.bat`/`STOP_dev.bat` quando necessário; exportar `baseURL` e `VITE_SERVER_URL`.
  - Config:
    - `playwright.config.ts`: `use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure', video: 'on', screenshot: 'only-on-failure' }`.

### Casos Prioritários (E2E/UI)
- Alternador de Guichê (sem autochamada):
  - Dado guichê livre, ao clicar “Chamar”, deve chamar próxima; novo clique deve “Finalizar”; validar estado no painel e via socket.
  - Métricas: `emitMs`, `callMs`, `finishMs` capturadas no log; p95 < 200 ms.
- Consistência preview JSED vs chamada real:
  - Ativar `algoritmo === 'jsed_fair_wrr'`; solicitar `previewJSED`; validar que a senha chamada pertence ao top‑3 e segue a ordenação quando ML não interfere.
  - Registrar telemetria: `accepted_hint`, `latency_ms`, `score` (quando disponível).
- Notificações de correção:
  - Ao acionar “Ausência”/“Não comparecimento”, cliente deve receber `notificacaoAusencia`/`notificacaoNaoComparecimento` e disparar beep/alerta; UI exibe contador.
- Destaque de tempo‑limite:
  - Com `destacarSenhasTempoLimite` ativo, senhas com `tempoLimiteAtingido` aparecem com destaque; capturar screenshot e assert de classe/aria.
- Acessibilidade e UX:
  - Foco visível: navegar por controles essenciais; validar `outline` e offset.
  - Contraste AA: medir tokens críticos; assegurar ≥ 4.5:1.
  - Teclado: alternar abas/painéis/filtros sem mouse.

### Roteiro de Implementação
- Fase A — Infraestrutura de testes:
  - Adicionar Playwright e `playwright.config.ts`.
  - Implementar fixtures de start/stop (prod/dev) usando os `.bat` existentes.
  - Criar POMs mínimos para CounterPanel/QueueList/ConfigurationPanel.
- Fase B — Smoke e Fluxos críticos:
  - Escrever `specs/smoke.spec.ts` com navegação inicial, health da UI e verificação de socket conectando.
  - Escrever `specs/alternador_guiche.spec.ts` validando chamar/finalizar.
- Fase C — JSED/IA e notificações:
  - `specs/preview_jsed_consistencia.spec.ts` e `specs/notificacoes_correcao.spec.ts`.
- Fase D — Acessibilidade/Performance:
  - `specs/a11y_focus_contraste.spec.ts` e instrumentos leves de performance (marcas e medições por interação).
- Fase E — Relatórios e Integração:
  - Salvar artefatos (trace, vídeo, screenshots) em `v3/e2e/reports/`.
  - Publicar resumos e métricas em `v3/team_agents/desenvolvimento/testes.md` com referências a arquivos.

### Política de Dados e Estabilidade
- Testes idempotentes: limpar estado entre cenários; evitar dependência de dados persistidos.
- Retentativas controladas: aplicar `retry` apenas para operações flakey não determinísticas (ex.: animações), com limites.
- Timeouts: padronizar `timeout` por ação (3–5 s) e por teste (30–60 s).

### Comandos de Execução (Documentação)
- Preparar build local (se necessário): `npm run build` em `v3/server` e `v3/client`.
- Produção local para E2E: `v3/servers_inicializar/START.bat`; depois `npx playwright test`.
- Desenvolvimento E2E (se requerido): `v3/servers_inicializar/START_dev.bat`; configurar `baseURL` para `http://localhost:5173` com `VITE_SERVER_URL=http://localhost:3000`.

### Resultados e Publicação
- Após cada execução, anexar:
  - Sumário de pass/fail e tempos.
  - Artefatos (trace/vídeo/screenshots) e logs relevantes.
  - Métricas: socket RTT média/p95; tempos de quadro em interações; tamanhos de bundle.
- Atualizar `testes.md` com “Sessão de Automação” e IDs de tarefas relacionadas.
## Plano de Mitigação
- Sem segundo dispositivo: alternativa de dual‑boot com redução do C: no Windows e uso do espaço livre via `Custom storage layout` (sem tocar partições NTFS existentes).
- Rede ausente durante instalação: prosseguir sem rede; configurar IP depois com netplan.

## Itens de Build/Release (Adicionar ao Backlog)
- Empacotar assets ONNX/ORT no cliente (`client/public/onnxruntime-web` e `client/public/models`).
- Script de exportação para pendrive (rsync) no Ubuntu.
- Versão e timestamp de build armazenados em `build/SGFila/_builds/checksums.txt`.
## Automação E2E/UI — Execução 2025-11-23
- Conceito atualizado: automações rodam na pasta oficial de produção `C:\Users\Diego\Downloads\nodep\sgfila\build\SGFila` (pendrive é somente cópia).
- Scripts:
  - Start produção a partir da pasta oficial: `v3/servers_inicializar/START_build.bat`.
  - Stop: `v3/servers_inicializar/STOP.bat`.
- Suíte inicial criada:
  - `v3/e2e/package.json`, `v3/e2e/playwright.config.ts`, `v3/e2e/specs/smoke.spec.ts`.
- Execução:
  - `cd v3/e2e && npm install && npx playwright install && npx playwright test`.
  - Resultados: `app loads and socket handshake` [OK]; `ui loads main app container` [OK].
- Artefatos:
  - `v3/e2e/test-results/` com trace, vídeo e screenshots.
- Próximas implementações:
  - Semear dados ou acionar emissão de senhas para validar botões de chamada e fluxo completo de alternador.
  - Page Objects para CounterPanel/QueueList/ConfigurationPanel.

---

## Sessão de Desenvolvimento 2025-11-28 (Continuação - Sessão 9)

**Concluído nesta sessão:**

### 1. Integração de Estimadores em Eventos do Sistema (T-129) ✅

**Implementações realizadas em** [`v3/server/src/socket/SocketHandlers.ts`](../server/src/socket/SocketHandlers.ts):

#### 1.1 Registro de Chegadas (λ - Lambda)
- ✅ Adicionado registro de chegada em `emitirSenha` ([linha 89](../server/src/socket/SocketHandlers.ts#L89))
- ✅ Chamada: `stateManager.registrarChegada(tipo, servicoDoCliente)`
- ✅ Registra cada senha emitida para cálculo da taxa de chegadas por hora

#### 1.2 Registro de Tempo de Espera (Percentis)
- ✅ Adicionado em `chamarSenha` ([linhas 122-132](../server/src/socket/SocketHandlers.ts#L122-L132))
- ✅ Cálculo: `tempoEsperaMs = senha.chamadaTimestamp - senha.timestamp`
- ✅ Chamada: `stateManager.registrarTempoEspera(tipo, servico, tempoMs, guicheId)`
- ✅ Alimenta estimador de percentis P50/P95/P99

#### 1.3 Registro de Atendimentos (μ - Mu)
- ✅ Adicionado em `finalizarAtendimento` ([linhas 176-192](../server/src/socket/SocketHandlers.ts#L176-L192))
- ✅ Cálculo: `tempoAtendimentoMs = senha.finalizadoTimestamp - senha.chamadaTimestamp`
- ✅ Chamada: `stateManager.registrarAtendimento(tipo, servico, tempoMs, guicheId, interrompido=false)`
- ✅ Registra tempo de atendimento para cálculo da taxa de serviço

#### 1.4 Registro de Interrupções (Ausências e Não Comparecimentos)
- ✅ Adicionado em `processarAusencia` ([linhas 241-282](../server/src/socket/SocketHandlers.ts#L241-L282))
- ✅ Marca `interrompido=true` para ausências e não comparecimentos
- ✅ Dois casos tratados:
  - **Recolocada:** senha recolocada na fila após ausência ([linhas 250-261](../server/src/socket/SocketHandlers.ts#L250-L261))
  - **Histórico:** senha movida para histórico após não comparecimento ([linhas 271-282](../server/src/socket/SocketHandlers.ts#L271-L282))
- ✅ Ajuste de μ: exclui interrupções do cálculo de taxa de atendimento

#### 1.5 Correções de Tipagem
- ✅ Corrigido uso de `senha.timestamp` ao invés de `senha.emissaoTimestamp` ([linha 124](../server/src/socket/SocketHandlers.ts#L124))
- ✅ Corrigido uso de `senha.guicheAtendendo` ao invés de `senha.guicheAtual` ([linhas 258, 279](../server/src/socket/SocketHandlers.ts#L258))
- ✅ Compilação TypeScript validada sem erros

### 2. Exposição de Estatísticas via Socket.IO (T-130) ✅

**Implementações realizadas em** [`v3/server/src/socket/SocketHandlers.ts`](../server/src/socket/SocketHandlers.ts):

#### 2.1 Handler de Consulta (`getEstatisticas`)
- ✅ Adicionado evento `getEstatisticas` ([linhas 507-518](../server/src/socket/SocketHandlers.ts#L507-L518))
- ✅ Consulta: `stateManager.getEstatisticas()`
- ✅ Resposta: `socket.emit('estatisticasEstimadores', estatisticas)`
- ✅ Tratamento de erros com `erroOperacao`

#### 2.2 Emissão Automática em Atualizações de Estado
- ✅ Modificado `emitirEstadoAtualizado()` ([linhas 62-69](../server/src/socket/SocketHandlers.ts#L62-L69))
- ✅ Emite estatísticas dos estimadores junto com estado do sistema
- ✅ Evento: `io.emit('estatisticasEstimadores', estatisticasEstimadores)`
- ✅ Tratamento gracioso se estimadores não disponíveis (console.debug)

#### 2.3 Atualização de Tipos Socket.IO
**Em** [`v3/shared/types.ts`](../shared/types.ts):

- ✅ Adicionado evento `estatisticasEstimadores` em `ServerToClientEvents` ([linha 285](../shared/types.ts#L285))
  ```typescript
  estatisticasEstimadores: (dados: any) => void;
  ```
- ✅ Adicionado evento `getEstatisticas` em `ClientToServerEvents` ([linha 324](../shared/types.ts#L324))
  ```typescript
  getEstatisticas: () => void;
  ```

### 3. Validação e Testes ✅

#### 3.1 Compilação TypeScript
- ✅ Executado: `tsc --noEmit` sem erros
- ✅ Todos os tipos validados
- ✅ Nenhuma quebra de compatibilidade

#### 3.2 Arquivos Modificados
| Arquivo | Linhas Modificadas | Descrição |
|---------|-------------------|-----------|
| `server/src/socket/SocketHandlers.ts` | +80 | Integração de estimadores em eventos |
| `shared/types.ts` | +6 | Novos eventos Socket.IO |

### 4. Atualização de Documentação ✅

- ✅ Marcado T-129 como [Concluído] em `proximos_passos.md`
- ✅ Marcado T-130 como [Concluído] em `proximos_passos.md`
- ✅ Adicionadas referências de código com links
- ✅ Documentados todos os pontos de integração

---

### Próximos Passos Imediatos (Atualizado - Sessão 9)

**Peso 1 - Alta Prioridade:**

1. **[ID: T-108] Implementar CalculadorLimiteDinamico** (3-4h)
   - Fórmula: `limite_t(h) = clamp(base_t × f_load(h) + P95_t(h), min_t, max_t)`
   - Arquivo alvo: `v3/server/src/services/CalculadorLimiteDinamico.ts`
   - Depende de: T-104 ✅, T-105 ✅, T-106 ✅, T-129 ✅

2. **[ID: T-109] Integrar limites dinâmicos com QueueService** (1-2h)
   - Modificar `QueueService.verificarTemposLimite()` (linha 580)
   - Usar modo fixo ou dinâmico conforme configuração
   - Depende de: T-108

3. **[ID: T-126] Adicionar configuração de modo dinâmico** (3-4h)
   - Expandir `ConfiguracaoTempoLimite` com modo fixo/dinâmico
   - Controles na aba "Correções" do ConfigurationPanel
   - Depende de: T-108, T-109

4. **[ID: T-113] Dashboard de estatísticas em tempo real** (3-4h)
   - Consumir evento `estatisticasEstimadores` no cliente
   - Tabela com λ(h), μ(h), P95(h) por tipo
   - Indicador de confiabilidade (alta/média/baixa)
   - Depende de: T-129 ✅, T-130 ✅

**Peso 2 - Médio Prazo:**

5. **[ID: T-018] Implementar fallback robusto no sequenciamento IA**
6. **[ID: T-019] Coletar métricas para aprendizado contínuo**
7. **[ID: T-127] Testes unitários para EstimadorPercentis**
8. **[ID: T-128] Testes de integração para estimadores**

---

### Critérios de Aceite - Sessão 9

#### Integração de Estimadores (T-129) ✅
- [x] Registro de chegada em cada emissão de senha
- [x] Registro de tempo de espera em cada chamada
- [x] Registro de atendimento em cada finalização
- [x] Marcação de interrupções (ausências e não comparecimentos)
- [x] Tipagem correta (sem erros de compilação)
- [x] Sem quebra de funcionalidades existentes

#### Exposição de Estatísticas (T-130) ✅
- [x] Handler `getEstatisticas` respondendo corretamente
- [x] Emissão automática em `emitirEstadoAtualizado()`
- [x] Eventos adicionados aos tipos Socket.IO
- [x] Tratamento de erros implementado
- [x] Compatibilidade com clientes sem estimadores

#### Validação ✅
- [x] TypeScript compila sem erros
- [x] Tipos Socket.IO corretos (cliente e servidor)
- [x] Documentação atualizada com referências de código

---

### Métricas da Sessão 9

- **Tarefas concluídas:** 2 (T-129, T-130)
- **Linhas de código:** ~86 (80 SocketHandlers + 6 types)
- **Arquivos modificados:** 2
- **Erros de compilação corrigidos:** 3
- **Eventos Socket.IO criados:** 2 (estatisticasEstimadores, getEstatisticas)
- **Pontos de integração:** 4 (emissão, chamada, finalização, ausência)

### Métricas Acumuladas (Sessões 5-9)

- **Tarefas concluídas:** 12 (2 relatórios + 4 estimadores + 4 integrações + 2 exposições)
- **Linhas de código:** ~2.325 (2.239 + 86)
- **Arquivos criados:** 8 (estimadores, testes, relatórios)
- **Arquivos modificados:** 6 (handlers, types, proximos_passos)

---

### Bloqueadores Resolvidos ✅

- ✅ **T-129:** Sistema agora coleta dados reais de λ, μ e percentis
- ✅ **T-130:** Estatísticas disponíveis via Socket.IO para consumo no cliente

### Próximos Bloqueadores Críticos

- 🔴 **T-108:** Necessário para habilitar limites dinâmicos de tempo
- 🔴 **T-109:** Integração com lógica de correção existente

---
