# SGFila - Sistema de Gerenciamento de Fila

## 🚀 Como Iniciar o Sistema

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor
```bash
npm start
```

Ou diretamente:
```bash
node server.js
```

### 3. Acessar o Sistema
Abra seu navegador em:
- Local: http://localhost:3000
- Rede: http://[IP_DO_SERVIDOR]:3000

## ⚠️ IMPORTANTE

**O sistema DEVE ser acessado através do servidor!**

❌ **NÃO abra** o arquivo `public/index.html` diretamente no navegador (clicando duas vezes)
✅ **SEMPRE inicie** o servidor com `npm start` e acesse via `http://localhost:3000`

### Por quê?
- Os arquivos JavaScript e CSS precisam ser servidos pelo servidor
- O WebSocket só funciona com o servidor rodando
- Os ícones do Font Awesome não carregam sem o servidor

## 📁 Nova Estrutura do Projeto

```
sgfila/
├── server/                          # Backend modular
│   ├── state-manager.js            # Gerenciamento de estado
│   ├── statistics.js               # Cálculo de estatísticas
│   └── socket-handlers.js          # Handlers WebSocket
│
├── public/                          # Frontend organizado
│   ├── css/
│   │   ├── main.css                # Estilos principais
│   │   ├── all.min.css             # Font Awesome
│   │   └── webfonts/               # Fontes de ícones
│   │
│   ├── js/
│   │   ├── app.js                  # Ponto de entrada
│   │   ├── utils.js                # Funções auxiliares
│   │   ├── socket-client.js        # Comunicação WebSocket
│   │   ├── ui-controller.js        # Renderização de UI
│   │   ├── guiche-manager.js       # Gerenciamento de guichês
│   │   ├── modal-handlers.js       # Modais
│   │   ├── tab-handlers.js         # Navegação de abas
│   │   ├── filter-handlers.js      # Filtros de fila
│   │   └── event-handlers.js       # Eventos
│   │
│   └── index.html                  # HTML limpo
│
├── server.js                        # Servidor principal
└── package.json                     # Configuração

```

## 🐛 Troubleshooting

### Ícones não aparecem
- ✅ Certifique-se de que o servidor está rodando
- ✅ Acesse via `http://localhost:3000` (não abra o arquivo diretamente)
- ✅ Verifique se as fontes estão em `public/css/webfonts/`

### Nada é clicável
- ✅ Abra o Console do navegador (F12)
- ✅ Procure por erros JavaScript
- ✅ Certifique-se de que todos os arquivos JS foram carregados
- ✅ Verifique se o jQuery foi carregado

### Servidor não inicia
- ✅ Execute `npm install` primeiro
- ✅ Verifique se a porta 3000 está livre
- ✅ Veja o console para mensagens de erro

## ✨ Benefícios da Refatoração

1. **Código Modular**: Cada arquivo tem uma responsabilidade clara
2. **Fácil Manutenção**: Bugs são mais fáceis de localizar e corrigir
3. **Performance**: CSS e JS são cacheados separadamente
4. **Escalabilidade**: Adicionar features sem bagunçar o código
5. **Colaboração**: Reduz conflitos ao trabalhar em equipe

## 📝 Arquivos de Backup

Os arquivos originais foram preservados:
- `index.html.backup` - HTML original (2.611 linhas)
- `server.js.backup` - Servidor original (678 linhas)

Você pode restaurá-los se necessário, mas recomendamos usar a versão refatorada!
