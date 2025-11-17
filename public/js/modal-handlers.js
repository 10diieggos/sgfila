// modal-handlers.js - Gerenciamento de modais

function initializeModalHandlers() {
    // Modal de reiniciar sistema
    $('#btn-confirmar-reiniciar').on('click', function() {
        reiniciarSistema();
        $('#modal-reiniciar').css('display', 'none');
    });

    $('#btn-cancelar-reiniciar').on('click', function() {
        $('#modal-reiniciar').css('display', 'none');
    });

    // Modal de nova senha
    $('.modal-content-nova-senha').on('click', function(e) {
        if (!window.descricaoAtiva) {
            return;
        }
        e.stopPropagation();
    });

    function fecharModalNovaSenha() {
        const numeroSenha = $('#hidden-nova-senha-numero').val();
        const descricao = $('#textarea-nova-senha-descricao').val().trim();

        if (numeroSenha && descricao) {
            console.log(`Salvando descrição para ${numeroSenha}`);
            atualizarDescricao(numeroSenha, descricao);
        }

        $('#modal-nova-senha').hide();
        $('body').css('overflow', 'auto');

        $('#hidden-nova-senha-numero').val('');
        $('#textarea-nova-senha-descricao').val('');
        $('#form-group-nova-senha').hide();
        window.descricaoAtiva = false;
    }

    $('#modal-nova-senha').on('click', fecharModalNovaSenha);

    $(document).on('keydown', function(e) {
        if (!$('#modal-nova-senha').is(':visible')) {
            return;
        }
        const isEnter = (e.which === 13 || e.key === "Enter");
        if (isEnter) {
            e.preventDefault();
            if (!window.descricaoAtiva) {
                window.descricaoAtiva = true;
                $('#form-group-nova-senha').slideDown(200);
                $('#textarea-nova-senha-descricao').focus();
            } else {
                fecharModalNovaSenha();
            }
        } else {
            if (!window.descricaoAtiva) {
                fecharModalNovaSenha();
            }
        }
    });

    // Modal de edição de descrição
    $('#btn-salvar-descricao').on('click', function() {
        const numeroSenha = $('#hidden-editar-senha-numero').val();
        const descricao = $('#textarea-editar-descricao').val().trim();
        if (numeroSenha) {
            atualizarDescricao(numeroSenha, descricao);
            $('#modal-editar-descricao').css('display', 'none');
        }
    });

    $('#btn-fechar-modal-editar').on('click', function() {
        $('#modal-editar-descricao').css('display', 'none');
    });

    // Modal de confirmação genérico
    $('#btn-confirmar-acao-cancelar').on('click', function() {
        $('#modal-confirmar-acao').css('display', 'none');
        window.acaoConfirmadaCallback = null;
    });

    $('#btn-confirmar-acao-confirmar').on('click', function() {
        if (typeof window.acaoConfirmadaCallback === 'function') {
            window.acaoConfirmadaCallback();
        }
        $('#modal-confirmar-acao').css('display', 'none');
        window.acaoConfirmadaCallback = null;
    });
}

function mostrarModalConfirmacao(titulo, texto, callback) {
    $('#modal-confirmar-titulo').text(titulo);
    $('#modal-confirmar-texto').html(texto);
    window.acaoConfirmadaCallback = callback;
    $('#modal-confirmar-acao').css('display', 'flex');
}
