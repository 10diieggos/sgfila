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
- A11Y Focus Visível: tabular por todos os controles (`button`, `.btn`, `.btn-modal`, `.tab-link`, `.modal-close-btn`, inputs, `.guiche-card-selecao`) e verificar `outline` com `--focus-ring` e `outline-offset ≥ 2px`.
- Contraste AA (Tokens): validar pares principais com ferramenta de contraste (manual ou script) — links (`--link` sobre `--color-bg`), Badge IA, painel por tipo (texto vs fundos pastel).

### Estimadores e Percentis (Queue Analytics)
- [ID: T-070] `λ(hora)` (chegadas): validar contagem por janela (15 min/1 h), EWMA e winsorização p1/p99; comparar com contagem bruta. Aceite: `RMSE(λ)` reduzido vs baseline bruto em ≥ 10% no conjunto de validação.
- [ID: T-071] `μ(hora)` (serviço): estimar taxa efetiva por hora; ajustar por ausências. Aceite: desvio relativo médio `≤ 15%` quando comparado a tempos reais agregados.
- [ID: T-072] Percentis P50/P95/P99: comparar Harrell–Davis vs P² (streaming) e bootstrap de IC. Aceite: cobertura de IC95% entre `93–97%`; erro absoluto p95 `≤ 15%` vs medição real.
- [ID: T-078] Amostra insuficiente: com `nAmostras < 30`, marcar baixa confiabilidade e aplicar fallback (mediana do dia anterior). Aceite: nenhum bloqueio de UI; rótulos sinalizam baixa confiabilidade.

### Previsão de Tempo de Espera
- [ID: T-073] Fórmulas de fila (M/M/1, M/M/c) com `λ(hora)`/`μ(hora)`: calcular `Wq` e `W` previstos e comparar com medido. Métricas: `MAE`, `MAPE`, `p95 erro`. Aceite: `MAPE ≤ 20%` e `p95 erro ≤ 180 s` em cenários normais.
- [ID: T-074] Não‑estacionariedade: simular mudança súbita de taxa (rajada/turno) e verificar CUSUM/KPSS simples sinalizando janela inválida; α adaptativo reduz peso de histórico. Aceite: tempo de detecção `≤ 5 min` e redução de erro `≥ 10%` pós‑ajuste.
- Intervalos de confiança: expor IC80/IC95 para `prevTempoEsperaMs`. Aceite: cobertura observada `IC95` entre `92–98%` em validação.

### Cenários de Fila (Sintéticos)
- [ID: T-075] M/M/1: taxa estável; validar viés/variância de `λ/μ` e previsões `Wq`. Aceite: viés `≈ 0` e variância conforme `n` esperado.
- [ID: T-075] M/M/c (c ∈ {2,3}): múltiplos servidores; validar previsão com fórmula de Erlang‑C. Aceite: erro `MAPE ≤ 25%` em utilização `ρ < 0.85`.
- [ID: T-075] M/G/1 (serviço heavy‑tail): testar robustez de percentis e previsão. Aceite: percentis estáveis; p99 não explode sob winsorização.
- [ID: T-075] Rajadas/Burst: chegadas em pacotes; validar detecção de não‑estacionariedade e ajuste de α. Aceite: redução de erro pós‑detecção.
- [ID: T-075] Troca de turno: variação por hora; validar sazonalidade diária (Holt–Winters). Aceite: melhoria de `MAE` vs modelo sem sazonalidade.

### IA — Thresholds e Telemetria
- Thresholds de aceitação (`/ml/thresholds.json`):
  - `minScore ≥ 0.65` para aceitar `mlHint`.
  - `latencyMsMax ≤ 200` para validação de predição.
  - `cooldownCalls = 20` quando taxa de rejeição ≥ 50%.
  - Metas: `accuracyTarget ≥ 0.75`, `recallPrioridadeMin ≥ 0.85`, `fallbackRateMax ≤ 0.30`.
- Top‑3 JSED: servidor só aceita `mlHint` se `numeroPrevisto ∈ top3` calculado pelo `IAManager`.
- Telemetria local (`recordPrediction`): registrar `accepted_hint`, `latency_ms`, `score`, `source` e `timestamp`.
- Casos:
  - [ID: T-043] Carregar thresholds offline e validar aceitação de `mlHint` com score/latência.
  - [ID: T-044] Verificar rejeição quando fora do top‑3 JSED ou `score < minScore`.
  - [ID: T-048] Persistir e ler últimos 50 registros de telemetria para exibir badge de dica ML.

## Metas de Performance (Dev)
- Socket: latência média < `100 ms` e p95 < `200 ms` durante smoke.
- Render: tempo de frame crítico < `16 ms` nas telas principais (fila e painel).
- Bundle: evitar aumento > `10%` por turno em `client/dist`.
- Estatísticas: cálculo avançado sem bloquear UI (observado via responsividade).

### KPIs de Socket/Render/Bundle
- Socket RTT por operação: `emitirSenha`, `chamarSenha`, `finalizarAtendimento`, `solicitarPreviewJSED` — média/p95; alvo: média < `100 ms`, p95 < `200 ms`.
- Render Filtro Fila: troca de filtro (`emissao`/`tipo`/`automatica`) e busca — tempo até quadro estável (`≤ 16 ms` por interação, p95 ≤ `24 ms`).
- Bundle Inicial do Cliente: `app` + `vendor` gzip `≤ 250 KB`; chunk `ml` (ONNX/ORT) carregado sob demanda; crescimento por build `≤ 10%`.
- TTI (dev proxy): app interativo `≤ 1.5 s` em máquina padrão; sem bloqueios ao digitar no filtro.

### Protocolo de Medição
- Socket RTT: marcar `t0 = performance.now()` no `emit` e capturar o primeiro `estadoAtualizado` subsequente ou o evento específico (`previewJSED`). Calcular `Δ = t1 - t0`. Referência de código: `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\composables\useSocket.ts`.
- Render filtro: marcar antes da troca (`performance.mark('filtro-start')`), acionar mudança de estado, aguardar dois `requestAnimationFrame` e medir `performance.now() - tStart`. Referência: `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\components\QueueList.vue`.
- Bundle: executar `npm run build` no cliente e registrar tamanhos de `dist/assets/*.js` e `.css` (gzip). Registrar `manualChunks` para `ml` quando implementado.

### Metas de IA (Latência/Memória)
- Inicialização ORT WASM: `session.create` completa ≤ `1500 ms` (p95) com assets locais.
- Inferência ONNX (WASM SIMD): `latência p95 ≤ 35 ms`, `p99 ≤ 60 ms` por chamada.
- Fallback por regra: `≤ 5 ms` por avaliação.
- Memória adicional do runtime: `≤ 32 MB` durante inferência; modelo `≤ 1.5 MB` (INT8).
- Taxa de fallback: `≤ 30%` em operação normal; investigar se > 30%.

### ONNX Runtime WASM (Offline)
- Assets locais obrigatórios em `client/public/onnxruntime-web/` e modelo em `client/public/models/next_senha_int8.onnx`.
- Mapear `ort.env.wasm.wasmPaths` para arquivos locais e preferir build `SIMD` quando suportado.
- Testes:
  - [ID: T-045] Validar carregamento offline do ORT (sem rede) e predição ONNX.
  - [ID: T-046] Medir latência de inferência e registrar `latency_ms` na telemetria.
  - [ID: T-047] Avaliar uso de memória com DevTools (snapshot) durante 50 chamadas.

## Metas por Tela
- Fila de Espera: render < `16 ms` por interação; scroll suave; sem reflows excessivos.
- Painel de Configurações: troca de sub-aba < `100 ms`; edição em "Design Tokens" sem travamentos; render < `16 ms`.
- Histórico/Estatísticas Avançadas (quando ativo): tabela e gráficos responsivos; render < `16 ms`; sem bloqueio de input.

## Estado
- Em execução: `QA‑SGFila` — smoke de socket executado com sucesso; alternador de guichê validado via socket/UI lógica.
- Bloqueios: modelo ONNX ausente (afeta casos de IA); thresholds permissivos.
- Regressões/Bloqueios recentes: conexão Socket.IO falhando em dev com Vite na porta `5174` (CORS não permitia origem); corrigido adicionando `http://localhost:5174` e `http://127.0.0.1:5174` em `c:\Users\Diego\Downloads\nodep\sgfila\v3\server\src\server.ts`.

## Última atualização
- Gerado e pronto para manutenção pelos agentes.

## Referências e Persistência (Offline)
- Saídas analíticas servidas localmente de `c:\Users\Diego\Downloads\nodep\sgfila\v3\server\dist\estatisticas\*.json`.
- Nenhuma chamada HTTP externa; uso de `localStorage` para telemetria no cliente.

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

- Caso: Foco visível global
- IDs Relacionados: `[ID: T-053]`
- Passos: navegar com `Tab` por controles listados; observar `outline` azul com offset; capturar screenshots.
- Resultado: foco visível em todos os controles; contraste do indicador ≥ 3:1.
- Métricas: sem reflows perceptíveis ao focar.

- Caso: Contraste AA de links e Badge IA
- IDs Relacionados: `[ID: T-052, T-054, T-055]`
- Passos: abrir tela principal; medir contraste de `a` sobre `--color-bg`, do `.badge-ia` e dos painéis por tipo; ajustar se < 4.5:1.
- Resultado: todos os pares atendem AA; registrar valores medidos.
- Métricas: n/a.

- Caso: Validação de thresholds e top‑3 JSED
- IDs Relacionados: `[ID: T-043, T-044]`
- Passos: instalar assets ONNX locais; definir `minScore = 0.65`; executar 20 chamadas com `mlHint` dentro/fora do top‑3; medir latência e registrar telemetria
- Resultado: `mlHint` aceito apenas quando `top‑3` e `score ≥ 0.65`; rejeição correta fora dos critérios; telemetria contém `accepted_hint` e `latency_ms`
- Métricas: p95 inferência ≤ 35 ms; taxa de fallback ≤ 30%

**Evidências — Sessão 2025-11-22 15:12 BRT**
- Caso: Smoke Socket end‑to‑end (emitir → chamar → finalizar)
- IDs Relacionados: `[ID: T-004]`
- Passos: executar `node c:\Users\Diego\Downloads\nodep\sgfila\v3\qa\smoke-socket.js` com servidor ativo em `http://localhost:3000`
- Resultado: resumo abaixo capturado pelo script; operação concluída sem erros
- Métricas: `emitMs=29`, `callMs=41`, `finishMs=47` (média única — smoke); alvo p95 < 200 ms
- Evidência (SMOKE_SUMMARY): `{ "numero": "N-001", "guicheId": "guiche_1763829316566_qf8ypud5u", "latencies": { "emitMs": 29, "callMs": 41, "finishMs": 47 }, "tempos": { "espera": null, "atendimento": 33 }, "timestamps": { "chamada": null, "finalizado": 1763833007783 }, "servicoDoCliente": "Cadastro" }`

- Caso: Alternador de Guichê (finaliza se atendendo; chama próxima se livre)
- IDs Relacionados: `[ID: T-018, T-020]`
- Passos: via socket, emitir senha; chamar no `guicheId` livre; repetir ação para finalizar; observar atualização de `atendimentosAtuais[guicheId]` e `finalizadoTimestamp`; referência de UI: `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\components\CounterPanel.vue` (`handleGuicheClick`)
- Resultado: comportamento consistente com alternador — primeira interação chama próxima, segunda finaliza; sem autochamada (nenhum evento é emitido sem ação do usuário)
- Métricas: tempos de chamada/finishing dentro de metas de smoke; timestamps populados em finalização

**Casos E2E Críticos Propostos**
- Alternador de Guichê — fluxo manual sem autochamada: chamar quando vazio; finalizar quando em atendimento; validar estados e tempos. `[ID: T-018, T-020]`
- `solicitarPreviewJSED` vs chamada real: garantir consistência de ordenação e da senha chamada quando `algoritmo === 'jsed_fair_wrr'`. `[ID: T-024, T-023]`
- Aceitação de `mlHint` com `thresholds.json` local: somente quando `top‑3 JSED` e `score ≥ 0.65`; telemetria grava `accepted_hint` e `latency_ms`. `[ID: T-043, T-044, T-048]`
- Notificações de correção: `notificacaoAusencia` e `notificacaoNaoComparecimento` chegam ao cliente e disparam beep/alerta; UI destaca `tempoLimiteAtingido` quando ativo. `[ID: T-036]`
- Segurança: gate de `chamarProximaAutomatica` permanece desativado por padrão; ativação é opt‑in e auditada se habilitado. `[requisitos.md]`

## Instruções de Manutenção por Agente
- `QA‑SGFila`: registrar resultados, evidências e bloqueios por caso; manter estados.
- `Test Automation Engineer`: anexar logs/saídas e resumos de falhas dos scripts; propor novas automações.
- `UI/UX Planner` e `Interface Designer`: incluir verificações de acessibilidade/visual (contraste, foco, teclado).
- `Edge‑AI Engineer`: relatar latências de predição, taxa de fallback e aceitação de `mlHint`.
- `Performance Engineer`: registrar KPIs (tempo de render, TTI, FPS) e recomendações.
- `Security Reviewer`: marcar checagens de CORS, origem de assets e ausência de secrets.

### Socket/Render/Bundle — Casos de Medição
- [ID: T-060] Socket RTT `emitirSenha`: medir `Δ` do `emit('emitirSenha')` até `estadoAtualizado`; coletar 30 amostras; reportar média/p95.
- [ID: T-061] Socket RTT `solicitarPreviewJSED`: medir `Δ` do `emit('solicitarPreviewJSED')` até `previewJSED`; 30 amostras; alvo p95 < `200 ms`.
- [ID: T-062] Render Filtro Fila: alternar entre `emissao`/`tipo`/`automatica` e medir tempo de quadro estável (`≤ 16 ms`); 50 interações; reportar p95.
- [ID: T-063] Busca com debounce: digitar termos em `QueueList.vue` e validar que debounce `150 ms` evita regressões de frame; medir tempo por interação e frames perdidos.
- [ID: T-064] Bundle Build Budget: após `npm run build`, registrar tamanhos gzip de `app`, `vendor` e `ml` (se houver); validar `app+vendor ≤ 250 KB` e crescimento ≤ `10%` vs. referência anterior.
- [ID: T-065] TTI e Responsividade: medir tempo até interatividade e latência de input ao alternar filtros e digitar; nenhum bloqueio perceptível.

### Referências de Código para Medição
- `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\composables\useSocket.ts`: `emitirSenha`/`chamarSenha`/`solicitarPreviewJSED` (eventos `estadoAtualizado`, `previewJSED`).
- `c:\Users\Diego\Downloads\nodep\sgfila\v3\server\src\socket\SocketHandlers.ts`: `emitirEstadoAtualizado` e handlers correlatos.
- `c:\Users\Diego\Downloads\nodep\sgfila\v3\client\src\components\QueueList.vue`: filtros e ordenações; alvo de medição de render.
## Validação — Servidor Único Ubuntu Server 24.04 LTS
- Preparação
  - ISO: `ubuntu-24.04.1-live-server-amd64.iso` instalada em host servidor.
  - Instalação mínima com `OpenSSH`; hostname `sgfila-server`; DHCP ativo.
  - Partições: raiz `ext4` e dados `ext4` montada em `/mnt/sgfila`.

- Checklist do Servidor
  - Copiar pacote para `/opt/SGFila` e colocar Node portátil em `server/_runtime/node/`.
  - `PATH`: exportar `.../node/bin` temporariamente para sessão.
  - Start: `cd /opt/SGFila/servidor && HOST=0.0.0.0 PORT=3000 node dist/index.js`.
  - CORS: definir `CORS_ORIGIN` para IPs/faixas da LAN.
  - Health: `curl http://localhost:3000` retorna `200`.

- Checklist dos Guichês (Windows, sem admin)
  - Acessar `http://<IP_DO_SERVIDOR>:3000` em Chrome/Edge.
  - Executar smoke (emitir → chamar → finalizar) e registrar latências.
  - Confirmar ausência de prompts de firewall/admin.

- Firewall/CORS
  - Ingress no guichê não necessário; tráfego de saída para o servidor deve funcionar.
  - Registrar origens permitidas e bloqueadas (CORS) com logs do servidor.

- Offline
  - Desconectar internet do servidor; manter LAN.
  - Reexecutar smoke; confirmar `0` chamadas externas (inspecionar logs e DevTools do cliente).

- Persistência
  - Verificar escrita em `/opt/SGFila/_estatisticas/*.json`.
  - Reiniciar processo e confirmar continuidade de dados.

- KPIs
  - Socket: média < `100 ms`, p95 < `200 ms`.
  - TTI cliente: `≤ 1.5 s` em guichê padrão.
  - Bundle budgets conforme metas.

- Evidências
  - Capturas de `curl`, logs de start, CORS/handshake, smoke e métricas.
  - Registrar casos em “Template de Evidência” com IDs correlatos.
### Atualizações 2025-11-23 — Instalação e Importação
- Dispositivo alvo: SEGUNDO pendrive/SSD dedicado (o USB de instalação não pode ser particionado).
- Particionamento (Custom storage layout):
  - `ESP` 512MB FAT32 em `/boot/efi`.
  - `root` ext4 em `/`.
  - opcional `dados` ext4 em `/opt/SGFila/_estatisticas`.
- Importar build do Windows (NTFS):
  - `lsblk -f` → identificar partição NTFS.
  - `sudo mkdir -p /mnt/win && sudo mount -t ntfs3 -o ro /dev/<DISCO_PARTICAO> /mnt/win`.
  - `sudo mkdir -p /opt/SGFila && sudo cp -r "/mnt/win/Users/Diego/Downloads/nodep/sgfila/build/SGFila" /opt/SGFila/`.
- Inicializar servidor:
  - `cd /opt/SGFila/SGFila/server/scripts && chmod +x start-sgfila.sh && ./start-sgfila.sh`.
- Health/CORS:
  - `curl http://localhost:3000` deve retornar 200.
  - Definir `CORS_ORIGIN` para IPs/faixas da LAN quando necessário.

### Scripts Windows — Operação
- Produção
  - Start: `v3/servers_inicializar/START.bat` inicia `http://0.0.0.0:3000`.
  - Stop: `v3/servers_inicializar/STOP.bat` encerra processos na porta `3000`.
- Desenvolvimento
  - Start: `v3/servers_inicializar/START_dev.bat` inicia watchers (server 3000, client 5173) com `VITE_SERVER_URL`.
  - Stop: `v3/servers_inicializar/STOP_dev.bat` encerra `3000/5173/5174`.
