## Gestor:
Eu tenho uma dúvida o JSED + Fairness + WRR (IA Operacional) não seria inconpativel com o reordenamento de fila por tempo excedido fixo (10min contratual, 20min prioridade, 25min normal)? Não temos métricas e fórmulas para que esses valores fixos de limite de tempo possam se tornar variáveis de acordo com estatisticas e controlados pela IA?

## Data Scientist - Engenheiro de modelagem de processos de fila de atendimento:          
**Resposta Direta**
- Não há incompatibilidade conceitual entre `JSED + Fairness + WRR` e o reposicionamento por tempo excedido; ambos podem coexistir desde que o “tempo limite” seja tratado como restrição dura antes da decisão da IA.
- Sim, é desejável substituir limites fixos (10/20/25min) por limites dinâmicos, calculados a partir de métricas e estimadores (λ/μ, percentis, sazonalidade por hora). Isso melhora justiça e previsibilidade.
- O relatório do consultor está quase exato. Pontos a ajustar: o “tempo limite” precisa ser absoluto em todos os algoritmos, e os thresholds de `ML Hint` (score ≥ 0.65 e latência ≤ 200ms) não estavam implementados como regra de aceitação.

**Como está hoje (código)**
- Reposicionamento por tempo excedido:
  - Marca e reposiciona senhas com `tempoLimiteAtingido` em `QueueService.verificarTemposLimite` em `v3/server/src/services/QueueService.ts:580–643`.
  - Reordena fila colocando “tempo limite” primeiro em `v3/server/src/services/QueueService.ts:649–662`.
- Algoritmos padrão respeitam “tempo limite” como prioridade:
  - `Proporção` checa `tempoLimiteAtingido` primeiro em `v3/server/src/services/QueueService.ts:193–232`.
  - `Round Robin` idem em `v3/server/src/services/QueueService.ts:238–279`.
- IA Operacional (JSED + Fairness + WRR):
  - JSED com `peso_efetivo = peso_base × aging × fast` e escolha pelo menor SED em `v3/server/src/services/IAManager.ts:44–85`.
  - WRR leve, ativado quando desbalanceamento real vs esperado > threshold em `v3/server/src/services/IAManager.ts:104–133` e escolha em `v3/server/src/services/IAManager.ts:141–178`.
  - `ML Hint` aceito se estiver no top‑3 JSED, sem checar score mínimo nem latência em `v3/server/src/services/IAManager.ts:71–85`.

**Ação Executada**
- Garanti prioridade absoluta de “tempo limite” dentro da IA:
  - Ao decidir, se existir qualquer senha com `tempoLimiteAtingido`, a IA passa a considerar somente esse subconjunto antes de aplicar JSED/WRR em `v3/server/src/services/IAManager.ts:31–38`.
  - A pré‑visualização JSED agora mantém “tempo limite” no topo: primeiro ordena por JSED dentro do subconjunto com tempo limite e, depois, o restante em `v3/server/src/services/IAManager.ts:235–258`.
- Validação:
  - Lint do servidor executado com sucesso (`npm run lint`), sem erros.

**Avaliação do Relatório do Consultor**
- Correto:
  - Tipos de senha e tracking.
  - Correções v3.2 para “Tempo Limite” e “Ausências” (com pausa de contagem).
  - Algoritmos “Proporção”, “Round Robin” e “FIFO”, com prioridade de “tempo limite”.
  - Estrutura geral do JSED e fairness/WRR com threshold de desbalanceamento.
- Ajustes necessários:
  - “Tempo limite” como prioridade absoluta também na IA: agora implementado.
  - `ML Hint`: reporta “Score ≥ 0.65” e “Latência ≤ 200ms”, mas não havia gate. Hoje aceita apenas se estiver no top‑3 JSED; sugiro adicionar:
    - Gating por `score ≥ θ_score` e `RTT ≤ θ_latency`.
    - Habilitar thresholds em `config.roteamento` para controle.

**Limites Dinâmicos (proposta)**
- Objetivo: substituir limites fixos por limites adaptativos por tipo e hora, mantendo justiça e metas de serviço.
- Estimadores:
  - `λ(h)`: chegadas por hora via janelas móveis (15min/1h) com EWMA e winsorização p1/p99.
  - `μ(h)`: taxa de serviço por hora a partir de tempos de atendimento.
  - Percentis de espera (P50/P95/P99) por tipo usando Harrell–Davis (lote) e P² (stream).
- Fórmulas de limite por tipo/hora:
  - `limite_t(h) = clamp( base_t × f_load(h) + P95_t(h), min_t, max_t )`
    - `f_load(h) = min(1.5, EWMA(λ/μ))` como multiplicador de pressão.
    - `P95_t(h)` em minutos, por tipo.
    - `base_t`: piso por contrato/regra (ex.: prioridade ≥ 15min).
    - `clamp`: limita crescimento e evita outliers.
- Regras operacionais:
  - Quando `n_amostras(h, t) < 30`, sinalizar baixa confiabilidade e usar fallback determinístico (ex.: medianas do dia anterior).
  - Pausar contagem durante ausências permanece.
  - Persistência local de estatísticas em JSON (já suportada por `StatisticsPersistence`).
- Aceitação de `ML Hint` (variável):
  - Aceitar se `top-3 JSED` e `score ≥ θ_score` e `RTT ≤ θ_latency`.
  - Thresholds ajustáveis por ambiente/operador.

**Benefícios**
- Maior justiça: limites acompanham carga real por hora e tipo.
- Menor risco de “starvation”: aging e percentis garantem boosts quando necessário.
- Previsibilidade: metas de percentis se tornam contratáveis e auditáveis.

**Próximos Passos Sugeridos**
- Adicionar modo dinâmico aos limites:
  - Incluir `tempoLimite.modo = 'fixo' | 'dinamico'` e parâmetros (`min`, `max`, `θ_score`, `θ_latency`) em `shared/types.ts`.
  - Calcular `limite_t(h)` na verificação de tempo limite (`QueueService.verificarTemposLimite`) usando estimadores recentes.
- Implementar estimadores e percentis:
  - `λ(h)/μ(h)` por hora com EWMA e winsorização.
  - P95/P99 de espera por tipo com P²/Harrell–Davis.
- Gate para `ML Hint`:
  - Aplicar thresholds de score e latência antes de aceitar.
- Telemetria:
  - Expor métricas de qualidade do estimador (`bias`, `var`, `RMSE`, cobertura de IC) e `nAmostras` por janela.

Se quiser, prossigo implementando o modo dinâmico dos limites e o gate de `ML Hint` com os parâmetros em configuração e a integração na verificação de tempo limite.