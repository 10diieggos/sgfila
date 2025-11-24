# Estimadores Inteligentes - SGFila

## 📊 **O que são Estimadores Inteligentes?**

São sistemas matemáticos que **aprendem com dados históricos** para prever comportamentos futuros da fila. No SGFila, temos três estimadores principais que transformam o sistema de reativo para proativo.

---

## 1. **Estimador Lambda (λ) - Taxa de Chegadas** 📈

### **O que faz:**
- Mede **quantas pessoas chegam por hora** em cada tipo de fila
- Aprende padrões de movimento ao longo do dia

### **Como funciona:**
```typescript
// Exemplo de cálculo
λ(hora) = número_de_chegadas_na_hora / 1_hora
```

### **Características técnicas:**
- **Janelas móveis** de 15min (curto prazo) e 1h (longo prazo)
- **EWMA (Exponentially Weighted Moving Average)** - dá mais peso a dados recentes
- **Winsorização** - remove outliers extremos (valores muito fora do normal)
- **Separação por tipo** - prioridade, contratual, normal

### **Exemplo prático:**
- Se às 10h chegam 20 pessoas na fila normal e 5 na prioridade:
  - λ_normal(10h) = 20 chegadas/hora
  - λ_prioridade(10h) = 5 chegadas/hora

---

## 2. **Estimador Mu (μ) - Taxa de Atendimento** ⚡

### **O que faz:**
- Mede **quantas pessoas são atendidas por hora**
- Calcula tempo médio de atendimento por tipo

### **Como funciona:**
```typescript
μ(hora) = número_de_atendimentos_na_hora / tempo_total_de_atendimento
```

### **Características especiais:**
- **Ajusta para interrupções** - não conta ausências/não comparecimentos
- **Separa por guichê** - aprende velocidade de cada atendente
- **Calcula ρ (fator de utilização)** - ρ = λ/μ (quão ocupado está o sistema)

### **Exemplo prático:**
- Se em 1 hora foram atendidas 12 pessoas com tempo total de 45min:
  - μ = 12 atendimentos / 0.75 horas = 16 atendimentos/hora
  - Tempo médio = 45min / 12 = 3.75min por atendimento

---

## 3. **Estimador de Percentis - Tempos de Espera** ⏱️

### **O que faz:**
- Calcula **P50, P95, P99** - tempos típicos de espera
- P50 = metade das pessoas espera menos que isso
- P95 = 95% das pessoas espera menos que isso
- P99 = 99% das pessoas espera menos que isso

### **Algoritmos usados:**
- **P² (P-square)** - para fluxo contínuo (novos dados chegando)
- **Harrell-Davis** - para lotes grandes (mais preciso)
- **Bootstrap** - calcula intervalo de confiança

### **Exemplo prático:**
- P50 = 15min → metade das pessoas espera até 15min
- P95 = 45min → 95% das pessoas espera até 45min  
- P99 = 60min → 99% das pessoas espera até 60min

---

## 🎯 **Por que são "Inteligentes"?**

### **Aprendem com o tempo:**
- Não usam valores fixos pré-definidos
- Adaptam-se ao comportamento real do seu estabelecimento
- Reconhecem padrões sazonais (hora do rush, dias específicos)

### **Robustos a anomalias:**
- Ignoram valores extremos (ex: alguém que esperou 4h por engano)
- Mantêm estabilidade mesmo com dados incompletos

### **Fornecem confiabilidade:**
- Indicam quando têm dados suficientes para serem confiáveis
- **Alta confiabilidade:** ≥30 amostras
- **Média confiabilidade:** ≥10 amostras  
- **Baixa confiabilidade:** <10 amostras

---

## 🔧 **Como são usados no SGFila?**

### **1. Limites Dinâmicos de Tempo** 🕒
```typescript
// Em vez de limite fixo de 20min para todos
limite_dinâmico(tipo, hora) = base_tipo × fator_carga + P95_tipo(hora)
```

**Exemplo:**
- Fila normal às 14h (hora cheia):
  - Base = 20min, P95 = 35min, fator_carga = 1.2
  - Limite = 20 × 1.2 + 35 = 59min

- Fila normal às 10h (hora vazia):
  - Base = 20min, P95 = 15min, fator_carga = 0.8  
  - Limite = 20 × 0.8 + 15 = 31min

### **2. Previsão de Tempo de Espera** 🔮
```typescript
tempo_espera_previsto = fórmula_M_M_c(λ, μ, número_na_frente)
```

### **3. Otimização do JSED** 🧠
- Usa tempo médio real de atendimento em vez de valor fixo
- Adapta pesos do algoritmo baseado na carga atual

---

## 📈 **Benefícios Práticos**

### **Para o Dono:**
- **Limites realistas** - não muito curtos (muitas correções) nem muito longos (clientes insatisfeitos)
- **Previsões precisas** - pode informar clientes com confiança
- **Otimização automática** - sistema se adapta sozinho

### **Para os Clientes:**
- **Experiência mais previsível** - sabem quanto esperarão
- **Tratamento mais justo** - limites adaptados à realidade

### **Para os Atendentes:**
- **Menos correções** - limites adequados reduzem necessidade de reposicionar senhas
- **Melhor fluxo** - sistema otimiza automaticamente a ordem de chamada

---

## 🚀 **Estado de Implementação**

### ✅ **Já Implementado:**
- **Estrutura de dados** para estatísticas por hora
- **Estimador Lambda** - funcionando com EWMA e winsorização
- **Estimador Mu** - calculando taxa de atendimento real
- **Integração com StateManager** - dados sendo coletados

### 🚧 **Em Desenvolvimento:**
- **Estimador de Percentis** - algoritmos P² e Harrell-Davis
- **Limites Dinâmicos** - fórmula adaptativa
- **Dashboard de Estatísticas** - visualização em tempo real

### 📋 **Próximos Passos:**
- Persistência automática em arquivos JSON
- Exposição via Socket.IO para o cliente
- Integração completa com sistema de correções

---

## 💡 **Exemplo de Cenário Real**

**Situação:** Padaria às segundas-feiras 8h-9h

**Sem estimadores:**
- Limite fixo: 20min para todos
- Muitas senhas atingindo tempo limite
- Atendentes constantemente reposicionando

**Com estimadores:**
- Sistema aprende que às segundas 8h:
  - λ = 25 chegadas/hora (muito alto)
  - μ = 12 atendimentos/hora (normal)
  - P95 = 48min (espera longa)
- Limite automático = 55min
- Menos correções necessárias
- Clientes informados realisticamente

---

## 🎯 **Resumo**

Os **estimadores inteligentes** transformam o SGFila de um sistema **reativo** (responde ao que acontece) para um sistema **proativo** (antecipa o que vai acontecer).

Eles são o **cérebro matemático** que permite:
- **Aprendizado contínuo** com dados reais
- **Adaptação automática** às condições específicas
- **Otimização inteligente** do fluxo de atendimento
- **Transparência completa** através de métricas precisas

É a diferença entre ter **regras fixas** e ter **inteligência adaptativa**! 🧠✨

---

*Documento técnico - SGFila v3*  
*Baseado na análise dos documentos de desenvolvimento*  
*Última atualização: 2025-11-23*