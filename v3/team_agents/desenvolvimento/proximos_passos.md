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
- Implementar dashboard de IA no ConfigurationPanel.vue
- Conectar interface com dados reais do StateManager
- Adicionar visualização de métricas e histórico de decisões

### Peso 1 (CRÍTICO - IA Operacional)
- [Concluído] [ID: T-016] Criar `IAManager.ts` com algoritmo de decisão JSED/Fairness/WRR (ver `v3/server/src/services/IAManager.ts`).
- [Concluído] [ID: T-017] Integrar IA ao `QueueService` substituindo lógica fixa e registrar decisão com confiança. Implementado ramo `jsed_fair_wrr` em `chamarSenha`.
- [ID: T-018] Implementar fallback robusto no sequenciamento e sinalização na UI quando ativo.
- [ID: T-019] Coletar métricas para aprendizado contínuo (`tempoEspera`, `prioridade`, `tipoServico`, `resultadoDecisao`).
- [ID: T-020] Opção do atendente desligar o sequenciamento da IA e adotar um dos algoritmos na seção "Comportamento da fila" na aba "Configurações". A IA continua funcional para treinamento, avaliação e sequenciamento virtual; apenas não se refletirá no próximo sequenciamento real.
 - [Concluído] [ID: T-021] Implementar "lista preview" ordenada por JSED no servidor e consumo pela UI no filtro "Automática".

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

### Peso 2 (UX e Telemetria)
- [Concluído] [ID: T-006] Indicar na UI quando a IA estiver em fallback (sem modelo) e quando uma dica ML foi aceita/rejeitada.
- [ID: T-007] Mostrar histórico de ausências e contadores quando `mostrarHistoricoAusencias` ativo.
- [ID: T-008] Exibir feedback dos eventos de correção (ausência/não comparecimento) com alerta sonoro/visual conforme configuração.
- [Concluído] [ID: T-011] Adotar `designTokens.colors.primary` no título da Fila de Espera.
- [Concluído] [ID: T-012] Instrumentar tempo de troca de sub-aba no Painel de Configurações e registrar métricas.
- [ID: T-022] Persistir telemetria de decisões da IA no servidor (fonte, confiança, top‑3, wrrAtivo) e expor no painel de IA.
 - [Concluído] [ID: T-022] Persistir telemetria de decisões da IA no servidor (fonte, confiança, top‑3, wrrAtivo) e expor última decisão via `estado.ultimaDecisaoIA`.
 - [ID: T-023] Ajustar UI do filtro "Automática" para indicar que ordenação está sincronizada com servidor quando `algoritmo === 'jsed_fair_wrr'`.

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
 - [ID: T-030] Documentar procedimentos de build e validação em `testes.md` e `proximos_passos.md` com evidências.

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
