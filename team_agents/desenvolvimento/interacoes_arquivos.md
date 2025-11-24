# Interações com Arquivos — Equipe SGFILA

## Objetivo
- Mapear quem lê/atualiza cada artefato de persistência e como essas interações ocorrem a cada turno.

## Artefatos
- `proximos_passos.md`: backlog e progresso.
- `testes.md`: plano e resultados de testes.
- `requisitos.md`: requisitos e restrições operacionais.
- `fluxo_turno.md`: processo orquestrado por turno.

## Matriz de Interação
- `SOLO Coder`: Atualiza `proximos_passos.md` e anotações em `testes.md`.
- `UI/UX Planner`: Atualiza `proximos_passos.md` e `testes.md` (UI/UX).
- `Interface Designer`: Atualiza `proximos_passos.md` e `testes.md` (visual/acessibilidade).
- `QA‑SGFila`: Atualiza `testes.md` (resultados). Lê `proximos_passos.md`.
- `Edge‑AI Engineer`: Atualiza `proximos_passos.md` e `testes.md` (IA). Lê `requisitos.md`.
- `Queue Data Scientist`: Atualiza `proximos_passos.md` e `testes.md` (modelagem). Lê `requisitos.md`.
- `Build/Release Engineer`: Atualiza `proximos_passos.md` e `testes.md` (entrega). Lê `requisitos.md`.
- `Test Automation Engineer`: Atualiza `testes.md` (automação). Lê `proximos_passos.md`.
- `Security Reviewer`: Atualiza `requisitos.md` e `proximos_passos.md`. Lê `testes.md`.
- `Performance Engineer`: Atualiza `proximos_passos.md` e `testes.md` (KPIs). Lê `requisitos.md`.

## Regras
- Atualizações devem ser pequenas e frequentes, por turno.
- Prioridade e status são mantidos em `proximos_passos.md` pelo `SOLO Coder`.
- Resultados de testes têm estado e evidências em `testes.md` pelo `QA‑SGFila`/`Test Automation Engineer`.
- Novos requisitos ou recomendações entram em `requisitos.md` (por qualquer agente ou Supervisor Crítico).