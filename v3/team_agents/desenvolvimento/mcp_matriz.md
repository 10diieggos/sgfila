# MCP — Matriz de Ferramentas por Agente

## Uso
- Referência central dos MCPs previstos nos arquivos de configuração dos agentes.
- Apenas leitura/planejamento; execução deve respeitar requisitos offline e sem privilégios.

## Política de Uso e Revisão
- MCPs são usados exclusivamente para pesquisa, leitura e planejamento; nunca para ações que exijam privilégios ou acesso externo obrigatório.
- Revisão trimestral (ou a cada grande mudança de arquitetura) para atualizar ferramentas e escopo por agente.
- Qualquer novo MCP deve ser registrado aqui e nos `.md` dos agentes, com justificativa.

## Agentes e MCPs
- `SOLO Coder`: `mcp_exa_get_code_context_exa`, `mcp_firecrawl_search`, `mcp_time_*`.
- `UI/UX Planner`: `mcp_firecrawl_search`, `mcp_fetch_fetch`, `mcp_time_*`.
- `Interface Designer`: `mcp_firecrawl_search`, `mcp_fetch_fetch`, `mcp_time_*`.
- `QA‑SGFila`: `mcp_firecrawl_search`, `mcp_exa_get_code_context_exa`, `mcp_time_*`.
- `Edge‑AI Engineer`: `mcp_mcp-inference-onnx`, `mcp_mcp-model-optimizer_*`, `mcp_mcp-dataset-tools_*`, `mcp_time_*`.
- `Queue Data Scientist`: `mcp_mcp-dataset-tools_*`, `mcp_exa_get_code_context_exa`, `mcp_time_*`.
- `Build/Release Engineer`: `mcp_fetch_fetch`, `mcp_mcp-profiler_profile_command`, `mcp_mcp-profiler_system_metrics`, `mcp_time_*`.
- `Test Automation Engineer`: `mcp_firecrawl_search`, `mcp_exa_get_code_context_exa`, `mcp_time_*`.
- `Security Reviewer`: `mcp_firecrawl_search`, `mcp_fetch_fetch`, `mcp_time_*`.
- `Performance Engineer`: `mcp_mcp-profiler_system_metrics`, `mcp_mcp-profiler_profile_command`, `mcp_exa_get_code_context_exa`, `mcp_time_*`.

## Substituições Gratuitas
- Substituir `mcp_exa_get_code_context_exa` por: `WebSearch` (busca geral) e ferramentas locais (`SearchCodebase`, `Grep`, `Read`).
- Substituir `mcp_firecrawl_search`/`scrape` por: `mcp_fetch_fetch` (fetch direto de páginas) e `WebSearch`.
- Priorizar ferramentas locais para análise de código e desempenho; usar web apenas como apoio de leitura.