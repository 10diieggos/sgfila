// app.js - Ponto de entrada da aplicação
$(document).ready(function() {
    // Inicializa o socket
    window.socket = io();

    // Inicializa variáveis globais
    window.estadoLocal = {};
    window.estatisticasLocais = {};
    window.guichesGlobais = [];
    window.descricaoAtiva = false;
    window.acaoConfirmadaCallback = null;
    window.filtroAtivo = 'emissao';
    window.termoBusca = '';
    window.ticketInfoSendoExibido = null;

    // Helpers de ordenação
    window.tipoValor = { 'prioridade': 1, 'contratual': 2, 'normal': 3 };

    // Inicializa os módulos
    initializeUI();
    initializeSocketHandlers();
    initializeGuicheManager();
    initializeModalHandlers();
    initializeTabHandlers();
    initializeFilterHandlers();
    initializeEventHandlers();

    // Atualização periódica dos tempos de espera
    setInterval(() => {
        if (window.estadoLocal.senhas && window.estadoLocal.senhas.length > 0) {
            renderizarFilaDeEspera();
        }
    }, 60000); // Atualiza a cada minuto

    console.log('SGF - Sistema de Gerenciamento de Fila inicializado');
});
