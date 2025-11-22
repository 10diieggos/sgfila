# **Relatório de Análise: SGFila v3.0**

## **🎯 Visão Geral**

O **SGFila** é um sistema avançado de gerenciamento de filas desenvolvido para os Correios, operando em ambiente offline/intranet. O projeto evoluiu significativamente da versão 1.0 (simples) para a v3.0 (arquitetura moderna com IA integrada).

---

## **🏗️ Arquitetura do Sistema**

### **Stack Tecnológica**
- **Backend:** Node.js + TypeScript + Express + Socket.IO
- **Frontend:** Vue 3 + TypeScript + Vite
- **IA/ML:** ONNX Runtime Web (inferência no navegador)
- **Comunicação:** WebSocket (tempo real)
- **Persistência:** JSON local (dados.json + estatísticas/)

### **Arquitetura em Camadas**

```
┌─────────────────────────────────────────┐
│         Cliente (Vue 3 + TS)            │
│  - Componentes reativos                 │
│  - Inferência ML (ONNX)                 │
│  - Composables (useSocket, useBeep)     │
└──────────────┬──────────────────────────┘
               │ Socket.IO (WebSocket)
┌──────────────▼──────────────────────────┐
│         Servidor (Node + TS)            │
│  - SocketHandlers                       │
│  - QueueService (lógica de fila)        │
│  - IAManager (JSED+Fairness+WRR)        │
│  - StateManager (estado central)        │
│  - StatisticsPersistence                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Persistência Local              │
│  - dados.json (estado)                  │
│  - estatisticas/ (snapshots horários)   │
└─────────────────────────────────────────┘
```

---

## **⚙️ Funcionalidades Principais**

### **1. Gestão de Senhas**
- **Tipos:** Prioridade, Contratual, Normal
- **Emissão manual** (atendente solicita)
- **Chamada manual** (sem painel automático)
- **Tracking completo:** timestamp emissão, chamada, finalização
- **Correções v3.2:** sistema de ausências e tempo limite

### **2. Algoritmos de Sequenciamento**

#### **a) Proporção (Padrão)**
- Respeita proporção configurável (ex: 2 prioritárias : 1 contratual : 1 normal)
- Senhas em tempo limite têm prioridade absoluta

#### **b) Round Robin**
- Alterna igualmente entre tipos

#### **c) FIFO**
- Primeira a entrar, primeira a sair

#### **d) JSED + Fairness + WRR (IA Operacional)** ⭐
- **JSED (Joint Shortest Expected Delay):**
  ```
  SED = (tempo_espera + tempo_serviço_estimado) / peso_efetivo
  peso_efetivo = peso_base × aging × fast_boost
  ```
  - **Aging:** aumenta prioridade com tempo de espera
  - **Fast-service:** boost para atendimentos rápidos

- **Fairness (WRR - Weighted Round Robin):**
  - Detecta desbalanceamento nas chamadas
  - Ativa correção quando proporção real vs esperada > threshold (0.2)

- **ML Hint:** aceita sugestão do cliente se:
  - Senha prevista está no top-3 JSED
  - Score ≥ 0.65 (threshold configurável)
  - Latência ≤ 200ms

### **3. Sistema de Correções v3.2**

#### **Tempo Limite**
- Monitora senhas em espera
- Reordena fila quando tempo excedido (10min contratual, 20min prioridade, 25min normal)
- Pausa contagem durante ausências

#### **Ausências**
- 1 tentativa permitida (configurável)
- Após limite → move para histórico (não compareceu)
- Pausa contagem de tempo enquanto ausente

---

## **🤖 Integração de IA**

### **Pipeline de Inferência**

```typescript
// Cliente (Browser)
1. Carrega modelo ONNX (next_senha_int8.onnx)
2. Extrai features das senhas em espera
3. Executa inferência (≤35ms p95)
4. Envia mlHint ao servidor

// Servidor
5. IAManager recebe mlHint
6. Calcula top-3 JSED
7. Valida se mlHint está no top-3
8. Registra decisão (telemetria)
```

### **Thresholds de Aceitação**
```json
{
  "minScore": 0.65,
  "latencyMsMax": 200,
  "cooldownCalls": 20,
  "accuracyTarget": 0.75,
  "recallPrioridadeMin": 0.85,
  "fallbackRateMax": 0.30
}
```

### **Telemetria**
- Registro de decisões (fonte, confiança, top-3)
- Estado `ultimaDecisaoIA` propagado para UI
- Badge visual no `CounterPanel`

---

## **📊 Estatísticas e Métricas**

### **Básicas**
- Total emitidas/atendidas/não comparecidas
- Tempo médio de espera/atendimento
- Taxa de não comparecimento
- Produtividade por guichê

### **Avançadas** (AdvancedStatisticsService)
- Percentis (P50, P95, P99) de tempos
- Distribuição por tipo/serviço/horário
- Snapshots horários persistidos

---

## **🎨 Interface do Usuário**

### **Componentes Principais**
1. **CounterPanel:** gestão de guichês (chamar/finalizar/ausente)
2. **QueueList:** fila com filtros (todos/automática/prioridade/etc)
3. **CurrentAttendanceList:** atendimentos em andamento
4. **ConfigurationPanel:** configurações globais (9 abas)
5. **StatisticsPanel:** métricas e gráficos
6. **HistoryPanel:** histórico de senhas

### **Recursos UX**
- **Filtro "Automática (JSED)":** preview da ordenação JSED do servidor
- **Badge de IA:** mostra última decisão e estado (ativo/fallback)
- **Design Tokens:** sistema de cores/espaçamentos configurável
- **Modais:** ticket detalhado, confirmações, seleção de guichê

---

## **📝 Análise da Lista de Continuidade**

### **Compreensão da Lista `proximos_passos.md`**

A lista é **extremamente bem estruturada** e organizada em:

#### **Sistema de Pesos (1-6)**
- **Peso 1:** Crítico (Dashboard IA, fallback, preview JSED)
- **Peso 2:** UX/Performance/Modelagem
- **Peso 3:** Qualidade/Build
- **Peso 4:** Confiabilidade
- **Peso 5:** Bloqueios de alta prioridade

#### **Principais Trilhas de Trabalho**

**1. IA Operacional (Peso 1)** ✅ Parcialmente concluído
- ✅ IAManager implementado (JSED+Fair+WRR)
- ✅ Integração com QueueService
- ✅ Preview JSED no servidor
- ⏳ Fallback robusto (T-018)
- ⏳ Thresholds offline (T-043)
- ⏳ Coletar métricas para aprendizado (T-019)

**2. UX/Acessibilidade (Peso 2)**
- ⏳ Badge IA com contraste AA (T-032, T-054)
- ⏳ Foco visível e navegação por teclado (T-034)
- ⏳ Toasts padronizados com role="alert" (T-033)
- ⏳ Design tokens CSS vars (T-052, T-053)

**3. Performance (Peso 2)**
- ⏳ Instrumentar latência de socket (T-060)
- ⏳ Debounce de busca (T-061)
- ⏳ Code splitting ML (T-063)
- ⏳ Orçamento de bundle (T-064)

**4. Estimadores e Modelagem (Peso 2)**
- ⏳ λ(hora) e μ(hora) por janelas móveis (T-070, T-071)
- ⏳ Percentis P50/P95/P99 (T-072)
- ⏳ Previsão de tempo de espera (T-073)
- ⏳ Detecção de não-estacionariedade (T-074)

**5. Entrega Offline (Peso 5)**
- ⏳ Cache de dependências (T-037)
- ⏳ Assets ONNX locais (T-038)
- ⏳ Scripts .bat DEV/PROD (T-039, T-040)
- ⏳ Validação offline completa (T-041)
- ✅ Bind restrito 127.0.0.1 (T-042)

**6. Segurança/Conformidade (Peso 2)**
- ✅ CORS restrito em produção
- ⏳ Auditoria de segredos (T-081)
- ⏳ Logs sem PII (T-082)

---

## **🔍 Pontos Fortes do Projeto**

1. **Arquitetura moderna e escalável**
2. **TypeScript end-to-end** (type safety)
3. **Sistema de IA integrado** com validação rigorosa
4. **Offline-first** (sem dependências externas)
5. **Telemetria detalhada** para análise
6. **Sistema de correções** (v3.2) para distorções de fila
7. **Configurabilidade extrema** (9 abas de config)
8. **Documentação técnica excelente** (team_agents/)

---

## **⚠️ Desafios e Gaps**

### **Críticos**
1. **Modelo ONNX ausente:** inferência cai em fallback
2. **Estimativa de tempo de serviço:** hardcoded (5min) - precisa de estatísticas reais
3. **Fallback de IA:** não está robusto (T-018)

### **Importantes**
4. **Acessibilidade:** contraste, foco, ARIA incompletos
5. **Performance:** bundle pode crescer sem controle
6. **Testes E2E:** faltam testes automatizados para preview JSED

### **Secundários**
7. **Estimadores estatísticos:** não implementados (λ, μ, percentis)
8. **Entrega offline:** falta empacotar tudo (scripts .bat, cache npm)

---

## **✅ Recomendações**

### **Curto Prazo (Peso 1)**
1. **Implementar fallback robusto** (T-018) - essencial para produção
2. **Dashboard de IA** no ConfigurationPanel (T-016) - visibilidade para gestores
3. **Thresholds offline** (T-043) - publicar em client/public/ml/
4. **Coletar métricas** (T-019) - alimentar aprendizado contínuo

### **Médio Prazo (Peso 2)**
5. **Acessibilidade WCAG AA** (T-032 a T-036) - conformidade legal
6. **Estimadores reais** (T-026, T-070-T-079) - substituir hardcoded
7. **Performance** (T-060 a T-065) - garantir <250KB bundle

### **Longo Prazo (Peso 3-5)**
8. **Entrega offline completa** (T-037 a T-042)
9. **Testes E2E** (T-024)
10. **Auditoria de segurança** (T-081, T-082)

---

## **🎓 Conclusão**

O **SGFila v3.0** é um sistema **maduro e bem arquitetado**, com uma **excelente base de código** e **documentação de alta qualidade**. A integração de IA (JSED+Fairness+WRR) é **inovadora** e bem pensada.

A lista de continuidade (`proximos_passos.md`) demonstra **planejamento rigoroso** e **rastreabilidade** (IDs de tarefas). As pendências são **conhecidas, documentadas e priorizadas**.

**Principais bloqueadores para produção:**
- Modelo ONNX ausente
- Fallback de IA não robusto
- Falta de embalagem offline completa

**Recomendação:** Focar nos itens de **Peso 1** para ter um sistema **production-ready** com IA operacional e fallback confiável.

---

## **📚 Referências Técnicas**

### **Arquivos Principais**
- [v3/server/src/services/QueueService.ts](v3/server/src/services/QueueService.ts) - Lógica de fila e algoritmos
- [v3/server/src/services/IAManager.ts](v3/server/src/services/IAManager.ts) - Sistema de IA (JSED+WRR)
- [v3/server/src/services/StateManager.ts](v3/server/src/services/StateManager.ts) - Gerenciamento de estado
- [v3/client/src/App.vue](v3/client/src/App.vue) - Interface principal
- [v3/team_agents/desenvolvimento/proximos_passos.md](v3/team_agents/desenvolvimento/proximos_passos.md) - Plano de continuidade

### **Documentação do Projeto**
- README principal: Estrutura e requisitos básicos
- Team agents: Documentação de papéis e responsabilidades
- Requisitos: Especificações funcionais e não-funcionais

---

**Data do Relatório:** 2025-11-22
**Versão Analisada:** SGFila v3.0 / v3.2 (correções)
**Analista:** Claude (Anthropic)
