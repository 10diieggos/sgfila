// socket-client.js - Gerenciamento de comunicação WebSocket

window.initializeSocketHandlers = function initializeSocketHandlers() {
    const socket = window.socket;

    // Recebe estado atualizado do servidor
    socket.on('estadoAtualizado', (payload) => {
        console.log('Recebido novo estado do servidor:', payload);

        window.estadoLocal = payload.estado || {};
        window.estatisticasLocais = payload.estatisticas || {};
        window.guichesGlobais = window.estadoLocal.guichesConfigurados || [];

        // Atualiza proporções na UI
        $('#input-ratio').val(window.estadoLocal.proporcaoPrioridade || 2);
        $('#input-ratio-contratual').val(window.estadoLocal.proporcaoContratual || 1);

        // Verifica se há input com foco antes de renderizar
        const $focusedInput = $('#guiche-global-list input:focus');

        if ($focusedInput.length) {
            renderizarGuichesExibicao();
        } else {
            renderizarGuichesGlobais();
        }

        atualizarInterface(payload.estatisticas || {});
    });

    // Toca beep ao emitir ou chamar senha
    socket.on('beep', (dados) => {
        beep(dados.times);
        if (dados.tipo === 'emissao') {
            $('#senha-gerada-numero').text(dados.numero);
            $('#hidden-nova-senha-numero').val(dados.numero);
            $('#textarea-nova-senha-descricao').val('');
            $('#form-group-nova-senha').hide();
            window.descricaoAtiva = false;

            $('#modal-nova-senha').css('display', 'flex');
            $('body').css('overflow', 'hidden');
        }
    });

    // Sistema reiniciado
    socket.on('sistemaReiniciado', () => {
        sessionStorage.removeItem('sgfGuichesExibicao');
        window.location.reload();
    });
}

// Funções para emitir eventos ao servidor
window.emitirSenha = function emitirSenha(tipo, subtipo = '') {
    window.socket.emit('emitirSenha', { tipo, subtipo });
}

window.chamarSenha = function chamarSenha(guicheId) {
    window.socket.emit('chamarSenha', { guicheId });
}

window.chamarSenhaEspecifica = function chamarSenhaEspecifica(guicheId, numeroSenha) {
    window.socket.emit('chamarSenhaEspecifica', { guicheId, numeroSenha });
}

window.finalizarAtendimento = function finalizarAtendimento(guicheId) {
    window.socket.emit('finalizarAtendimento', { guicheId });
}

window.excluirSenha = function excluirSenha(numeroSenha) {
    window.socket.emit('excluirSenha', { numeroSenha });
}

window.excluirAtendimento = function excluirAtendimento(numeroSenha) {
    window.socket.emit('excluirAtendimento', { numeroSenha });
}

window.devolverSenha = function devolverSenha(numeroSenha) {
    window.socket.emit('devolverSenha', { numeroSenha });
}

window.atualizarDescricao = function atualizarDescricao(numeroSenha, descricao) {
    window.socket.emit('atualizarDescricao', { numeroSenha, descricao });
}

window.atualizarProporcao = function atualizarProporcao(novaProporcao) {
    window.socket.emit('atualizarProporcao', novaProporcao);
}

window.atualizarProporcaoContratual = function atualizarProporcaoContratual(novaProporcao) {
    window.socket.emit('atualizarProporcaoContratual', novaProporcao);
}

window.atualizarGuichesGlobais = function atualizarGuichesGlobais(guiches) {
    window.socket.emit('atualizarGuichesGlobais', guiches);
}

window.reiniciarSistema = function reiniciarSistema() {
    window.socket.emit('reiniciarSistema');
}
