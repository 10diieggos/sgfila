# Algoritmo JSED: Joint Shortest Expected Delay

## Sumário Executivo

O **JSED (Joint Shortest Expected Delay)** é o algoritmo central de sequenciamento inteligente do SGFila v3.0. Ele combina múltiplos fatores para determinar a ordem ótima de chamada de senhas, equilibrando:

- **Tempo de espera** (fairness)
- **Tempo estimado de atendimento** (eficiência)
- **Prioridade por tipo** (políticas contratuais)
- **Aging** (prevenção de starvation)
- **Fast-service boost** (recompensa para atendimentos rápidos)

## Fundamentos Teóricos

### Definição Matemática

Para cada senha `s` na fila de espera, o JSED calcula um score (quanto menor, melhor):

```
SED(s) = (T_espera + T_serviço) / W_efetivo
```

Onde:
- **T_espera**: Tempo já aguardado pela senha (ms)
- **T_serviço**: Estimativa de tempo de atendimento (ms)
- **W_efetivo**: Peso efetivo da senha (combinação de múltiplos fatores)

### Peso Efetivo

O peso efetivo combina três componentes:

```
W_efetivo = W_base × W_aging × W_fast
```

#### 1. Peso Base (W_base)

Define a prioridade por tipo de senha conforme políticas contratuais:

| Tipo | Peso Padrão | Justificativa |
|------|-------------|---------------|
| Prioridade | 1.3 | Preferencial (idosos, gestantes, PCD) |
| Contratual | 1.1 | Compromissos de SLA |
| Normal | 1.0 | Base de referência |

**Configuração:** `estado.configuracoes.roteamento.jsedWeights`

**Efeito:** Maior peso → menor SED → maior probabilidade de ser chamada primeiro.

#### 2. Aging (W_aging)

Aumenta progressivamente o peso de senhas que esperam muito tempo, evitando starvation:

```
W_aging = 1 + α × min(T_espera_min / janela_aging, slowdown_max)
```

Parâmetros padrão:
- **α (alphaAging)**: 0.1 (taxa de crescimento)
- **janela_aging**: 30 minutos (normalização)
- **slowdown_max**: 0.5 (limite de boost)

**Exemplo:**
- Senha esperando 15 min: `W_aging = 1 + 0.1 × (15/30) = 1.05`
- Senha esperando 30 min: `W_aging = 1 + 0.1 × (30/30) = 1.10`
- Senha esperando 60 min: `W_aging = 1 + 0.1 × min(60/30, 0.5) = 1.05` (clampado)

**Configuração:** `estado.configuracoes.roteamento.wfq`

#### 3. Fast-Service Boost (W_fast)

Recompensa senhas com atendimento rápido estimado para aumentar throughput:

```
W_fast = {
  boost    se T_serviço ≤ msLimit
  1.0      caso contrário
}
```

Parâmetros padrão:
- **msLimit**: 180.000 ms (3 minutos)
- **boost**: 1.1 (10% de aumento no peso)

**Exemplo:**
- Senha estimada em 2 min: `W_fast = 1.1` → SED reduzido em ~9%
- Senha estimada em 5 min: `W_fast = 1.0` → sem boost

**Configuração:** `estado.configuracoes.roteamento.fast`

## Fluxo de Decisão Completo

### Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Correções v3.2: Tempo Limite                             │
│    - Filtrar senhas com tempoLimiteAtingido                 │
│    - Se houver, considerar APENAS esse subconjunto          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. WRR (Weighted Round Robin) Leve                          │
│    - Se desbalanceamento > threshold → ativar WRR           │
│    - Escolher tipo sub-representado e retornar              │
└────────────────┬────────────────────────────────────────────┘
                 │ (se WRR não ativo)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. JSED + Fairness + Fast                                   │
│    - Calcular SED para cada senha elegível                  │
│    - Ordenar por SED (menor = melhor)                       │
│    - Extrair top-3 JSED                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ML Hint (se disponível)                                  │
│    - Validar: está no top-3 JSED?                           │
│    - Validar: score ≥ minScore? (0.65)                      │
│    - Validar: latency ≤ maxLatencyMs? (200ms)               │
│    - Se TODAS validações passarem → usar ML Hint            │
│    - Senão → usar senha com menor SED                       │
└─────────────────────────────────────────────────────────────┘
```

### Implementação

**Arquivo:** `v3/server/src/services/IAManager.ts`

#### Passo 1: Tempo Limite (linhas 30-36)

```typescript
let elegiveis = this.reordenarFilaPorTempoLimite(senhasEspera);
const apenasTempoLimite = elegiveis.filter(s => s.tempoLimiteAtingido);
if (apenasTempoLimite.length > 0) {
  elegiveis = apenasTempoLimite;
}
if (elegiveis.length === 0) return null;
```

**Lógica:** Senhas com tempo limite atingido têm prioridade absoluta sobre qualquer algoritmo.

#### Passo 2: WRR (linhas 38-46)

```typescript
if (this.wrrShouldRun(estado, configRoteamento)) {
  const senhaWRR = this.escolherPorWRR(elegiveis, estado, configRoteamento.wrr.weights);
  if (senhaWRR) {
    estado.wrrAtivo = true;
    this.registrarDecisao('wrr', senhaWRR.numero, 1.0, 'WRR ativado por desbalanceamento');
    return senhaWRR;
  }
}
```

**Trigger:** `|proporção_real - proporção_esperada| > enableThreshold` (0.2)

#### Passo 3: Cálculo JSED (linhas 48-69)

```typescript
for (const s of elegiveis) {
  const tEsperaMs = this.tempoEsperaAtualMs(s, agora);
  const tServicoMs = this.estimativaServicoMs(s, estado);
  const wBase = this.pesoPorTipo(s.tipo, configRoteamento.jsedWeights);
  const wAging = 1 + configRoteamento.wfq.alphaAging * Math.min(
    tEsperaMs / 60000 / configRoteamento.wfq.agingWindowMin,
    configRoteamento.wfq.slowdownMax
  );
  const wFast = (tServicoMs <= configRoteamento.fast.msLimit) ? configRoteamento.fast.boost : 1;
  const wEff = wBase * wAging * wFast;
  const sed = (tEsperaMs + tServicoMs) / wEff;
  jsedScores.push({ senha: s, score: sed });
}
```

**Output:** Array ordenado de senhas por SED crescente.

#### Passo 4: ML Hint Gate (linhas 75-96)

```typescript
const thresholds = configRoteamento.mlHintThresholds;
if (mlHint && mlHint.numeroPrevisto && top3JSED.includes(mlHint.numeroPrevisto)) {
  const scoreValido = !thresholds.enabled || (mlHint.score >= thresholds.minScore);
  const latenciaValida = !thresholds.enabled || !mlHint.latencyMs || (mlHint.latencyMs <= thresholds.maxLatencyMs);

  if (scoreValido && latenciaValida) {
    const mlSenha = elegiveis.find(s => s.numero === mlHint.numeroPrevisto);
    if (mlSenha) {
      senhaFinal = mlSenha;
      decisaoSource = 'mlHint-desempate';
      return senhaFinal;
    }
  }
}
```

**Garantias:**
1. ML Hint só é aceito se estiver no top-3 JSED (máximo 3 posições de desvio)
2. Score mínimo configurável (padrão: 0.65)
3. Latência máxima configurável (padrão: 200ms)

## Exemplos Práticos

### Exemplo 1: Comparação Simples

**Cenário:**
- Senha A (Normal): esperando 10 min, estimativa 5 min
- Senha B (Prioridade): esperando 5 min, estimativa 5 min

**Cálculo:**

```
Senha A:
  T_espera = 600.000 ms
  T_serviço = 300.000 ms
  W_base = 1.0 (normal)
  W_aging = 1 + 0.1 × (10/30) = 1.033
  W_fast = 1.0 (5 min > 3 min)
  W_efetivo = 1.0 × 1.033 × 1.0 = 1.033
  SED = (600.000 + 300.000) / 1.033 = 871.151 ms

Senha B:
  T_espera = 300.000 ms
  T_serviço = 300.000 ms
  W_base = 1.3 (prioridade)
  W_aging = 1 + 0.1 × (5/30) = 1.017
  W_fast = 1.0
  W_efetivo = 1.3 × 1.017 × 1.0 = 1.322
  SED = (300.000 + 300.000) / 1.322 = 453.406 ms
```

**Resultado:** Senha B (Prioridade) vence com SED 48% menor.

### Exemplo 2: Aging em Ação

**Cenário:**
- Senha A (Normal): esperando 40 min, estimativa 5 min
- Senha B (Prioridade): esperando 2 min, estimativa 5 min

**Cálculo:**

```
Senha A:
  T_espera = 2.400.000 ms
  W_aging = 1 + 0.1 × min(40/30, 0.5) = 1.05 (clampado)
  W_efetivo = 1.0 × 1.05 × 1.0 = 1.05
  SED = (2.400.000 + 300.000) / 1.05 = 2.571.428 ms

Senha B:
  T_espera = 120.000 ms
  W_aging = 1 + 0.1 × (2/30) = 1.007
  W_efetivo = 1.3 × 1.007 × 1.0 = 1.309
  SED = (120.000 + 300.000) / 1.309 = 320.855 ms
```

**Resultado:** Mesmo com 40 min de espera, Senha A perde para Prioridade recente. Aging ajuda, mas não supera completamente a diferença de peso base.

### Exemplo 3: Fast-Service Boost

**Cenário:**
- Senha A (Normal): esperando 10 min, estimativa 2 min (rápido)
- Senha B (Normal): esperando 10 min, estimativa 6 min

**Cálculo:**

```
Senha A:
  T_espera = 600.000 ms
  T_serviço = 120.000 ms
  W_fast = 1.1 (2 min ≤ 3 min)
  W_efetivo = 1.0 × 1.033 × 1.1 = 1.136
  SED = (600.000 + 120.000) / 1.136 = 633.803 ms

Senha B:
  T_espera = 600.000 ms
  T_serviço = 360.000 ms
  W_fast = 1.0 (6 min > 3 min)
  W_efetivo = 1.0 × 1.033 × 1.0 = 1.033
  SED = (600.000 + 360.000) / 1.033 = 929.331 ms
```

**Resultado:** Senha A vence por atendimento rápido (SED 32% menor), mesmo com tempo de espera igual.

## Vantagens do JSED

### 1. Fairness Adaptativo

- **Problema:** Algoritmos de prioridade fixa podem causar starvation de senhas normais.
- **Solução:** Aging aumenta progressivamente o peso de senhas antigas, garantindo que eventualmente sejam chamadas.

### 2. Eficiência Operacional

- **Problema:** Chamar sempre a senha mais antiga pode reduzir throughput.
- **Solução:** Fast-service boost prioriza atendimentos rápidos quando adequado, aumentando total de atendimentos/hora.

### 3. Conformidade Contratual

- **Problema:** SLAs exigem prioridade de tipos específicos.
- **Solução:** Pesos base configuráveis respeitam políticas contratuais enquanto mantêm fairness.

### 4. Previsibilidade

- **Problema:** Usuários querem estimar tempo de espera.
- **Solução:** Fórmula determinística permite cálculo de posição esperada e previsão de chamada.

### 5. Auditabilidade

- **Problema:** Decisões de IA opacas geram desconfiança.
- **Solução:** Cada decisão é registrada com score, componentes e raciocínio (`estado.iaTelemetria`).

## Limitações e Trabalho Futuro

### Limitações Atuais

1. **Estimativa de Serviço Fixa:**
   - Atualmente usa valor fixo por tipo (`estimativaServicoMs`)
   - **Melhoria:** Implementar estimadores adaptativos usando médias históricas (T-104, T-105)

2. **Parâmetros Estáticos:**
   - Pesos e thresholds são configurados manualmente
   - **Melhoria:** Auto-tuning via aprendizado por reforço

3. **Contexto Limitado:**
   - Não considera hora do dia, dia da semana, sazonalidade
   - **Melhoria:** Incorporar λ(h) e μ(h) em cálculo de SED (T-108)

### Roadmap

| Item | Descrição | ID |
|------|-----------|-----|
| Estimadores λ/μ | Chegadas e atendimentos por hora | T-104, T-105 |
| Percentis P95 | Tempo de espera por tipo/hora | T-106 |
| Limites Dinâmicos | Tempo limite adaptativo por carga | T-108, T-109 |
| Previsão de Espera | IC 80/95% para tempo até chamada | T-121 |

## Configuração e Tuning

### Parâmetros Principais

**Localização:** `estado.configuracoes.roteamento`

```typescript
interface ConfiguracaoRoteamento {
  jsedWeights: {
    prioridade: number;  // Padrão: 1.3
    contratual: number;  // Padrão: 1.1
    normal: number;      // Padrão: 1.0
  };
  wfq: {
    alphaAging: number;       // Padrão: 0.1
    agingWindowMin: number;   // Padrão: 30
    slowdownMax: number;      // Padrão: 0.5
    clampMax: number;         // Padrão: 2.0
  };
  fast: {
    msLimit: number;          // Padrão: 180000 (3 min)
    boost: number;            // Padrão: 1.1
    windowSize: number;       // Padrão: 20
    minCount: number;         // Padrão: 10
    minFraction: number;      // Padrão: 0.5
    maxConsecutiveBoost: number;  // Padrão: 3
    cooldownCalls: number;    // Padrão: 10
  };
  wrr: {
    weights: { prioridade: number; contratual: number; normal: number; };
    enableThreshold: number;  // Padrão: 0.2
    windowCalls: number;      // Padrão: 20
    checkRounds: number;      // Padrão: 2
    cooldownCalls: number;    // Padrão: 10
  };
  mlHintThresholds: {
    minScore: number;         // Padrão: 0.65
    maxLatencyMs: number;     // Padrão: 200
    enabled: boolean;         // Padrão: true
  };
}
```

### Diretrizes de Tuning

#### Aumentar Prioridade de Tipo Específico

```typescript
// Aumentar peso base de "Prioridade"
roteamento.jsedWeights.prioridade = 1.5  // +15% sobre padrão
```

**Efeito:** Senhas de prioridade serão chamadas ~15% mais cedo em média.

#### Reduzir Starvation

```typescript
// Aumentar aging
roteamento.wfq.alphaAging = 0.15  // de 0.1 para 0.15
```

**Efeito:** Senhas antigas ganham peso mais rapidamente.

#### Aumentar Throughput

```typescript
// Aumentar boost de fast-service
roteamento.fast.boost = 1.2  // de 1.1 para 1.2
roteamento.fast.msLimit = 240000  // de 3 para 4 minutos
```

**Efeito:** Atendimentos rápidos (<4min) recebem 20% de boost.

#### Relaxar ML Hint

```typescript
// Reduzir threshold de score
roteamento.mlHintThresholds.minScore = 0.55  // de 0.65 para 0.55
```

**Efeito:** ML Hints com confiança 55-65% passam a ser aceitos.

## Telemetria e Monitoramento

### Dados Capturados

**Última Decisão:** `estado.ultimaDecisaoIA`

```typescript
interface DecisaoIAInfo {
  numero: string;           // Senha escolhida
  source: string;           // 'jsed_fair_wrr' | 'mlHint-desempate' | 'wrr'
  confianca?: number;       // Score ou 1/SED
  timestamp: number;        // Horário da decisão
  top3?: string[];          // Top-3 JSED
  wrrAtivo?: boolean;       // WRR estava ativo?
}
```

**Histórico:** `estado.iaTelemetria` (array de `DecisaoIAInfo`)

### Dashboard

**Localização:** `ConfigurationPanel.vue` → Aba "IA"

**Visualizações:**
1. **Status Atual:**
   - Modelo ONNX (Ativo/Standby)
   - Algoritmo configurado
   - Última decisão (número, fonte, confiança)

2. **Telemetria:**
   - Tabela com últimas 20 decisões
   - Filtros por fonte, intervalo de tempo
   - Export CSV (planejado)

3. **Configuração:**
   - Thresholds editáveis de ML Hint
   - Pesos JSED (futuro)

## Referências

### Implementação

- **IAManager.ts:** [`v3/server/src/services/IAManager.ts`](../../../server/src/services/IAManager.ts)
- **QueueService.ts:** [`v3/server/src/services/QueueService.ts:159-169`](../../../server/src/services/QueueService.ts#L159-L169)
- **Tipos:** [`v3/shared/types.ts:181-188`](../../../shared/types.ts#L181-L188)

### Documentação

- **Plano de Continuidade:** [`proximos_passos.md`](proximos_passos.md)
- **Correção por Tempo Limite:** [`melhoria_logica_correcao_tempo_limite.md`](melhoria_logica_correcao_tempo_limite.md)

### Bibliografia

- **Teoria de Filas:** M/M/c, M/G/1, Littles Law
- **Weighted Fair Queueing:** RFC 2598 (DiffServ)
- **Aging em Sistemas Operacionais:** Tanenbaum, Modern Operating Systems
- **Round Robin Ponderado:** Katevenis et al., WRR Scheduling (1991)

---

**Versão:** 1.0
**Data:** 2025-11-22
**Autor:** Data Scientist - SGFila Team
**Status:** Documentação Técnica Oficial
