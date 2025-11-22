## Premissas Operacionais
- Chamada nunca automática: o atendente deve acionar manualmente no painel de guichê (alternador de chamada sem escolha de senha e finalização). Validar que `chamarProximaAutomatica` permaneça desativado.
- O SGFila funcionará em um pendrive.
- Uma estratégia para contornar o firewall do Windows será desenvolvida para que o SGFila possa ser servido para todos os guiches pela rede interna.

## Requisitos de Independência e Segurança
- Execução offline: nenhuma chamada HTTP externa em tempo de execução; arquivos de modelo/thresholds devem ser servidos localmente (`/models/*.onnx`, `/ml/thresholds.json`). Na ausência de modelo ONNX, o fallback determinístico deve permanecer funcional.
- Sem privilégios administrativos: não requer UAC/sudo; scripts e serviços devem rodar com permissões de usuário padrão e escrever apenas dentro do diretório do projeto (`v3/server/dados.json`, `v3/server/dist/estatisticas/`).
- Instalação simples: dependências instaladas apenas em `v3/server` e `v3/client` via `npm install`; suportar Node portátil e execução por `.bat` sem necessidade de configurar PATH do sistema; não exigir Docker.
- Autochamada desativada por padrão: qualquer ativação de `chamarProximaAutomatica` deve ser opt‑in explícito via painel e registrada em auditoria quando `seguranca.logAuditoria` estiver habilitado.
- Telemetria local: registros de predição devem permanecer no armazenamento local do navegador (`localStorage`) e não devem ser enviados para rede.
- Persistência local de estatísticas: snapshots e agregados históricos em `v3/server/dist/estatisticas/*.json`, sem banco de dados externo.
- CORS em produção: recomendado restringir `origin` do Socket.IO/HTTP ao domínio esperado; não publicar com `origin: "*"` em ambientes sensíveis.
