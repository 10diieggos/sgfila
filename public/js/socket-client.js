// socket-client.js - Gerenciamento de comunicação WebSocket

function initializeSocketHandlers() {
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
function emitirSenha(tipo, subtipo = '') {
    window.socket.emit('emitirSenha', { tipo, subtipo });
}

function chamarSenha(guicheId) {
    window.socket.emit('chamarSenha', { guicheId });
}

function chamarSenhaEspecifica(guicheId, numeroSenha) {
    window.socket.emit('chamarSenhaEspecifica', { guicheId, numeroSenha });
}

function finalizarAtendimento(guicheId) {
    window.socket.emit('finalizarAtendimento', { guicheId });
}

function excluirSenha(numeroSenha) {
    window.socket.emit('excluirSenha', { numeroSenha });
}

function excluirAtendimento(numeroSenha) {
    window.socket.emit('excluirAtendimento', { numeroSenha });
}

function devolverSenha(numeroSenha) {
    window.socket.emit('devolverSenha', { numeroSenha });
}

function atualizarDescricao(numeroSenha, descricao) {
    window.socket.emit('atualizarDescricao', { numeroSenha, descricao });
}

function atualizarProporcao(novaProporcao) {
    window.socket.emit('atualizarProporcao', novaProporcao);
}

function atualizarProporcaoContratual(novaProporcao) {
    window.socket.emit('atualizarProporcaoContratual', novaProporcao);
}

function atualizarGuichesGlobais(guiches) {
    window.socket.emit('atualizarGuichesGlobais', guiches);
}

function reiniciarSistema() {
    window.socket.emit('reiniciarSistema');
}
