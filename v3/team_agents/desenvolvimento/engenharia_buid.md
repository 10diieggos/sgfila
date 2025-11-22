# Plano de Entrega — Engenharia de Build/Release (SGFila v3)

## Papel do Agente
- Empacotar e distribuir o SGFila para execução offline, sem privilégios administrativos.
- Orquestrar builds de `v3/client` e `v3/server` com cache de dependências e scripts `.bat` portáteis.
- Mitigar restrições de firewall sem admin: priorizar loopback (`127.0.0.1`), execução local por guichê e sincronização via pendrive.
- Validar pós‑build: smoke, funcionalidade offline, ausência de chamadas externas e persistência local.
- Manter documentação operável: atualizar `proximos_passos.md` e `testes.md` com procedimentos, validações e evidências.

## Objetivos e Princípios
- Portabilidade: rodar em Windows sem instalar nada no sistema ou exigir admin.
- Offline‑first: todas as dependências e assets locais; nenhuma chamada externa.
- Confiabilidade: builds reproduzíveis com verificação de integridade e logs.
- Segurança: bind em loopback, CORS restrito, sem segredos em arquivos.
- UX operacional: iniciar/parar via `.bat` com mensagens claras e validações básicas.

## Entregáveis
- Pacote USB contendo:
  - `v3/client` e `v3/server` com `node_modules` vendorizados e `package-lock.json` preservado.
  - Assets de IA: `client/public/models/*.onnx` e `client/public/onnxruntime-web/*`.
  - Scripts `.bat`: `start-server-dev.bat`, `start-client-dev.bat`, `start-sgfila.bat`, `stop-sgfila.bat`.
  - Estrutura de pastas: `SGFila/cliente`, `SGFila/servidor`, `SGFila/_logs`, `SGFila/_builds`, `SGFila/_estatisticas`.
  - Checksums (`SHA256`) dos principais artefatos e logs de build.
- Procedimentos de build e validação documentados em `proximos_passos.md` e `testes.md`.
- Evidências de firewall: servidor em `127.0.0.1`, CORS restrito e testes de acesso local.

## Procedimentos de Build
- Preparação:
  - Fixar versão do Node portátil no pacote (sem instalar no sistema).
  - Usar `npm ci` quando online para gerar vendor; no pacote final, executar sem rede.
- Servidor (`v3/server`):
  - `npm run lint` e `npm run build` com saída para `dist/`.
  - Variáveis padrão: `HOST=127.0.0.1`, `PORT=3000`, `CORS_ORIGIN=http://127.0.0.1:3000`.
- Cliente (`v3/client`):
  - `npm run build` gerando `dist/` para servir pelo Express.
  - Code splitting para ML (quando aplicável) e assets em `public/onnxruntime-web/`.
- Empacotamento:
  - Copiar `node_modules` e `dist/` para o pacote USB.
  - Gerar checksums e logs de build em `SGFila/_builds`.

## Estratégia de Deploy Offline
- Modo local por guichê:
  - Executar servidor e cliente na mesma máquina, bindando em `127.0.0.1`.
  - Persistir estatísticas em `v3/server/dist/estatisticas/*.json`.
  - Sincronização de dados via pendrive entre postos, quando necessário.
- Scripts `.bat`:
  - DEV: iniciar watchers (apenas ambientes de desenvolvimento controlado).
  - PROD: compilar e iniciar servidor; abrir `http://127.0.0.1:3000` no navegador.
- Sem privilégios administrativos:
  - Evitar qualquer modificação em `PATH`, registro ou regras de firewall.
  - Usar caminhos relativos e configuração via `.env.local` no pacote.

## Mitigação de Firewall sem Admin
- Diretriz: não contornar políticas de segurança; operar dentro das permissões do usuário.
- Opções viáveis:
  - Loopback puro: bind `HOST=127.0.0.1`. O firewall do Windows não bloqueia tráfego de loopback por padrão; ideal para operação local.
  - Execução local por guichê: cada posto roda cliente+servidor localmente; consolidação de dados por sincronização física (pendrive) ou export/import.
  - IPC local: comunicação cliente‑servidor por `localhost` ou, se necessário, `Named Pipes (\\.\pipe\sgfila)` para cenários estritos no mesmo host.
- Opções a evitar sem admin:
  - Abrir portas na rede local com `netsh advfirewall` (exige admin).
  - Túnel externo/WEBRTC/TURN (requer internet/infra e pode violar política).
- Testes e evidências:
  - Validar que acesso externo falha e local funciona (`127.0.0.1`).
  - Registrar CORS restrito e logs de inicialização com `HOST`/`ORIGINS`.

## Validação Pós‑Build
- Smoke: iniciar servidor e cliente; emitir/chamar/finalizar senha; verificar eventos de correção (tempo limite/ausência) e preview JSED.
- Offline: bloquear internet; checar ausência de chamadas externas e funcionamento completo.
- Estatísticas: geração de arquivos em `dist/estatisticas` e leitura pelo painel.
- Acessibilidade/UX: foco visível, contraste AA, teclado funcional nos painéis.
- Performance: latência de socket (RTT), tempo de render de filtros, bundle budgets.

## Documentação e Handoff
- Atualizar `v3/team_agents/desenvolvimento/proximos_passos.md` com status e próximos passos após cada ciclo.
- Atualizar `v3/team_agents/desenvolvimento/testes.md` com checklists de validação e evidências (CORS/handshake, firewall, offline, performance).
- Preparar pacote e instruções para `QA‑SGFila` com passos de execução.

## KPIs e Qualidade
- Build: 100% sem erros em lint/build; reprodutível com logs.
- Offline: 0 chamadas externas; todos fluxos críticos funcionais.
- Firewall: bind em loopback, sem admin; acesso local ok, externo bloqueado.
- Performance: RTT p95 dentro do alvo e bundle ≤ orçamento.
- Acessibilidade: WCAG 2.1 AA nos principais elementos.

## Próximos Passos
- Implementar gating de `ML Hint` (score/latency) no servidor e medir `latency_ms` no cliente.
- Iniciar estimadores `λ/μ` e percentis; integrar limite dinâmico de tempo por tipo/hora.
- Concluir scripts `.bat` e geração de pacotes com checksums.
- Completar validações de CORS/handshake e registrar evidências em `testes.md`.

---

## Boot Linux Live USB (Servidor Central) — Procedimento de Build e Deploy

### Objetivo
- Rodar um servidor central SGFila em um Linux “live” inicializado por USB, evitando o firewall do Windows. Nenhuma instalação permanente é feita; tudo opera em sessão live e com artefatos portáteis.

### Arquitetura
- Servidor central: Linux Live headless rodando SGFila (`v3/server`) e servindo o cliente (`v3/client/dist`) via Express.
- Guichês: navegadores Windows acessando `http://<IP_DO_SERVIDOR>:3000` sem precisar de admin.

### Distro mínima (sem GUI)
- Preferência: Void Linux (glibc) base — pequena, headless, compatível com `node-vXX.Y.Z-linux-x64` (glibc).
  - Vantagens: imagem enxuta, boot rápido, glibc nativa (sem compatibilidade adicional).
  - Persistência: usar partição separada (FAT32/NTFS) para `SGFila/` e logs.
- Alternativa: Porteus (glibc) — live modular, muito pequena; também compatível com Node glibc.
- Plano B extremo: TinyCore (CorePure64) — viável, porém exige mais ajustes e dependências; usar apenas se necessário.

### Preparação dos Artefatos (Máquina de desenvolvimento)
- Build e validação:
  - `cd v3/server && npm ci && npm run lint && npm run build`
  - `cd ../client && npm ci && npm run build`
  - Verificar saída: `v3/server/dist/` e `v3/client/dist/`
- Node portátil para Linux (glibc):
  - Baixar `node-vXX.Y.Z-linux-x64.tar.xz` (glibc).
  - Colocar descompactado em `SGFila/server/_runtime/node/`.
- Estrutura do pacote USB (pasta `SGFila/`):
  - `servidor/`:
    - `dist/` (build do servidor)
    - `node_modules/` (vendorizado)
    - `_runtime/node/node-vXX.Y.Z-linux-x64/`
    - `.env` com `HOST=0.0.0.0`, `PORT=3000`, `CORS_ORIGIN=http://<IP_SERVIDOR>:3000`
    - `start-sgfila.sh` (ver abaixo)
  - `cliente/`:
    - `dist/` (build do cliente a ser servido pelo Express)
    - `public/models/*.onnx` e `public/onnxruntime-web/*` (assets de IA)
  - `_estatisticas/` (pasta alvo para persistência local)
  - `_logs/` e `_builds/` (logs e checksums)
- Script `start-sgfila.sh` (sessão live):
  - Detecta Node portátil e exporta `PATH`
  - Inicia servidor SGFila servindo `cliente/dist`

Exemplo `start-sgfila.sh` (auto‑detecção de runtime):

```
#!/usr/bin/env bash
set -euo pipefail
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
for d in "$BASE_DIR/_runtime/node"/*/bin; do
  export PATH="$d:$PATH"
  break
done

export HOST="0.0.0.0"
export PORT="3000"
export CORS_ORIGIN="http://$HOST:$PORT"
export ESTATISTICAS_DIR="$BASE_DIR/../_estatisticas"
mkdir -p "$ESTATISTICAS_DIR"

cd "$BASE_DIR/../servidor"
node dist/index.js 2>&1 | tee -a "$BASE_DIR/../_logs/server_$(date +%F).log"
```

### Preparação do USB Bootável (Void/Porteus headless)
- Baixar ISO da distro escolhida (Void base x86_64 ou Porteus).
- Criar USB bootável (ferramenta apropriada ao seu ambiente).
- Criar segunda partição de dados (FAT32/NTFS) no USB para `SGFila/` e persistência.
- Copiar a pasta `SGFila/` para a partição de dados.

### Execução (Servidor Central — Void/Porteus)
- Boot pelo USB no computador servidor (Void/Porteus headless).
- Obter IP: `ip addr` (ex.: `192.168.0.50`).
- Montar a partição de dados: `mkdir -p /mnt/sgfila && mount /dev/sdX2 /mnt/sgfila`.
- `cd /mnt/sgfila/SGFila/server/scripts && chmod +x start-sgfila.sh && ./start-sgfila.sh`.
- Logs em `/mnt/sgfila/SGFila/_logs/`; cliente servido via Express a partir de `client/dist`.

### Configuração de Rede
- SGFila escuta em `0.0.0.0:3000` e serve o cliente pelo Express.
- Navegadores dos guichês acessam `http://<IP_DO_SERVIDOR>:3000`.
- CORS restrito pode ser ajustado para IPs da LAN, se necessário.
- DHCP padrão em Alpine deve obter IP automaticamente; opcionalmente definir IP estático temporário.

### Persistência de Estatísticas
- Direcionar escrita para `/mnt/sgfila/SGFila/_estatisticas/` ajustando caminhos no servidor.
- Garantir que a partição de dados esteja montada antes do start.

### Validações
- Cliente Windows: abrir `http://<IP_DO_SERVIDOR>:3000` e executar smoke (emitir/chamar/finalizar).
- IA/Preview JSED: validar consistência com decisão real.
- Offline: desconectar internet; confirmar 0 chamadas externas.
- Firewall Windows: confirmar que os guichês conectam sem qualquer prompt de admin (o servidor está no Linux live).

### Operação e Recuperação
- Reinício rápido: reexecutar `start-sgfila.sh`.
- Troca de porta: exportar `PORT=...` antes de iniciar.
- IP estático (opcional): configurar via GUI do live ou `netplan` temporário.

### Segurança
- Servidor só exposto na LAN; sem serviços externos.
- Sem segredos/tokens; logs sem PII.
- CORS restrito por IP quando aplicável.

### Artefatos e Checksums
- Gerar SHA256 para `dist/`, assets IA e Node portátil musl; armazenar em `SGFila/_builds/checksums.txt`.

### Plano de Contingência
- Se a máquina não boota por USB, usar um mini‑PC Linux dedicado como servidor central.
- Se necessário, testar QEMU portátil com `hostfwd` como plano C (restrito ao ambiente).
