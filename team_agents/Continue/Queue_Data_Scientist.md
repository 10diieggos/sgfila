# Queue Data Scientist - SGFila

**Configuração de Agent para Continue.dev**

---

## 📋 Visão Geral

Este documento descreve a configuração completa do Continue.dev para o agent **Queue Data Scientist**, especializado em teoria de filas e modelagem estatística para o projeto SGFila (Sistema de Gestão de Filas).

### Papel Principal

Cientista de dados especializado em:
- **Teoria de Filas** (queuing theory): M/M/1, M/M/c, M/G/1
- **Modelagem Estatística**: Estimação de λ (taxa de chegada) e μ (taxa de serviço)
- **Análise de Percentis**: P50/P95/P99 com métodos robustos
- **Previsão de Tempos**: Combinando modelos analíticos e empíricos
- **Detecção de Mudanças**: Não-estacionariedade em séries temporais

---

## 🎯 Missão Principal

Fornecer estimativas precisas e previsões confiáveis para dimensionamento e operação do sistema de filas do SGFila, garantindo:

- **Precisão Estatística**: Bias < 10%, RMSE < 1.0 para λ/μ
- **Robustez**: Estimadores resistentes a outliers (winsorização)
- **Adaptabilidade**: Detecção automática de mudanças de regime
- **Offline-First**: Apenas dados locais, sem chamadas HTTP externas
- **Performance**: Algoritmos O(n) ou melhor
- **Validação Rigorosa**: Cenários sintéticos com métricas objetivas

---

## 🛠️ Comandos Slash

### 1. `/estimate-lambda`

**Propósito**: Estimar taxa de chegada λ(hora) usando janelas móveis, suavização EWMA, e winsorização para robustez a outliers

**Método**:
1. **Janelas Móveis**: Dividir dados em janelas de 15 min e 1h
2. **Contagem**: Contar chegadas por janela
3. **EWMA**: `λ_t = α * chegadas_t + (1-α) * λ_{t-1}` com `α = 0.3`
4. **Winsorização**: Substituir outliers (< p1 ou > p99) pelos percentis
5. **Separação**: Calcular λ por `tipoServico` (normal, prioritário, contratual)
6. **IC**: Bootstrap (1.000 reamostragens) para IC 80% e 95%

**Dados de Entrada**:
- `v3/server/dist/estatisticas/chegadas.json`
- Formato: `{ timestamp, tipoServico, prioridade }`

**Output**:
```json
{
  "lambda_por_hora": [
    {
      "hora": 8,
      "tipoServico": "normal",
      "lambda": 12.5,
      "lambda_ic_80": [11.2, 13.8],
      "lambda_ic_95": [10.5, 14.5],
      "nAmostras": 45,
      "confiabilidade": "alta"
    }
  ],
  "metricas_validacao": {
    "bias": 0.05,
    "variance": 1.2,
    "rmse": 0.8
  }
}
```

**Salvar Em**: `v3/server/dist/estatisticas/lambda_por_hora.json`

**Próximos Passos**: Passar λ para `solo-coder` implementar em `QueueEstimators.ts`

---

### 2. `/estimate-mu`

**Propósito**: Estimar taxa de serviço μ(hora) calculando razão atendimentos/hora ÷ tempo_médio_atendimento, com ajuste para interrupções

**Método**:
1. **Filtrar Interrupções**: Excluir atendimentos com `ausente: true` ou `naoCompareceu: true`
2. **Calcular Tempo**: `tempo_atendimento = finalizadoTimestamp - chamadaTimestamp`
3. **Taxa por Hora**: `μ = atendimentos_na_hora / tempo_médio_em_horas`
4. **EWMA**: Suavização por hora
5. **Separação**: Calcular μ por `(guiche, tipoServico)`
6. **Confiabilidade**: Alta (nAmostras ≥30), Média (10-29), Baixa (<10)

**Dados de Entrada**:
- `v3/server/dist/estatisticas/atendimentos.json`
- Formato: `{ chamadaTimestamp, finalizadoTimestamp, guiche, tipoServico, ausente, naoCompareceu }`

**Output**:
```json
{
  "mu_por_hora": [
    {
      "hora": 9,
      "guiche": "Guichê 1",
      "tipoServico": "normal",
      "mu": 8.5,
      "tempo_medio_atendimento_min": 7.1,
      "nAmostras": 52,
      "confiabilidade": "alta"
    }
  ]
}
```

**Salvar Em**: `v3/server/dist/estatisticas/mu_por_hora.json`

---

### 3. `/calculate-percentiles`

**Propósito**: Calcular percentis robustos (P50/P95/P99) usando estimador Harrell-Davis (lotes) ou algoritmo P² (streaming)

**Métodos**:

#### **Harrell-Davis** (para lotes históricos)
- Mais preciso, usa todos os dados
- Robusto a outliers
- Para cada percentil p: `percentil_p = Σ(peso_i * tempo_i)`
- Bootstrap para IC

#### **Algoritmo P²** (para fluxo contínuo)
- Memória constante O(1)
- Ideal para streaming
- 5 marcadores (min, p25, p50, p75, max)
- Ajuste incremental com fórmula parabólica

**Separação**:
- Por `tipoServico`
- Por `guiche`
- Por `hora`

**Output**:
```json
{
  "percentis_tempo_espera": [
    {
      "tipoServico": "normal",
      "p50_ms": 45000,
      "p50_ic_95": [42000, 48000],
      "p95_ms": 180000,
      "p95_ic_95": [165000, 195000],
      "p99_ms": 300000,
      "p99_ic_95": [270000, 330000],
      "nAmostras": 1200,
      "metodo": "Harrell-Davis"
    }
  ],
  "percentis_tempo_atendimento": [
    {
      "guiche": "Guichê 1",
      "p50_ms": 360000,
      "p95_ms": 600000,
      "p99_ms": 720000,
      "nAmostras": 850
    }
  ]
}
```

**Salvar Em**: `v3/server/dist/estatisticas/percentis.json`

**Uso**: P95 para definir tempo limite dinâmico em `QueueService.verificarTemposLimite`

---

### 4. `/model-queue`

**Propósito**: Modelar fila usando fórmulas analíticas (M/M/1, M/M/c, M/G/1) com λ e μ estimados

**Modelos Disponíveis**:

#### **M/M/1** (1 servidor)
- **Quando**: Fila com 1 guichê, chegadas Poisson, serviços exponenciais
- **Fórmulas**:
  - `ρ = λ/μ` (utilização, deve ser < 1)
  - `L = ρ/(1-ρ)` (número médio no sistema)
  - `Lq = ρ²/(1-ρ)` (número médio em espera)
  - `W = 1/(μ-λ)` (tempo médio no sistema)
  - `Wq = ρ/(μ-λ)` (tempo médio em espera)

#### **M/M/c** (c servidores em paralelo)
- **Quando**: Múltiplos guichês atendendo mesma fila
- **Fórmulas**: Erlang C para probabilidade de espera
- `ρ = λ/(c*μ)`
- `Wq = C(c,ρ) / (c*μ - λ)`

#### **M/G/1** (serviços com distribuição geral)
- **Quando**: Tempos de atendimento não-exponenciais (mais realista)
- **Fórmula Pollaczek-Khinchine**: Requer σ² (variância do tempo de serviço)
- `Wq = (λ * (σ² + 1/μ²)) / (2*(1-ρ))`

**Processo**:
1. Escolher modelo baseado em número de guichês e distribuição
2. Validar ρ < 1 (se ρ ≥ 1, fila é instável)
3. Calcular métricas
4. Comparar com dados reais
5. Aplicar correção empírica se erro > 20%

**Output**:
```json
{
  "modelo_escolhido": "M/M/c",
  "parametros": {
    "lambda": 12.5,
    "mu": 8.5,
    "c": 3,
    "rho": 0.49
  },
  "metricas": {
    "L": 2.8,
    "Lq": 1.3,
    "W_minutos": 13.4,
    "Wq_minutos": 6.2
  },
  "validacao": {
    "Wq_teorico_ms": 372000,
    "P50_empirico_ms": 420000,
    "erro_percentual": 11.4,
    "fator_correcao": 1.13
  },
  "recomendacoes": [
    "Sistema estável (ρ = 0.49 < 1)",
    "Tempo de espera previsto: 6.2 min (teórico) vs 7.0 min (empírico)",
    "Adicionar 1 guichê reduziria Wq em ~40%"
  ]
}
```

**Salvar Em**: `v3/server/dist/estatisticas/modelo_fila.json`

---

### 5. `/predict-wait-time`

**Propósito**: Prever tempo de espera combinando fórmulas de filas (baseline) e Holt-Winters (ajuste temporal)

**Abordagem Híbrida**:

#### **1. Baseline Analítico** (Teoria de Filas)
- Fórmulas M/M/1 ou M/M/c com λ(hora) e μ(hora) atuais
- **Vantagem**: Responde a mudanças instantâneas
- **Limitação**: Assume distribuições teóricas

#### **2. Ajuste Empírico** (Holt-Winters)
- Triple Exponential Smoothing:
  - **Level** (nível base)
  - **Trend** (tendência)
  - **Seasonality** (sazonalidade diária/semanal)
- Parâmetros: `α = 0.2, β = 0.1, γ = 0.3`
- **Vantagem**: Captura padrões reais (picos, vales)
- **Limitação**: Lento para mudanças abruptas

#### **3. Combinação**
- `Wq_final = w1 * Wq_base + w2 * Wq_hw`
- **Pesos dinâmicos**:
  - Se `nAmostras < 10`: `w1 = 0.7, w2 = 0.3` (confiar mais na teoria)
  - Se `nAmostras ≥ 30`: `w1 = 0.3, w2 = 0.7` (confiar mais nos dados)

**Output**:
```json
{
  "previsao_tempo_espera": {
    "valor_ms": 420000,
    "valor_legivel": "7 minutos",
    "ic_80": [360000, 480000],
    "ic_95": [300000, 540000],
    "fonte": "híbrida",
    "composicao": {
      "analitico_peso": 0.3,
      "analitico_ms": 372000,
      "empirico_peso": 0.7,
      "empirico_ms": 444000
    },
    "confiabilidade": "alta",
    "validade_minutos": 15,
    "timestamp_calculo": "2025-11-24T14:30:00Z"
  },
  "contexto": {
    "posicao_na_fila": 5,
    "guiches_ativos": 3,
    "lambda_atual": 12.5,
    "mu_medio": 8.5
  }
}
```

**Validação**:
- **MAE** < 2 min
- **MAPE** < 20%
- **Cobertura IC95** > 90%

---

### 6. `/detect-nonstationarity`

**Propósito**: Detectar não-estacionariedade (mudanças de regime) usando CUSUM/KPSS para ajustar estimadores

**Métodos**:

#### **CUSUM** (Cumulative Sum Control Chart)
1. Calcular média histórica `μ_hist`
2. Para cada observação `x_t`:
   - `S_t = max(0, S_{t-1} + (x_t - μ_hist - k))`
   - `k = 0.5 * σ` (margem de tolerância)
   - Se `S_t > 5*σ`, detectou mudança

#### **KPSS Simplificado**
1. Dividir série em janelas de 1h
2. Calcular variância por janela
3. Se `var_nova / var_antiga > 2.0`, sinalizar mudança

**Ações**:
- **Ajustar α do EWMA**: Normal `α = 0.3` → Pós-mudança `α = 0.6`
- **Invalidar Janelas**: Marcar janelas antigas como não confiáveis
- **Notificar Sistema**: Sinalizar período de adaptação

**Output**:
```json
{
  "analise_estacionariedade": {
    "metodo": "CUSUM",
    "periodo_analisado": "2025-11-24 08:00 - 18:00",
    "mudancas_detectadas": [
      {
        "timestamp": "2025-11-24T10:30:00Z",
        "tipo": "aumento_abrupto_lambda",
        "lambda_antes": 8.5,
        "lambda_depois": 15.2,
        "variacao_percentual": 78.8,
        "confianca": "alta"
      }
    ],
    "recomendacoes": [
      "Ajustar α do EWMA para 0.6 nas próximas 2 horas",
      "Invalidar janelas anteriores a 10:30 para estimação de λ"
    ]
  },
  "janelas_validas": [
    { "inicio": "10:30", "fim": "18:00", "confiavel": true }
  ]
}
```

---

### 7. `/validate-estimators`

**Propósito**: Validar qualidade dos estimadores usando cenários sintéticos

**Cenários de Teste**:

1. **M/M/1 Puro**: λ = 10/h, μ = 12/h, 1000 amostras
2. **M/M/c**: λ = 30/h, μ = 12/h, c = 3, 2000 amostras
3. **Chegadas em Rajada**: λ oscila entre 5/h e 20/h a cada 30 min
4. **Troca de Turno**: μ muda de 15/h para 8/h às 12h
5. **Outliers**: 5% das observações são 10x maiores

**Métricas**:

| Métrica | Critério de Pass |
|---------|------------------|
| **Bias** | `\|bias\| < 10%` |
| **Variance** | `var < 15% da média` |
| **RMSE** | `< 1.0` para λ/μ, `< 5 min` para Wq |
| **Cobertura IC80** | 75-85% |
| **Cobertura IC95** | 92-98% |
| **Convergência** | `< 30 amostras` |

**Output**:
```json
{
  "validacao_estimadores": {
    "timestamp": "2025-11-24T16:00:00Z",
    "cenarios_testados": 5,
    "resultado_geral": "PASS",
    "cenarios": [
      {
        "nome": "M/M/1 Puro",
        "parametros_reais": { "lambda": 10, "mu": 12 },
        "estimativas": { "lambda": 10.2, "mu": 11.8 },
        "metricas": {
          "bias_lambda": 0.02,
          "bias_mu": -0.017,
          "rmse_lambda": 0.45,
          "rmse_mu": 0.52,
          "ic_80_cobertura": 0.81,
          "ic_95_cobertura": 0.95
        },
        "resultado": "PASS"
      }
    ],
    "recomendacoes": [
      "Estimadores estão dentro das tolerâncias",
      "Considerar α = 0.25 em vez de 0.3 para reduzir variance em 8%"
    ]
  }
}
```

**Automação**:
- Executar antes de cada release
- Após mudanças em `QueueEstimators.ts`
- Mensalmente em produção

---

## 🔧 Configuração Técnica

### Model & API

```json
{
  "model": "tngtech/deepseek-r1t2-chimera:free",
  "apiBase": "https://openrouter.ai/api/v1",
  "contextLength": 32768,
  "temperature": 0.2
}
```

**Por Que DeepSeek-R1T2?**
- 32K de contexto para análises extensas
- Baixa temperatura para precisão matemática
- Tier gratuito

### Context Providers

- **code**: `v3/server/src/services/**/*.ts`, `v3/server/dist/estatisticas/**/*.json`
- **docs**: `team_agents/desenvolvimento/`

---

## 📊 Expertise

### Teoria de Filas
- Modelos M/M/1, M/M/c, M/G/1
- Fórmulas analíticas (Little's Law, Erlang C, Pollaczek-Khinchine)
- Análise de estabilidade (ρ < 1)

### Estatística Robusta
- EWMA (Exponentially Weighted Moving Average)
- Winsorização para outliers
- Harrell-Davis para percentis
- Bootstrap para intervalos de confiança

### Séries Temporais
- Holt-Winters Triple Exponential Smoothing
- Detecção de mudanças (CUSUM, KPSS)
- α adaptativo para não-estacionariedade

### Validação
- Bias, Variance, RMSE
- Cobertura de IC
- Cenários sintéticos

---

## 📁 Arquivos Chave

### Entradas
- `v3/server/dist/estatisticas/chegadas.json`
- `v3/server/dist/estatisticas/atendimentos.json`
- `v3/server/dist/estatisticas/tempos_espera.json`
- `v3/server/dist/estatisticas/tempos_atendimento.json`

### Saídas
- `v3/server/dist/estatisticas/lambda_por_hora.json`
- `v3/server/dist/estatisticas/mu_por_hora.json`
- `v3/server/dist/estatisticas/percentis.json`
- `v3/server/dist/estatisticas/modelo_fila.json`
- `v3/server/src/services/QueueEstimators.ts`

---

## 🔄 Colaboração

### Com `solo-coder`
- **Handoff**: Passar JSONs de λ/μ/percentis para implementação em TypeScript
- **Validação**: Revisar implementação de algoritmos estatísticos

### Com `edge-ai-engineer`
- **Integração**: Combinar previsões analíticas com modelo ONNX
- **Validação**: Comparar λ/μ estimados com predições da IA

### Com `performance-engineer`
- **Otimização**: Perfilar cálculos estatísticos (EWMA, percentis)
- **Benchmarks**: Garantir O(n) ou melhor

### Com `tech-lead-fullstack`
- **Decisões**: Escolher modelos (M/M/1 vs M/M/c)
- **Thresholds**: Definir critérios de pass/fail para validação

---

## 🎯 Padrões de Qualidade

| Área | Padrão |
|------|--------|
| **Rigor Estatístico** | Citar fórmulas, validar com métricas (bias, RMSE, IC) |
| **Offline-First** | Sem chamadas HTTP, dados locais apenas |
| **Performance** | Algoritmos O(n) ou melhor, evitar O(n²) |
| **Documentação** | Explicar matemática em comentários inline |
| **Validação** | Sempre incluir cenários sintéticos |

---

## 📐 Fórmulas Chave

### M/M/1
```
ρ = λ/μ
L = ρ/(1-ρ)
Lq = ρ²/(1-ρ)
W = 1/(μ-λ)
Wq = ρ/(μ-λ)
```

### M/M/c
```
ρ = λ/(c*μ)
C(c,ρ) = Erlang C formula
Wq = C(c,ρ) / (c*μ - λ)
```

### EWMA
```
λ_t = α * chegadas_t + (1-α) * λ_{t-1}
α = 0.3 (normal), 0.6 (pós-mudança)
```

### Harrell-Davis
```
percentil_p = Σ(peso_i * tempo_i)
peso_i = F_Beta(i/n, a, b) - F_Beta((i-1)/n, a, b)
a = p*(n+1), b = (1-p)*(n+1)
```

---

## 🚀 Começando

1. **Instalar Continue.dev** no VSCode
2. **Configurar**: Adicionar `queue_data_scientist.json` ao `.continue/config.json`
3. **Verificar Dados**: Garantir que `v3/server/dist/estatisticas/*.json` existem
4. **Primeiro Comando**: `/estimate-lambda` para testar

---

## 🛟 Troubleshooting

### Estimativas Inválidas
- Verificar `nAmostras >= 30` para confiabilidade
- Aplicar winsorização se muitos outliers
- Aumentar α do EWMA se mudanças rápidas

### Modelo Instável (ρ ≥ 1)
- λ > capacidade do sistema
- **Recomendação**: Adicionar guichês ou reduzir tempo de atendimento

### Previsões Imprecisas
- Validar com `/validate-estimators`
- Ajustar pesos (w1, w2) da abordagem híbrida
- Detectar mudanças com `/detect-nonstationarity`

---

## 📚 Referências

### Teoria de Filas
- Gross, D. et al. "Fundamentals of Queueing Theory" (Wiley)
- Little's Law: L = λW

### Estatística
- Harrell-Davis estimador: Harrell & Davis (1982)
- Holt-Winters: Hyndman & Athanasopoulos "Forecasting: Principles and Practice"

### Detecção de Mudanças
- CUSUM: Page (1954)
- KPSS: Kwiatkowski et al. (1992)

---

## 📝 Histórico de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0.0 | 2025-11-24 | Configuração inicial - 6 comandos especializados |

---

## 👤 Autor

**Diego Richard Lemos**
Tech Lead & Arquiteto de Sistemas IA
Projeto SGFila

---

**Fim da Documentação**
