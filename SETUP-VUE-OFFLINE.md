# Setup Vue.js 3 - Modo Offline (Sem Build Step)

## 🎯 Objetivo
Configurar Vue.js 3 para funcionar **completamente offline** sem build tools, mantendo o workflow simples atual (edita → salva → F5).

---

## 📥 Passo 1: Baixar Vue (Uma Vez Só)

### Opção A: Download Direto
1. Acesse: https://unpkg.com/vue@3/dist/vue.global.js
2. Salve o arquivo como `public/assets/vue.global.js`
3. Pronto! Agora funciona offline para sempre

### Opção B: Via Linha de Comando
```bash
cd public/assets
curl https://unpkg.com/vue@3/dist/vue.global.js -o vue.global.js
```

### Opção C: Via wget
```bash
cd public/assets
wget https://unpkg.com/vue@3/dist/vue.global.js -O vue.global.js
```

**Tamanho do arquivo:** ~470 KB (minificado)

---

## 🗂️ Passo 2: Estrutura de Pastas

Crie a seguinte estrutura:

```
public/
├── assets/
│   ├── jquery-3.6.0.min.js       ✅ Já existe
│   └── vue.global.js              ← Baixar
├── js/
│   ├── vue-components/            ← CRIAR
│   │   ├── queue-list.js
│   │   ├── counter-panel.js
│   │   └── ticket-details.js
│   ├── legacy/                    ← CRIAR (mover jQuery atual)
│   │   ├── ui-controller.js
│   │   └── ...
│   ├── app.js
│   └── ...
└── index.html
```

**Comando para criar:**
```bash
mkdir -p public/js/vue-components
mkdir -p public/js/legacy
```

---

## 📝 Passo 3: Modificar index.html

Adicione Vue antes dos seus scripts:

```html
<!-- index.html -->
<head>
    <!-- ... outros links ... -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/all.min.css">

    <!-- jQuery -->
    <script src="assets/jquery-3.6.0.min.js"></script>

    <!-- Vue.js 3 - ADICIONAR -->
    <script src="assets/vue.global.js"></script>
</head>
```

---

## 🧩 Passo 4: Criar Primeiro Componente Vue

Crie `public/js/vue-components/queue-list.js`:

```javascript
// Componente de lista de filas (substitui parte do ui-controller)
const QueueList = {
  template: `
    <div class="lista-senhas" id="lista-espera">
      <div v-if="senhasFiltradas.length === 0" class="senha-item">
        {{ mensagemVazia }}
      </div>

      <div v-for="senha in senhasFiltradas"
           :key="senha.numero"
           :class="['senha-item', senha.tipo]"
           :data-senha-numero="senha.numero">

        <div>
          <i :class="getIconClass(senha.tipo)"></i>
          <strong>{{ senha.numero }}</strong>

          <div v-if="senha.descricao"
               class="senha-item-descricao"
               v-html="formatarDescricao(senha.descricao)">
          </div>
        </div>

        <div class="senha-item-controles">
          <span>{{ calcularTempoEspera(senha.timestamp) }} min</span>

          <div class="botoes-wrapper">
            <button @click="verDetalhes(senha.numero)"
                    class="btn-acao-senha btn-acao-info"
                    title="Ver Detalhes">
              <i class="fas fa-info-circle"></i>
            </button>

            <button @click="chamar(senha.numero)"
                    class="btn-acao-senha btn-acao-chamar"
                    title="Chamar esta senha">
              <i class="fas fa-bullhorn"></i>
            </button>

            <button @click="editar(senha.numero)"
                    class="btn-acao-senha btn-acao-editar"
                    title="Editar Descrição">
              <i class="fas fa-edit"></i>
            </button>

            <button @click="excluir(senha.numero)"
                    class="btn-acao-senha btn-acao-excluir"
                    title="Excluir esta senha">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,

  props: {
    senhas: {
      type: Array,
      default: () => []
    },
    filtro: {
      type: String,
      default: 'emissao'
    },
    termoBusca: {
      type: String,
      default: ''
    }
  },

  computed: {
    senhasFiltradas() {
      if (!this.senhas) return [];

      let result = this.senhas.filter(s => s.status === 'espera');

      // Aplica busca
      if (this.termoBusca) {
        result = result.filter(s =>
          s.descricao &&
          s.descricao.toLowerCase().includes(this.termoBusca.toLowerCase())
        );
      }

      // Aplica ordenação
      if (this.filtro === 'emissao') {
        result.sort((a, b) => a.timestamp - b.timestamp);
      } else if (this.filtro === 'tipo') {
        const ordem = { prioridade: 1, contratual: 2, normal: 3 };
        result.sort((a, b) => {
          if (ordem[a.tipo] !== ordem[b.tipo]) {
            return ordem[a.tipo] - ordem[b.tipo];
          }
          return a.timestamp - b.timestamp;
        });
      }

      return result;
    },

    mensagemVazia() {
      if (this.termoBusca) {
        return 'Nenhuma senha encontrada com essa descrição.';
      }
      return 'Nenhuma senha na fila';
    }
  },

  methods: {
    getIconClass(tipo) {
      const icons = {
        prioridade: 'fas fa-wheelchair',
        contratual: 'fas fa-file-contract',
        normal: 'fas fa-user'
      };
      return icons[tipo] || 'fas fa-user';
    },

    calcularTempoEspera(timestamp) {
      const agora = new Date().getTime();
      return Math.round((agora - timestamp) / 60000);
    },

    formatarDescricao(descricao) {
      return descricao.replace(/\n/g, '<br>');
    },

    verDetalhes(numero) {
      this.$emit('ver-detalhes', numero);
    },

    chamar(numero) {
      this.$emit('chamar', numero);
    },

    editar(numero) {
      this.$emit('editar', numero);
    },

    excluir(numero) {
      this.$emit('excluir', numero);
    }
  }
};

// Expor globalmente para uso no app
window.QueueList = QueueList;
```

---

## 🔧 Passo 5: Integrar Vue no app.js

Modifique `public/js/app.js` para incluir Vue:

```javascript
// app.js - Versão híbrida jQuery + Vue
$(document).ready(function() {
    const { createApp } = Vue;

    // Inicializa Socket.IO
    window.socket = io();

    // Inicializa variáveis globais
    window.estadoLocal = {};
    window.estatisticasLocais = {};
    window.guichesGlobais = [];
    window.filtroAtivo = 'emissao';
    window.termoBusca = '';

    // Cria aplicação Vue
    const app = createApp({
        components: {
            QueueList: window.QueueList
        },

        data() {
            return {
                estado: {},
                filtro: 'emissao',
                busca: ''
            }
        },

        mounted() {
            // Socket listeners
            window.socket.on('estadoAtualizado', (payload) => {
                console.log('Estado atualizado:', payload);

                // Atualiza Vue (reativo)
                this.estado = payload.estado || {};

                // Atualiza globals para código jQuery legado
                window.estadoLocal = payload.estado || {};
                window.estatisticasLocais = payload.estatisticas || {};
                window.guichesGlobais = payload.estado.guichesConfigurados || [];
            });
        },

        methods: {
            handleVerDetalhes(numero) {
                $('.tab-link[data-tab="tab-stats"]').trigger('click');
                $('.sub-tab-link[data-sub-tab="sub-tab-ticket"]').trigger('click');
                window.ticketInfoSendoExibido = numero;
                renderizarDetalhesDoTicket(numero);
            },

            handleChamar(numero) {
                const exibicaoSalva = sessionStorage.getItem('sgfGuichesExibicao');
                const meusGuiches = exibicaoSalva ? JSON.parse(exibicaoSalva) : [];

                if (meusGuiches.length === 0) {
                    alert('Configure guichês primeiro');
                    return;
                }

                const atendimentos = this.estado.atendimentosAtuais || {};
                const guicheLivre = meusGuiches.find(nome => !atendimentos[nome]);

                if (!guicheLivre) {
                    alert('Todos os guichês estão ocupados');
                    return;
                }

                window.chamarSenhaEspecifica(guicheLivre, numero);
            },

            handleEditar(numero) {
                const senha = (this.estado.senhas || []).find(s => s.numero === numero);
                if (senha) {
                    $('#modal-editar-titulo').text(`Editar Descrição (${senha.numero})`);
                    $('#hidden-editar-senha-numero').val(senha.numero);
                    $('#textarea-editar-descricao').val(senha.descricao || '');
                    $('#modal-editar-descricao').css('display', 'flex');
                }
            },

            handleExcluir(numero) {
                if (confirm(`Excluir senha ${numero}?`)) {
                    window.excluirSenha(numero);
                }
            }
        }
    });

    app.mount('#app');

    // Inicializa módulos jQuery legados
    initializeSocketHandlers();
    initializeGuicheManager();
    initializeModalHandlers();
    initializeTabHandlers();
    initializeFilterHandlers();
    initializeEventHandlers();

    console.log('SGF inicializado (Vue + jQuery)');
});
```

---

## 📄 Passo 6: Atualizar index.html para usar Vue

Modifique a seção da fila de espera:

```html
<!-- ANTES (jQuery puro) -->
<div class="lista-senhas" id="lista-espera">
    <!-- Renderizado via jQuery -->
</div>

<!-- DEPOIS (Vue component) -->
<div id="app">
    <queue-list
        :senhas="estado.senhas || []"
        :filtro="filtro"
        :termo-busca="busca"
        @ver-detalhes="handleVerDetalhes"
        @chamar="handleChamar"
        @editar="handleEditar"
        @excluir="handleExcluir">
    </queue-list>
</div>
```

E adicione o script do componente:

```html
<!-- Antes do app.js -->
<script src="js/vue-components/queue-list.js"></script>
<script src="js/app.js"></script>
```

---

## ✅ Resultado Final

### Workflow
```
1. Edita queue-list.js
2. Salva (Ctrl+S)
3. F5 no navegador
4. Funciona! ✅
```

### Benefícios
- ✅ 100% Offline
- ✅ Zero build tools
- ✅ Zero npm/node_modules
- ✅ Reatividade automática do Vue
- ✅ Componentes organizados
- ✅ Compatível com jQuery existente

### Comparação de Código

**ANTES (ui-controller.js):**
- 931 linhas
- Render manual
- jQuery DOM manipulation

**DEPOIS (queue-list.js):**
- ~150 linhas
- Render automático
- Declarativo e reativo

---

## 🎓 Próximos Passos

Depois de testar a lista de filas, pode migrar gradualmente:

1. ✅ **queue-list.js** (primeiro)
2. **counter-panel.js** (painéis de guichê)
3. **statistics-panel.js** (estatísticas)
4. **ticket-details.js** (detalhes do ticket)
5. **modals.js** (modais)

Cada conversão reduz código e melhora manutenibilidade.

---

## 📞 Suporte

Se tiver dúvidas ou problemas, as principais armadilhas são:

1. **Vue não carrega**: Verifique o caminho do `vue.global.js`
2. **Componente não aparece**: Abra console do navegador (F12) para ver erros
3. **Estado não atualiza**: Certifique-se que `app.mount('#app')` está rodando

---

**Criado em**: 2025-11-17
**Versão Vue**: 3.x
**Modo**: Production-ready, sem build step
