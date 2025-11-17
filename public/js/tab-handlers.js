// tab-handlers.js - Gerenciamento de abas e sub-abas

window.initializeTabHandlers = function initializeTabHandlers() {
    // Abas principais
    $('.tab-nav').on('click', '.tab-link', function(e) {
        e.preventDefault();
        const $this = $(this);
        const tabId = $this.data('tab');

        $('.tab-link').removeClass('active');
        $('.tab-content').removeClass('active');

        $this.addClass('active');
        $('#' + tabId).addClass('active');
    });

    // Sub-abas de estatísticas
    $('#tab-stats').on('click', '.sub-tab-link', function(e) {
        e.preventDefault();
        const $this = $(this);
        const subTabId = $this.data('sub-tab');

        $('#tab-stats .sub-tab-link').removeClass('active');
        $('#tab-stats .sub-tab-content').removeClass('active');

        $this.addClass('active');
        $('#' + subTabId).addClass('active');

        // Limpa o ticket sendo exibido se sair da aba
        if (subTabId !== 'sub-tab-ticket') {
            window.ticketInfoSendoExibido = null;
            $('#ticket-info-content').html(`
                <p style="padding: 10px 0; color: #868e96;">
                    Clique no ícone <i class="fas fa-info-circle"></i> de uma senha na fila de espera para ver os detalhes.
                </p>
            `);
        }
    });

    // Sub-abas de configuração
    $('#tab-config').on('click', '.sub-tab-link', function(e) {
        e.preventDefault();
        const $this = $(this);
        const subTabId = $this.data('sub-tab');

        $('#tab-config .sub-tab-link').removeClass('active');
        $('#tab-config .sub-tab-content').removeClass('active');

        $this.addClass('active');
        $('#' + subTabId).addClass('active');
    });
}
