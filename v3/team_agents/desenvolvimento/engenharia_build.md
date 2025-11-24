# Plano de Entrega — Engenharia de Build/Release (SGFila v3)

## Papel do Agente
- Empacotar e distribuir o SGFila para execução offline, sem privilégios administrativos.
- Orquestrar builds de `v3/client` e `v3/server` com cache de dependências e scripts portáteis.
- Mitigar restrições de firewall sem admin: operar com servidor central único na LAN; sem sincronização física via pendrive.
- Validar pós‑build: smoke, funcionalidade offline, ausência de chamadas externas e persistência local.
- Manter documentação operável: atualizar `proximos_passos.md` e `testes.md` com procedimentos, validações e evidências.

## Objetivos e Princípios
- Portabilidade: rodar em Windows sem instalar nada no sistema ou exigir admin.
- Offline‑first: todas as dependências e assets locais; nenhuma chamada externa.
- Confiabilidade: builds reproduzíveis com verificação de integridade e logs.
- Segurança: bind em loopback, CORS restrito, sem segredos em arquivos.
- UX operacional: iniciar/parar via `.bat` com mensagens claras e validações básicas.

## Estado Atual — Migração para Ubuntu Server
- Decisão: substituir Void por Ubuntu Server 24.04 LTS (sem GUI) para servidor único na LAN.
- USB de instalação: `ubuntu-24.04.1-live-server-amd64.iso` criado com Rufus (`GPT`, `UEFI`).
- Estratégia de cópia: montar partição NTFS do Windows no Ubuntu (`ntfs3`) e copiar `SGFila` para `/opt/SGFila`.
- Script de start ajustado: `v3/server/scripts/start-sgfila.sh` usando `dist/server/src/server.js`, `HOST=0.0.0.0` e `CORS_ORIGIN` baseado no IP do servidor.

## Entregáveis
- Pacote SGFila para servidor único (Ubuntu):
  - `v3/client` e `v3/server` com `node_modules` vendorizados e `package-lock.json`.
  - Builds: `v3/server/dist/` e `v3/client/dist/`.
  - Assets de IA: `client/public/models/*.onnx` e `client/public/onnxruntime-web/*`.
  - Scripts: `server/scripts/start-sgfila.sh` e utilitários de inicialização.
  - Estrutura final no servidor: `/opt/SGFila/cliente`, `/opt/SGFila/servidor`, `/opt/SGFila/_logs`, `/opt/SGFila/_estatisticas`.
- Procedimentos de build/validação documentados em `proximos_passos.md` e `testes.md`.
- Evidências de firewall/CORS: servidor em `0.0.0.0`, origens restritas por IP/faixa.

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
- Modelo de produção: servidor central único na LAN (Ubuntu Server) atendendo todos os guichês.
  - Servidor expõe SGFila em `0.0.0.0:<PORT>` e serve o cliente `v3/client/dist` pelo Express.
  - Guichês Windows acessam via navegador `http://<IP_DO_SERVIDOR>:<PORT>` sem instalar nada e sem admin.
  - Persistência e estatísticas concentradas no servidor em `/opt/SGFila/_estatisticas`.
- Scripts de inicialização:
  - Servidor: `start-sgfila.sh` carrega Node portátil e inicia o Express servindo o cliente.
  - Cliente (opcional): `.bat` simples para abrir a URL do servidor no navegador padrão.
- Sem privilégios administrativos nos guichês:
  - Não alterar `PATH`, registro ou regras de firewall no Windows dos guichês.
  - Usar apenas caminhos relativos e variáveis de ambiente no servidor (`.env`).
  - Sincronização física por pendrive foi descartada; operações centralizadas.

## Mitigação de Firewall sem Admin
- Diretriz: operar dentro das permissões do usuário nos guichês; configurações residem no servidor central.
- Operação recomendada:
  - Servidor central: bind `HOST=0.0.0.0` e porta padrão `3000` (ou `8080`).
  - Guichês Windows: tráfego de saída para `http://<IP_DO_SERVIDOR>:<PORT>` geralmente é permitido sem admin; bloqueio ocorre no tráfego de entrada, que não é necessário.
  - CORS restrito no servidor aos IPs/faixas da LAN.
- Opções a evitar sem admin nos guichês:
  - Alterar regras com `netsh advfirewall`.
  - Criar túneis externos/WEBRTC/TURN.
- Alternativas no servidor (sem afetar guichês):
  - Selecionar porta comum na LAN (`3000`/`8080`). Se a política exigir 80/443, configurar no servidor (live) e manter restrições de CORS; clientes permanecem sem admin.
- Testes e evidências:
  - Validar que o cliente no guichê acessa o servidor por IP e porta definidos.
  - Registrar CORS e logs de inicialização com `HOST`, `PORT` e origens permitidas.

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

## Ubuntu Server — Instalação e Deploy

### Objetivo
- Operar SGFila como servidor central único em Ubuntu Server 24.04 LTS, atendendo todos os guichês da LAN.

### Arquitetura
- Servidor central: Ubuntu Server headless rodando SGFila (`v3/server`) e servindo o cliente (`v3/client/dist`) via Express.
- Guichês: navegadores Windows acessando `http://<IP_DO_SERVIDOR>:3000` sem admin.

### Distro
- Escolhida: Ubuntu Server 24.04 LTS (glibc) — estável, sem GUI, compatível com `node-v20.18.0-linux-x64`.

### Preparação dos Artefatos (Windows antes do reboot)
- Build e validação:
  - `cd v3/server && npm ci && npm run lint && npm run build`
  - `cd ../client && npm ci && npm run build`
  - Verificar saída: `v3/server/dist/` e `v3/client/dist/`.
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
node dist/server/src/server.js 2>&1 | tee -a "$BASE_DIR/../_logs/server_$(date +%F).log"
```

### Instalação Ubuntu Server
- USB de instalação: criar com Rufus (`GPT`, `UEFI`).
- Instalação mínima com `OpenSSH`; hostname `sgfila-server`; DHCP.

### Copiar SGFila a partir do Windows (montagem NTFS)
- Identificar partição: `lsblk -f` (buscar `ntfs/ntfs3`).
- Montar NTFS em modo leitura: `sudo mkdir -p /mnt/win && sudo mount -t ntfs3 -o ro /dev/<DISCO_PARTICAO> /mnt/win`.
- Copiar: `sudo mkdir -p /opt/SGFila && sudo cp -r "/mnt/win/Users/Diego/Downloads/nodep/sgfila" /opt/SGFila`.
- Ajustar runtime: confirmar `v3/server/_runtime/node/node-v20.18.0-linux-x64/`.
- Executar: `cd /opt/SGFila/v3/server/scripts && chmod +x start-sgfila.sh && ./start-sgfila.sh`.

### Configuração de Rede
- SGFila escuta em `0.0.0.0:3000` e serve o cliente.
- Guichês acessam `http://<IP_DO_SERVIDOR>:3000`.
- CORS restrito por IP/faixa; DHCP padrão em Ubuntu.

### Persistência de Estatísticas
- Direcionar escrita para `/mnt/sgfila/SGFila/_estatisticas/` ajustando caminhos no servidor.
- Garantir que a partição de dados esteja montada antes do start.

### Validações
- Servidor: `curl http://localhost:3000` retorna 200.
- Guichês: abrir URL do servidor e executar smoke.
- Offline: desconectar internet; 0 chamadas externas.
- Firewall Windows: sem prompts nos guichês.

### Operação e Recuperação
- Reinício rápido: reexecutar `start-sgfila.sh`.
- Troca de porta: exportar `PORT=...` antes de iniciar.
- IP estático (opcional): configurar via GUI do live ou `netplan` temporário.

### Segurança
- Servidor só exposto na LAN; sem serviços externos.
- Sem segredos/tokens; logs sem PII.
- CORS restrito por IP quando aplicável.

### Artefatos e Checksums
- Gerar SHA256 para `dist/`, assets IA e Node portátil glibc; armazenar em `/opt/SGFila/_builds/checksums.txt`.

### Plano de Contingência
- Se a máquina não boota por USB, usar um mini‑PC Linux dedicado como servidor central.

## Validação e Evidências (Ubuntu Server)
- Health: `curl http://localhost:3000`.
- Acesso dos guichês: abrir `http://<IP_DO_SERVIDOR>:3000`.
- CORS: registrar origens permitidas/bloqueadas.
- Offline: operação sem internet; 0 chamadas externas.
- Persistência: escrita em `/opt/SGFila/_estatisticas/*.json`.

## Próximas Ações
- Instalar o Ubuntu Server com USB preparado por Rufus.
- Montar NTFS e copiar SGFila para `/opt/SGFila`.
- Executar `start-sgfila.sh` e validar smoke/CORS/firewall.
- Registrar resultados em `proximos_passos.md` e evidências em `testes.md`.

## Checklist Rápido — Execução
- Windows (antes do reboot):
  - Builds e empacotamento realizados; pasta oficial: `build/SGFila`
- Ubuntu (após instalar):
  - Montar NTFS: `v3/server/scripts/1_mount_windows_ntfs.sh /dev/<DISCO_PARTICAO>`
  - Copiar: `v3/server/scripts/2_copy_sgfila_to_opt.sh` (ou informar caminho fonte)
  - Iniciar: `v3/server/scripts/3_start_server.sh`

## Pasta oficial de produção
- Definição: `C:\Users\Diego\Downloads\nodep\sgfila\build\SGFila` é a pasta única e oficial para distribuição em pendrive e deploy offline.
- Conteúdo mínimo:
  - `client/dist` (artefatos Vite build)
  - `server/dist` (JS compilado do TypeScript)
  - `server/_runtime/node` (Node para Linux x64)
  - `server/scripts` (scripts de inicialização do servidor)
- Ações aplicadas:
  - Remoção de duplicatas: `v3/server/_runtime/node` removido.
  - Remoção de scripts obsoletos em `v3/servers_inicializar` (mantidos apenas START/STOP e START_dev/STOP_dev).
