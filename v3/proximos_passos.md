## Pendências e Pesos

### Peso 5 (Bloqueios/Alta Prioridade)
- [Concluído] Incluir `roteamento` e `algoritmoVersao` em `StateManager.mesclarConfiguracoes` com merge de defaults na migração.
- [Concluído] Adicionar listeners de cliente para `notificacaoAusencia` e `notificacaoNaoComparecimento` em `useSocket.ts`.
- [Concluído] Destacar visualmente na UI senhas com `tempoLimiteAtingido` quando `destacarSenhasTempoLimite` estiver ativo; exibir histórico de ausências quando configurado.
- Disponibilizar `client/public/models/next_senha_int8.onnx` (e assets `onnxruntime-web`) para habilitar inferência ONNX ou indicar explicitamente fallback na UI.
- [Concluído] Corrigir tipagem do cliente para refletir `'jsed_fair_wrr'` nos componentes afetados e aceitar campos opcionais de telemetria.

### Peso 4 (Confiabilidade/Consistência)
- [Concluído] Garantir fallback claro de `estado.configuracoes.roteamento` em `QueueService` quando carregar dados antigos.
- [Concluído] Ajustar `recordPrediction` para aceitar `accepted_hint` e `latency_ms` mantendo compatibilidade.
- Habilitar o algoritmo `'jsed_fair_wrr'` nas configurações apenas por ação do atendente (sem autochamada), mantendo a decisão no servidor com validação top‑3 e `mlHint` opcional.

### Peso 3 (Qualidade/Build)
- Rodar e fechar `npm run type-check && npm run build` no servidor e no cliente após patches.
- Reexecutar smoke/E2E (`v3/qa/smoke-socket.js`) e validar métricas de latência e campos: `servicoDoCliente`, `tempoEspera`, `chamadaTimestamp`, `finalizadoTimestamp`.
- Solicitar nova auditoria do Supervisor Crítico após correções.

### Peso 2 (UX e Telemetria)
- Indicar na UI quando a IA estiver em fallback (sem modelo) e quando uma dica ML foi aceita/rejeitada.
- Mostrar histórico de ausências e contadores quando `mostrarHistoricoAusencias` ativo.
- Exibir feedback dos eventos de correção (ausência/não comparecimento) com alerta sonoro/visual conforme configuração.

### Peso 1 (Documentação/Instalação)
- Planejar instalação offline: cache de `node_modules` ou pacote zip com dependências preinstaladas.
- Documentar no README os requisitos para IA (modelo ONNX e assets) e comportamento quando em fallback.

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


## Adicionados pelo desenvolvedor humano
- Remover a aba "Correções" das configurações na UI
- Simplificar a aba "Proporção e Comportamento" para ter apenas os campos de 
  "Configurações de Proporção" e "Comportamento da Fila" e testar se a configuração por meio
  desses campos está operacional
- Adicionar o campo "Outras Configurações" na aba "Proporção e Comportamento" e colocar nele a opção de não chamar novamente senhas "Ausentes" enviando-as diretamente para o histórico
