// filter-handlers.js - Gerenciamento de filtros de fila

window.initializeFilterHandlers = function initializeFilterHandlers() {
    // Filtros de ordenação
    $('.filtro-botoes').on('click', '.btn-filtro', function() {
        const $this = $(this);
        window.filtroAtivo = $this.data('filtro');

        // Atualiza o estado visual dos botões
        $('.btn-filtro').removeClass('active');
        $this.addClass('active');

        // Re-renderiza a lista com o novo filtro
        renderizarFilaDeEspera();
    });

    // Filtro de busca por descrição
    $('#filtro-busca').on('keyup', function() {
        window.termoBusca = $(this).val().trim().toLowerCase();
        renderizarFilaDeEspera();
    });
}
