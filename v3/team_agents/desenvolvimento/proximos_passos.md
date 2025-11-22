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
- [ID: T-015b] Conectar interface com dados reais do StateManager (carregar thresholds do cliente, exibir última decisão).
- [ID: T-015c] Adicionar visualização de métricas e histórico de decisões (integrar `estado.iaTelemetria` na seção de telemetria).

### Peso 1 (CRÍTICO - IA Operacional)
- [Concluído] [ID: T-016] Criar `IAManager.ts` com algoritmo de decisão JSED/Fairness/WRR (ver `v3/server/src/services/IAManager.ts`).
- [Concluído] [ID: T-017] Integrar IA ao `QueueService` substituindo lógica fixa e registrar decisão com confiança. Implementado ramo `jsed_fair_wrr` em `chamarSenha`.
- [ID: T-018] Implementar fallback robusto no sequenciamento e sinalização na UI quando ativo.
- [ID: T-019] Coletar métricas para aprendizado contínuo (`tempoEspera`, `prioridade`, `tipoServico`, `resultadoDecisao`).
- [ID: T-020] Opção do atendente desligar o sequenciamento da IA e adotar um dos algoritmos na seção "Comportamento da fila" na aba "Configurações". A IA continua funcional para treinamento, avaliação e sequenciamento virtual; apenas não se refletirá no próximo sequenciamento real.
 - [Concluído] [ID: T-021] Implementar "lista preview" ordenada por JSED no servidor e consumo pela UI no filtro "Automática".

#### Thresholds e Top‑3 (Aceitação de `mlHint`)
- [Concluído] [ID: T-043] Publicar thresholds offline em `client/public/ml/thresholds.json` com: `minScore ≥ 0.65`, `latencyMsMax ≤ 200`, `cooldownCalls = 20`, `accuracyTarget ≥ 0.75`, `recallPrioridadeMin ≥ 0.85`, `fallbackRateMax ≤ 0.30`.
- [Concluído] [ID: T-044] Validar aceitação de `mlHint` apenas se `numeroPrevisto ∈ top‑3 JSED` e `score ≥ minScore` (servidor: `IAManager.ts` linhas 63–78).
- [ID: T-048] Persistir últimas decisões de IA (fonte, confiança, top‑3, accepted_hint) e exibir no painel.

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
- [ID: T-042] Mitigação de firewall sem admin: limitar bind a `127.0.0.1`; em ambientes restritos, orientar execução local em cada guichê com sincronização manual de dados via pendrive; registrar alternativa de porta configurável (`PORT`) e teste de loopback (Windows normalmente permite loopback sem criar regra de firewall).
  - Implementado: adicionar `HOST='127.0.0.1'` por padrão e `listen(PORT, HOST, ...)` no servidor.
  - Testar: acesso externo pela rede deve falhar; acesso local `http://127.0.0.1:${PORT}` deve funcionar.
  - Aceite: nenhum privilégio administrativo necessário; sem criação de regra de firewall; logs mostram `Servidor rodando em http://127.0.0.1:${PORT}` e `CORS origins` apenas locais.

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
- [ID: T-091] Criar testes unitários para IAManager (validação top-3, cálculo JSED, WRR).
- [ID: T-092] Criar testes de integração para fluxo completo de chamada com IA.
- [ID: T-093] Adicionar testes E2E para aba de configurações (mudança de algoritmo, thresholds).

#### Peso 3 (Melhorias de Funcionalidade)
- [ID: T-094] Implementar exportação de estatísticas em CSV/JSON para análise externa.
- [ID: T-095] Adicionar filtros avançados no histórico (por data, tipo, guichê, motivo).
- [ID: T-096] Criar relatório de produtividade por atendente/guichê.

#### Peso 3 (Documentação Técnica)
- [ID: T-097] Documentar algoritmo JSED detalhadamente (fórmulas, parâmetros, exemplos).
- [ID: T-098] Criar diagramas de sequência para fluxos principais (emissão, chamada, finalização).
- [ID: T-099] Documentar API de configuração (todos os campos de ConfiguracoesGerais).

#### Peso 4 (Otimizações Futuras)
- [ID: T-100] Investigar uso de Web Workers para inferência ML (não bloquear thread principal).
- [ID: T-101] Implementar paginação/virtualização em listas longas (>100 senhas).
- [ID: T-102] Adicionar cache inteligente de previsões JSED (invalidar apenas quando fila muda).

### Resumo de Implementações Recentes

**Concluído em 2025-11-22:**
1. ✅ Atualização de thresholds para valores recomendados (minScore 0.65, fallbackRateMax 0.30)
2. ✅ Criação de aba "IA" no ConfigurationPanel com:
   - Status atual (modelo ONNX, algoritmo ativo, última decisão)
   - Visualização de thresholds de aceitação (read-only)
   - Placeholder para telemetria de decisões
3. ✅ Design Tokens CSS já existentes e funcionais (cores, foco, contraste AA)
4. ✅ Estilos responsivos para dashboard de IA

**Próximos Passos Prioritários:**
1. Conectar dashboard com dados reais (T-086)
2. Implementar visualização de telemetria (T-087)
3. Criar testes para IAManager (T-091)
4. Documentar algoritmo JSED (T-097)
5. Empacotar para entrega offline (T-037 a T-042)
