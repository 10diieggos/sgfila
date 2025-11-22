# Plano e Estado de Testes — Equipe SGFILA

## Escopo
- UI/UX: navegação, destaques de tempo‑limite, badges de ausências, interações de painel.
- Socket: emissão, chamada, finalização, devolução, ausência e notificações.
- IA: thresholds, cooldown, fallback ONNX, latência de predição, aceitação de `mlHint`.
- Estatísticas: verificação de flags e métricas básicas/avançadas.

## Bateria de Testes
- Smoke Socket: valida latências, timestamps e campos essenciais.
- UI Tempo‑limite: senhas com `tempoLimiteAtingido` devem destacar quando flag ativa.
- UI Ausências: badge visível com contador quando `mostrarHistoricoAusencias` ativo.
- Listeners Correções: cliente recebe `notificacaoAusencia` e `notificacaoNaoComparecimento`.
- Roteamento JSED: ativação manual sem autochamada; top‑3 aceita `mlHint`.
- IA Fallback: inexiste modelo → predição fallback e UI sinaliza.
- Telemetria: gravação local com `accepted_hint` e `latency_ms`.

## Metas de Performance (Dev)
- Socket: latência média < `100 ms` e p95 < `200 ms` durante smoke.
- Render: tempo de frame crítico < `16 ms` nas telas principais (fila e painel).
- Bundle: evitar aumento > `10%` por turno em `client/dist`.
- Estatísticas: cálculo avançado sem bloquear UI (observado via responsividade).

## Metas por Tela
- Fila de Espera: render < `16 ms` por interação; scroll suave; sem reflows excessivos.
- Painel de Configurações: troca de sub-aba < `100 ms`; edição em "Design Tokens" sem travamentos; render < `16 ms`.
- Histórico/Estatísticas Avançadas (quando ativo): tabela e gráficos responsivos; render < `16 ms`; sem bloqueio de input.

## Estado
- Planejado: testes definidos e prontos para execução.
- Em execução: por `QA‑SGFila` conforme commit atual.
- Bloqueios: modelo ONNX ausente; thresholds permissivos.

## Última atualização
- Gerado e pronto para manutenção pelos agentes.

## Rastreamento por ID de Tarefa
- Referencie `[ID: T-###]` de `proximos_passos.md` em cada caso e evidência registrada.

## Template de Evidência
- Caso: Descrição breve
- IDs Relacionados: `[ID: T-###]`
- Passos: ...
- Resultado: ...
- Métricas: latência/frame/bundle conforme metas

## Evidências Recentes
- Caso: Troca de sub-aba em Configurações
- IDs Relacionados: `[ID: T-012]`
- Passos: interagir com sub-abas e monitorar console
- Resultado: console registra tempo de troca de sub-aba (ms)
- Métricas: objetivo < 100 ms (dev)

- Caso: Indicadores de IA (fallback e dica ML)
- IDs Relacionados: `[ID: T-006]`
- Passos: abrir Fila de Espera; verificar badges "IA" e "Dica ML"; provocar chamada com e sem modelo; observar atualização do badge e leitura de `accepted_hint` em telemetria local
- Resultado: badge "IA" exibe Fallback quando runtime indisponível; badge "Dica ML" alterna entre Aceita/Rejeitada conforme última telemetria
- Métricas: leitura e atualização em até 1500 ms; sem bloqueio de UI

## Instruções de Manutenção por Agente
- `QA‑SGFila`: registrar resultados, evidências e bloqueios por caso; manter estados.
- `Test Automation Engineer`: anexar logs/saídas e resumos de falhas dos scripts; propor novas automações.
- `UI/UX Planner` e `Interface Designer`: incluir verificações de acessibilidade/visual (contraste, foco, teclado).
- `Edge‑AI Engineer`: relatar latências de predição, taxa de fallback e aceitação de `mlHint`.
- `Performance Engineer`: registrar KPIs (tempo de render, TTI, FPS) e recomendações.
- `Security Reviewer`: marcar checagens de CORS, origem de assets e ausência de secrets.
