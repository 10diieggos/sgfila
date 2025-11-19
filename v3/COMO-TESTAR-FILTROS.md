# Como Testar o Sistema de Filtros Avançados

## 🚀 Iniciando o Sistema

### 1. Iniciar o Servidor

```bash
cd v3/server
npm start
```

**Saída esperada:**
```
=================================
SGFILA v3.0 - TypeScript + Vue 3
=================================
Servidor rodando em http://localhost:3000
Modo teste: DESATIVADO
Pressione Ctrl+C para parar
=================================
📊 Pasta de estatísticas inicializada: [caminho]/estatisticas
```

### 2. Abrir o Navegador

Acesse: `http://localhost:3000`

## 📊 Testando os Filtros

### Passo 1: Gerar Dados de Teste

1. **Emitir algumas senhas** (pelo menos 10-15):
   - Clique em "Prioritária"
   - Clique em "Normal"
   - Clique em "Contratual"

2. **Atender algumas senhas**:
   - Nos painéis de guichê, clique em "Chamar"
   - Finalize alguns atendimentos
   - Marque alguns como "Não Compareceu"

### Passo 2: Abrir Modal de Estatísticas

1. Clique no botão **"Estatísticas"** (ícone de gráfico)
2. O modal deve abrir ocupando 95% da tela
3. Você deve ver:
   - Filtros de período no topo
   - Indicador "Exibindo: Hoje (tempo real)"
   - Estatísticas do dia atual

### Passo 3: Testar Filtro "Hoje"

✅ **O que verificar:**
- Botão "Hoje" está ativo (roxo)
- Estatísticas atualizam em tempo real
- Gráfico de distribuição por hora mostra dados
- Cards de resumo mostram totais corretos
- **NÃO** deve mostrar indicadores de tendência

### Passo 4: Criar Dados Históricos

Para testar filtros de período, você precisa de dados históricos. Há duas opções:

#### Opção A: Aguardar Snapshots Automáticos
- O sistema salva snapshots a cada hora
- Aguarde 1 hora para ter dados do dia

#### Opção B: Criar Arquivos Manualmente (Recomendado para Teste)

1. Localize a pasta: `v3/server/dist/estatisticas/`
2. Copie o arquivo do dia atual:
   ```bash
   cd v3/server/dist/estatisticas
   copy estatisticas_2025-11-19.json estatisticas_2025-11-18.json
   copy estatisticas_2025-11-19.json estatisticas_2025-11-17.json
   copy estatisticas_2025-11-19.json estatisticas_2025-11-16.json
   # Continue até ter ~7-10 dias
   ```

3. Edite cada arquivo copiado e altere o campo `"data"`:
   ```json
   {
     "data": "2025-11-18",  // <- Altere para a data correspondente
     "modoTeste": false,
     // ... resto do arquivo
   }
   ```

### Passo 5: Testar Filtro "Últimos 7 dias"

1. Clique no botão **"Últimos 7 dias"**
2. Aguarde o loading (1-2 segundos)

✅ **O que verificar:**
- Indicador muda para "Exibindo: Últimos 7 dias (7 dias)"
- Totais somam os dados dos 7 dias
- Gráficos mostram dados agregados
- **Aparecem indicadores de tendência**:
  - Emissão: Crescente/Estável/Decrescente
  - Tempo de Espera: Melhorando/Estável/Piorando
- Variação percentual é exibida

### Passo 6: Testar Filtro "Últimos 30 dias"

1. Clique no botão **"Últimos 30 dias"**
2. Aguarde o loading

✅ **O que verificar:**
- Performance: deve carregar em < 1 segundo
- Dados agregados de até 30 dias
- Gráficos renderizam corretamente
- Tendências calculadas

### Passo 7: Testar Período Personalizado

1. Clique no botão **"Personalizado"**
2. Formulário de datas aparece
3. Selecione:
   - Data Início: ex: 2025-11-15
   - Data Fim: ex: 2025-11-18
4. Clique em **"Aplicar"**

✅ **O que verificar:**
- Botão "Aplicar" só fica ativo com datas válidas
- Não permite fim antes do início
- Não permite datas futuras
- Indicador mostra: "4 dias (2025-11-15 a 2025-11-18)"
- Dados do período correto são exibidos

### Passo 8: Voltar para "Hoje"

1. Clique no botão **"Hoje"** no canto superior (ou no filtro rápido)
2. Sistema volta para tempo real

✅ **O que verificar:**
- Dados atualizam em tempo real novamente
- Emitir nova senha → estatísticas atualizam
- Tendências desaparecem (período = 1 dia)

## 📈 Verificando Visualizações Gráficas

### Gráfico de Distribuição por Hora

✅ **Verificar:**
- 24 barras (0h a 23h)
- Barras azuis = senhas emitidas
- Barras verdes = senhas atendidas
- Estrelas aparecem nos horários de pico (mais movimento)
- Hover mostra quantidade

### Cards de Performance por Atendente

✅ **Verificar:**
- Um card para cada guichê ativo
- Total de atendimentos correto
- Tempo médio calculado
- Taxa de ocupação em %
- Barra de ocupação colorida:
  - Verde: alta ocupação (>80%)
  - Amarelo: média (50-80%)
  - Vermelho: baixa (<50%)

### Métricas de Qualidade

✅ **Verificar:**
- 4 cards com ícones coloridos
- Taxa de atendimento em %
- Taxa de não comparecimento em %
- Taxa de devolução em %
- Eficiência geral (atend/hora)
- Barras de progresso proporcionais

### Horários de Pico

✅ **Verificar:**
- Lista de períodos com maior movimento
- Descrição do horário (ex: "14h - 16h")
- Quantidade de senhas
- Ícone de estrela

### Análise de Devoluções (se houver)

✅ **Verificar:**
- Só aparece se houver devoluções
- Total correto
- Distribuição por motivo
- Percentuais somam 100%
- Tempo médio até retorno

## 🔍 Testando Casos Especiais

### Sem Dados no Período

1. Selecionar período futuro ou muito antigo
2. Deve mostrar erro: "Nenhum dado disponível para o período selecionado"

### Período com Poucos Dados

1. Selecionar apenas 1 dia com poucas senhas
2. Gráficos devem renderizar (barras pequenas, mas visíveis)
3. Não deve quebrar a interface

### Período Longo (30+ dias)

1. Se tiver muitos dados, verificar performance
2. Deve carregar em < 1 segundo
3. Sem travamentos
4. Scroll fluido

## 📱 Testando Responsividade

### Desktop (> 1024px)
- Layout completo visível
- Gráficos lado a lado
- Tabelas sem scroll horizontal

### Tablet (768px - 1024px)
- Resize da janela
- Grids ajustam para 2 colunas
- Tudo acessível

### Mobile (< 768px)
- Resize para largura pequena (375px)
- Filtros empilham verticalmente
- Gráficos ocupam largura total
- Tabelas com scroll horizontal
- Botões acessíveis

## ✨ Funcionalidades Esperadas

### Tempo Real (Filtro "Hoje")
1. Emitir nova senha
2. Modal de estatísticas deve atualizar automaticamente
3. Gráfico de distribuição atualiza
4. Totais incrementam

### Indicadores de Tendência

**Emissão:**
- 🡅 **Crescente**: Segunda metade teve >10% mais senhas que primeira
- 🡇 **Decrescente**: Segunda metade teve >10% menos senhas
- − **Estável**: Variação entre -10% e +10%

**Tempo de Espera:**
- 🡇 **Melhorando**: Tempo reduziu >10% (tempo menor = melhor)
- 🡅 **Piorando**: Tempo aumentou >10%
- − **Estável**: Variação entre -10% e +10%

### Performance

**Tempos esperados:**
- Filtro "Hoje": instantâneo
- Filtro "7 dias": < 100ms
- Filtro "30 dias": < 500ms
- Renderização de gráficos: < 50ms

## 🐛 Checklist de Bugs Comuns

- [ ] Modal não abre → Verificar console do navegador
- [ ] Filtros não funcionam → Verificar se servidor está rodando
- [ ] Sem dados históricos → Criar arquivos manualmente
- [ ] Gráficos vazios → Verificar se há senhas emitidas
- [ ] Tendências não aparecem → Precisa período > 1 dia
- [ ] Erro de Socket.IO → Verificar conexão com servidor
- [ ] Layout quebrado → Limpar cache do navegador (Ctrl+F5)

## 📝 Console do Navegador

Abra DevTools (F12) e verifique:

### Mensagens Esperadas
```javascript
// Ao abrir modal
Cliente conectado: [socket-id]

// Ao trocar filtro
Estatísticas recebidas: { estatisticas: {...}, periodoDescricao: "Últimos 7 dias" }

// Socket.IO
socket.io.js: Socket connected
```

### Erros a Investigar
```javascript
// Se aparecer:
Erro ao solicitar estatísticas de período
// → Verificar se pasta de estatísticas existe

Failed to fetch
// → Servidor não está rodando

Nenhum dado disponível
// → Período sem dados históricos
```

## ✅ Teste Completo Bem-Sucedido

Você terá testado completamente quando:

1. ✅ Todos os filtros funcionam (dia, semana, mês, personalizado)
2. ✅ Gráficos renderizam corretamente
3. ✅ Tendências aparecem para períodos > 1 dia
4. ✅ Tempo real funciona no filtro "Hoje"
5. ✅ Performance é aceitável (< 1s para agregações)
6. ✅ Modal abre/fecha corretamente
7. ✅ Responsividade funciona em todas as resoluções
8. ✅ Sem erros no console
9. ✅ Dados fazem sentido (totais corretos, médias razoáveis)
10. ✅ UX é intuitiva e fluida

## 🎯 Próximos Passos Após Testes

1. Documentar quaisquer bugs encontrados
2. Anotar sugestões de melhorias
3. Testar com dados reais de produção
4. Coletar feedback dos usuários
5. Monitorar performance em produção

---

**Data de Criação:** 2025-11-19
**Versão:** SGFILA v3.0
**Sistema:** Filtros Avançados de Estatísticas
