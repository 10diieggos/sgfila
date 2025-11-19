# Plano de Testes - Sistema de Filtros Avançados

## Checklist de Testes

### 1. Backend - Compilação e Inicialização

- [x] TypeScript compila sem erros
- [ ] Servidor inicia sem erros
- [ ] StatisticsAggregator é instanciado corretamente
- [ ] Pasta `dist/estatisticas` é criada automaticamente
- [ ] Snapshots são salvos a cada hora

**Como testar:**
```bash
cd v3/server
npm run build
npm start
```

**Saída esperada:**
```
📊 Pasta de estatísticas inicializada: [caminho]/estatisticas
Servidor rodando em http://localhost:3000
```

### 2. Frontend - Componentes

#### 2.1 StatisticsPeriodFilter.vue

- [ ] Componente renderiza sem erros
- [ ] Botões de filtro rápido funcionam
- [ ] Seletor de período personalizado abre/fecha
- [ ] Validação de datas funciona
- [ ] Botão "Aplicar" só ativa com datas válidas
- [ ] Indicador de período exibe descrição correta
- [ ] Tendências aparecem para períodos > 1 dia

**Teste manual:**
1. Abrir aba de estatísticas
2. Clicar em cada filtro rápido
3. Abrir período personalizado
4. Selecionar datas inválidas (fim antes do início)
5. Verificar que botão "Aplicar" está desabilitado
6. Selecionar datas válidas e aplicar

#### 2.2 StatisticsCharts.vue

- [ ] Gráfico de distribuição por hora renderiza
- [ ] Barras são proporcionais aos valores
- [ ] Horários de pico têm estrela
- [ ] Cards de performance aparecem
- [ ] Métricas de qualidade renderizam
- [ ] Barras de progresso funcionam
- [ ] Hover nos gráficos mostra tooltips

**Teste manual:**
1. Verificar gráfico de barras (24 horas)
2. Passar mouse sobre barras
3. Verificar cores (azul = emitidas, verde = atendidas)
4. Verificar se estrelas aparecem nos picos
5. Conferir cards de atendentes
6. Verificar barras de ocupação

#### 2.3 StatisticsPanelWithFilters.vue

- [ ] Componente integrado renderiza
- [ ] Filtro + gráficos + tabelas aparecem juntos
- [ ] Estado de loading aparece durante carregamento
- [ ] Dados atualizam ao trocar filtro
- [ ] Tabelas tradicionais ainda funcionam
- [ ] Responsividade em mobile funciona

**Teste manual:**
1. Abrir painel completo
2. Trocar entre filtros
3. Verificar que loading aparece
4. Confirmar que dados atualizam
5. Redimensionar janela para mobile

### 3. Integração Socket.IO

#### 3.1 Eventos do Cliente

- [ ] `solicitarEstatisticasPeriodo` é enviado corretamente
- [ ] `solicitarDiasDisponiveis` funciona
- [ ] Parâmetros são enviados no formato correto

**Teste (console do navegador):**
```javascript
// Abrir DevTools > Console
socket.emit('solicitarEstatisticasPeriodo', {
  tipo: 'semana'
})

socket.emit('solicitarDiasDisponiveis')
```

#### 3.2 Eventos do Servidor

- [ ] `estatisticasAgregadas` é recebido no cliente
- [ ] `diasDisponiveis` é recebido
- [ ] `erroOperacao` é tratado corretamente

**Teste (console do navegador):**
```javascript
socket.on('estatisticasAgregadas', (dados) => {
  console.log('Estatísticas recebidas:', dados)
})

socket.on('diasDisponiveis', (dados) => {
  console.log('Dias disponíveis:', dados.dias)
})
```

### 4. Agregação de Dados

#### 4.1 Período de 1 Dia (Hoje)

- [ ] Retorna dados do dia atual
- [ ] Estatísticas em tempo real funcionam
- [ ] Projeção aparece
- [ ] Tendências NÃO aparecem (período = 1 dia)

**Teste:**
1. Clicar em "Hoje"
2. Verificar que dados são atuais
3. Emitir nova senha
4. Confirmar que estatísticas atualizam
5. Verificar que não há indicadores de tendência

#### 4.2 Período de 7 Dias

- [ ] Retorna dados agregados de 7 dias
- [ ] Totais somam corretamente
- [ ] Médias são ponderadas
- [ ] Tendências aparecem
- [ ] Indicadores mostram variação percentual

**Teste:**
1. Clicar em "Últimos 7 dias"
2. Verificar totais de emissão (soma)
3. Verificar tempo médio (deve ser média ponderada)
4. Confirmar que tendências aparecem
5. Verificar variação percentual

#### 4.3 Período de 30 Dias

- [ ] Retorna dados agregados de 30 dias
- [ ] Performance não degrada
- [ ] Gráficos renderizam corretamente
- [ ] Todas as métricas estão presentes

**Teste:**
1. Clicar em "Últimos 30 dias"
2. Cronometrar tempo de resposta (< 1s)
3. Verificar se todos os gráficos aparecem
4. Conferir se dados fazem sentido

#### 4.4 Período Personalizado

- [ ] Permite selecionar intervalo específico
- [ ] Valida datas corretamente
- [ ] Calcula dias analisados corretamente
- [ ] Descrição do período está correta

**Teste:**
1. Abrir período personalizado
2. Selecionar 2025-11-10 a 2025-11-15 (6 dias)
3. Aplicar filtro
4. Verificar que "6 dias" aparece
5. Conferir datas no título

### 5. Cálculo de Tendências

#### 5.1 Tendência de Emissão

- [ ] "Crescente" quando variação > +10%
- [ ] "Decrescente" quando variação < -10%
- [ ] "Estável" quando -10% ≤ variação ≤ +10%
- [ ] Percentual de variação correto

**Teste:**
- Comparar primeira metade vs segunda metade do período
- Calcular manualmente a variação
- Confirmar que classificação está correta

#### 5.2 Tendência de Atendimento

- [ ] "Melhorando" quando tempo REDUZ > 10%
- [ ] "Piorando" quando tempo AUMENTA > 10%
- [ ] "Estável" quando -10% ≤ variação ≤ +10%

**Nota:** Tempo menor = melhor serviço

### 6. Visualizações Gráficas

#### 6.1 Distribuição por Hora

- [ ] 24 barras (0h a 23h)
- [ ] Barras proporcionais aos valores
- [ ] Cores corretas (azul/verde)
- [ ] Picos marcados com estrela
- [ ] Legenda clara

**Checagem visual:**
- Barras mais altas = horários com mais movimento
- Horários sem movimento = barras mínimas (2%)
- Estrelas aparecem nos 3-4 horários mais movimentados

#### 6.2 Performance por Atendente

- [ ] Cards para cada guichê
- [ ] Eficiência calculada (atend/hora)
- [ ] Taxa de ocupação em %
- [ ] Barra de ocupação colorida
- [ ] Cores da eficiência: verde (≥4), amarelo (≥2), vermelho (<2)

#### 6.3 Métricas de Qualidade

- [ ] 4 cards de métricas
- [ ] Ícones corretos
- [ ] Valores em %
- [ ] Barras de progresso proporcionais

#### 6.4 Horários de Pico

- [ ] Lista de períodos de pico
- [ ] Descrição de horário correta
- [ ] Quantidade de senhas exibida
- [ ] Ícone de estrela presente

#### 6.5 Análise de Devoluções

- [ ] Só aparece se houver devoluções
- [ ] Total de devoluções correto
- [ ] Distribuição por motivo em %
- [ ] Tempo médio de retorno exibido

### 7. Responsividade

#### Mobile (< 768px)

- [ ] Filtros empilham verticalmente
- [ ] Gráficos se ajustam
- [ ] Tabelas têm scroll horizontal
- [ ] Cards ocupam largura total
- [ ] Botões são acessíveis

**Teste:**
1. Redimensionar para 375px (iPhone)
2. Verificar todos os componentes
3. Testar interação touch
4. Confirmar legibilidade

#### Tablet (768px - 1024px)

- [ ] Layout intermediário funciona
- [ ] Grids ajustam colunas
- [ ] Espaçamento adequado

#### Desktop (> 1024px)

- [ ] Layout completo visível
- [ ] Grids com múltiplas colunas
- [ ] Uso eficiente do espaço

### 8. Casos de Erro

#### 8.1 Sem Dados no Período

- [ ] Mensagem de erro clara
- [ ] Não quebra a interface
- [ ] Sugere tentar outro período

**Simular:**
- Selecionar período futuro
- Verificar mensagem de erro

#### 8.2 Servidor Offline

- [ ] Timeout de conexão
- [ ] Mensagem de erro ao usuário
- [ ] Possibilidade de retry

#### 8.3 Dados Corrompidos

- [ ] Tratamento de JSON inválido
- [ ] Fallback para dados em branco
- [ ] Log de erro no servidor

### 9. Performance

#### Frontend

- [ ] Renderização inicial < 100ms
- [ ] Troca de filtro < 50ms (exceto rede)
- [ ] Gráficos sem lag
- [ ] Smooth scroll

**Teste (DevTools > Performance):**
1. Gravar performance
2. Trocar entre filtros
3. Verificar tempo de renderização

#### Backend

- [ ] Agregação de 7 dias < 100ms
- [ ] Agregação de 30 dias < 500ms
- [ ] Consumo de memória estável
- [ ] Sem memory leaks

**Teste (console servidor):**
```bash
# Adicionar logs de timing
console.time('agregacao')
// ... código de agregação
console.timeEnd('agregacao')
```

#### Socket.IO

- [ ] Latência < 50ms (localhost)
- [ ] Payload compacto
- [ ] Sem desconexões

### 10. Integração Completa

#### Fluxo Completo de Uso

1. [ ] Usuário abre aplicação
2. [ ] Estatísticas do dia carregam automaticamente
3. [ ] Usuário clica em "Últimos 7 dias"
4. [ ] Loading aparece
5. [ ] Dados agregados carregam
6. [ ] Gráficos renderizam
7. [ ] Tendências aparecem
8. [ ] Usuário pode explorar dados
9. [ ] Usuário volta para "Hoje"
10. [ ] Tempo real volta a funcionar

### 11. Dados Realistas

#### Simular Dados Históricos

Para testar com dados realistas, criar arquivos JSON manualmente:

```bash
# Criar arquivo de teste
cd v3/server/dist/estatisticas
# Copiar estatisticas_2025-11-19.json para datas anteriores
cp estatisticas_2025-11-19.json estatisticas_2025-11-18.json
cp estatisticas_2025-11-19.json estatisticas_2025-11-17.json
# ... até ter 30 dias
```

Depois ajustar o campo `data` em cada arquivo.

### Checklist Final

- [ ] Todos os testes acima passaram
- [ ] Documentação revisada
- [ ] Código commitado
- [ ] README atualizado com instruções de filtros
- [ ] Exemplos de uso documentados
- [ ] Performance aceitável
- [ ] UX intuitiva
- [ ] Sem bugs críticos

## Bugs Conhecidos

_(Listar bugs encontrados durante testes)_

## Melhorias Futuras

1. Cache de consultas no cliente
2. Debounce em filtros personalizados
3. Animações de transição entre filtros
4. Export de gráficos como imagem
5. Tooltips mais informativos
6. Comparação lado a lado de períodos

## Notas de Teste

_(Anotar observações durante testes)_

---

**Testado por:** _______________________
**Data:** _______________________
**Versão:** SGFILA v3.0
