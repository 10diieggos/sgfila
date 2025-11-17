# Estratégia de Versionamento - SGFILA

## Versões Estáveis

### v1.0.0 - Versão Original Monolítica
- **Branch**: `main`
- **Commit**: `4d854b6` (Operacional)
- **Status**: Estável e funcional
- **Arquitetura**: Monolítica (index.html com 2.611 linhas)

**Características:**
- Todo código em arquivo único
- CSS e JavaScript inline
- Fácil de entender para iniciantes
- Funciona perfeitamente

**Quando usar:**
- Projetos pequenos
- Prototipagem rápida
- Quando simplicidade é prioridade

---

### v2.0.0 - Versão Refatorada Modular
- **Branch de desenvolvimento**: `claude/refactor-project-structure-01XzGWURUfpsvtb6YdtTWnW3`
- **Branch de release**: `claude/release-v2-01XzGWURUfpsvtb6YdtTWnW3`
- **Commit**: `80d5ad6` (Fix: Move webfonts to correct location for Font Awesome)
- **Status**: Estável e funcional

**Arquitetura:**
```
sgfila/
├── server/                    # Módulos do servidor (3 arquivos)
│   ├── state-manager.js       # Gerenciamento de estado
│   ├── statistics.js          # Cálculo de estatísticas
│   └── socket-handlers.js     # Handlers WebSocket
├── public/
│   ├── css/                   # Estilos
│   │   ├── main.css          # 952 linhas
│   │   └── all.min.css       # Font Awesome
│   ├── js/                    # JavaScript modular (8 arquivos)
│   │   ├── app.js            # Ponto de entrada
│   │   ├── ui-controller.js  # Controle de UI
│   │   ├── socket-client.js  # Cliente WebSocket
│   │   ├── guiche-manager.js # Gerenciamento de guichês
│   │   ├── modal-handlers.js # Modais
│   │   ├── tab-handlers.js   # Tabs
│   │   ├── filter-handlers.js# Filtros
│   │   ├── event-handlers.js # Eventos
│   │   └── utils.js          # Utilitários
│   ├── webfonts/             # Fontes do Font Awesome
│   ├── assets/               # Recursos
│   └── index.html            # 348 linhas (apenas estrutura)
└── server.js                  # 43 linhas (orquestração)
```

**Benefícios:**
- Manutenibilidade significativamente melhorada
- Código organizado por responsabilidade
- Facilita debugging
- Preparado para crescimento
- Mais fácil trabalhar em equipe

**Quando usar:**
- Projetos em produção
- Desenvolvimento contínuo
- Trabalho em equipe
- Quando escalabilidade importa

---

## Como Usar as Versões

### Checkout da v1.0.0 (Original)
```bash
git checkout main
# ou
git checkout tags/v1.0.0
```

### Checkout da v2.0.0 (Refatorada)
```bash
git checkout claude/release-v2-01XzGWURUfpsvtb6YdtTWnW3
# ou
git checkout tags/v2.0.0
```

---

## Tags Criadas Localmente

As seguintes tags foram criadas:
- `v1.0.0` → commit `4d854b6` no branch `main`
- `v2.0.0` → commit `80d5ad6` no branch refatorado

**Para fazer push das tags no seu ambiente local:**
```bash
git push origin v1.0.0
git push origin v2.0.0
```

---

## Branches Remotos Disponíveis

1. **main** - Versão original estável
2. **claude/refactor-project-structure-01XzGWURUfpsvtb6YdtTWnW3** - Branch de desenvolvimento da v2
3. **claude/release-v2-01XzGWURUfpsvtb6YdtTWnW3** - Branch de release estável da v2

---

## Histórico de Commits da v2

```
80d5ad6 Fix: Move webfonts to correct location for Font Awesome
f8869b2 Fix: Make UIController use global window state
6d6b4b1 Docs: Add troubleshooting guide for refactored structure
ba9784c Fix: Expose all functions globally for backward compatibility
e6582d7 Refactor: Restructure project for better maintainability
```

---

## Recomendações

### Para Desenvolvimento Futuro
Use o branch **claude/release-v2-01XzGWURUfpsvtb6YdtTWnW3** como base para novas features.

### Para Manutenção da v1
Use o branch **main** se precisar fazer correções na versão original.

### Para Produção
Recomendado usar **v2.0.0** pela arquitetura modular e manutenibilidade.

---

## Migração de v1 para v2

A migração é **automática** - o arquivo `dados.json` é compatível entre as versões:
- v1 e v2 usam o mesmo formato de dados
- Basta trocar de branch e reiniciar o servidor
- Nenhuma conversão necessária

---

**Última atualização**: 2025-11-17
