// event-handlers.js - Gerenciamento de eventos de botões e ações

window.initializeEventHandlers = function initializeEventHandlers() {
    // Botões de emissão de senha
    $('#btn-prioridade').on('click', function() {
        emitirSenha('prioridade', '');
        $(this).blur();
    });

    $('#btn-normal').on('click', function() {
        emitirSenha('normal');
        $(this).blur();
    });

    $('#btn-contratual').on('click', function() {
        emitirSenha('contratual');
        $(this).blur();
    });

    // Botão de reiniciar sistema
    $('#btn-reiniciar').on('click', function() {
        $('#modal-reiniciar').css('display', 'flex');
    });

    // Click handler para painéis de guichê dinâmicos
    $('#guiche-control-panels').on('click', '.senha-atual-guiche', function() {
        const $this = $(this);
        const guicheId = $this.data('guiche-id');
        const estaOcupado = !$this.find('.senha-numero').hasClass('vazio');

        if (!guicheId) return;

        if (estaOcupado) {
            console.log(`Finalizando atendimento no ${guicheId}`);
            finalizarAtendimento(guicheId);
        } else {
            console.log(`Solicitando próxima senha para ${guicheId}`);
            chamarSenha(guicheId);
        }
    });

    // Atualização de proporções
    $('#input-ratio').on('change', function() {
        const novaProporcao = parseInt($(this).val(), 10);
        if (!isNaN(novaProporcao) && novaProporcao >= 1) {
            atualizarProporcao(novaProporcao);
        } else {
            $(this).val(1);
            atualizarProporcao(1);
        }
    });

    $('#input-ratio-contratual').on('change', function() {
        const novaProporcao = parseInt($(this).val(), 10);
        if (!isNaN(novaProporcao) && novaProporcao >= 1) {
            atualizarProporcaoContratual(novaProporcao);
        } else {
            $(this).val(1);
            atualizarProporcaoContratual(1);
        }
    });

    // Event listeners para botões de ação na fila de espera
    $('#lista-espera, #historico-atendimentos').on('click', '.btn-acao-chamar', function() {
        const exibicaoSalva = sessionStorage.getItem('sgfGuichesExibicao');
        const meusGuiches = exibicaoSalva ? JSON.parse(exibicaoSalva) : [];

        if (meusGuiches.length === 0) {
            mostrarModalConfirmacao('Erro', 'Nenhum guichê está configurado para exibição nesta aba. Vá para Configurações > Guichês.', () => {});
            return;
        }

        const atendimentos = (window.estadoLocal && window.estadoLocal.atendimentosAtuais) ? window.estadoLocal.atendimentosAtuais : {};
        const guicheLivre = meusGuiches.find(nome => !atendimentos[nome]);

        if (!guicheLivre) {
            mostrarModalConfirmacao('Atenção', 'Todos os seus guichês de exibição estão ocupados. Finalize um atendimento antes de chamar uma senha manualmente.', () => {});
            return;
        }

        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;

        console.log(`Solicitando chamada manual de ${numeroSenha} para ${guicheLivre}`);
        chamarSenhaEspecifica(guicheLivre, numeroSenha);
    });

    $('#lista-espera, #historico-atendimentos').on('click', '.btn-acao-excluir', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;
        mostrarModalConfirmacao(
            'Excluir Senha',
            `Tem certeza que deseja excluir a senha <strong>${numeroSenha}</strong> da fila?`,
            function() {
                excluirSenha(numeroSenha);
            }
        );
    });

    $('#lista-espera, #historico-atendimentos').on('click', '.btn-acao-info', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;

        $('.tab-link[data-tab="tab-stats"]').trigger('click');
        $('.sub-tab-link[data-sub-tab="sub-tab-ticket"]').trigger('click');

        window.ticketInfoSendoExibido = numeroSenha;
        renderizarDetalhesDoTicket(numeroSenha);
    });

    $('#lista-espera, #historico-atendimentos').on('click', '.btn-acao-editar', function() {
        const numeroSenha = $(this).data('senha-numero');
        const senhas = (window.estadoLocal && window.estadoLocal.senhas) ? window.estadoLocal.senhas : [];
        const senha = senhas.find(s => s.numero === numeroSenha);
        if (senha) {
            $('#modal-editar-titulo').text(`Editar Descrição (${senha.numero})`);
            $('#hidden-editar-senha-numero').val(senha.numero);
            $('#textarea-editar-descricao').val(senha.descricao || '');
            $('#modal-editar-descricao').css('display', 'flex');
        }
    });

    // Event listeners para atendimentos atuais
    $('#lista-atendimentos-atuais').on('click', '.btn-acao-devolver', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;

        mostrarModalConfirmacao(
            'Devolver à Fila',
            `Tem certeza que deseja devolver a senha <strong>${numeroSenha}</strong> para a fila de espera?`,
            function() {
                devolverSenha(numeroSenha);
            }
        );
    });

    $('#lista-atendimentos-atuais').on('click', '.btn-excluir-atendimento', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;
        const texto = `Tem certeza que deseja marcar a senha <strong>${numeroSenha}</strong> como NÃO-COMPARECEU?<br><br>Esta ação irá removê-la do atendimento e das estatísticas, mas manterá o total de senhas emitidas.`;
        mostrarModalConfirmacao(
            'Confirmar Não-Comparecimento',
            texto,
            function() {
                excluirAtendimento(numeroSenha);
            }
        );
    });

    $('#lista-atendimentos-atuais').on('click', '.btn-acao-info', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;

        $('.tab-link[data-tab="tab-stats"]').trigger('click');
        $('.sub-tab-link[data-sub-tab="sub-tab-ticket"]').trigger('click');

        window.ticketInfoSendoExibido = numeroSenha;
        renderizarDetalhesDoTicket(numeroSenha);
    });

    // Event listeners para aba de estatísticas
    $('#tab-stats').on('click', '.btn-excluir-atendimento', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;
        const senha = window.estadoLocal.senhas.find(s => s.numero === numeroSenha);
        const texto = `Tem certeza que deseja marcar a senha <strong>${numeroSenha}</strong> como NÃO-COMPARECEU?<br><br>Esta ação irá removê-la da fila/atendimento.`;

        if (senha && (senha.status === 'espera' || senha.status === 'chamada')) {
            mostrarModalConfirmacao(
                'Confirmar Não-Comparecimento',
                texto,
                function() {
                    excluirAtendimento(numeroSenha);
                }
            );
        }
    });

    $('#tab-stats').on('click', '.btn-acao-chamar', function() {
        const exibicaoSalva = sessionStorage.getItem('sgfGuichesExibicao');
        const meusGuiches = exibicaoSalva ? JSON.parse(exibicaoSalva) : [];

        if (meusGuiches.length === 0) {
            mostrarModalConfirmacao('Erro', 'Nenhum guichê está configurado para exibição nesta aba. Vá para Configurações > Guichês.', () => {});
            return;
        }
        const atendimentos = (window.estadoLocal && window.estadoLocal.atendimentosAtuais) ? window.estadoLocal.atendimentosAtuais : {};
        const guicheLivre = meusGuiches.find(nome => !atendimentos[nome]);

        if (!guicheLivre) {
            mostrarModalConfirmacao('Atenção', 'Todos os seus guichês de exibição estão ocupados. Finalize um atendimento antes de chamar uma senha manualmente.', () => {});
            return;
        }
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;

        console.log(`Solicitando chamada manual de ${numeroSenha} para ${guicheLivre}`);
        chamarSenhaEspecifica(guicheLivre, numeroSenha);
    });

    $('#tab-stats').on('click', '.btn-acao-excluir', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;
        mostrarModalConfirmacao(
            'Excluir Senha',
            `Tem certeza que deseja excluir a senha <strong>${numeroSenha}</strong> da fila?`,
            function() {
                excluirSenha(numeroSenha);
            }
        );
    });

    $('#tab-stats').on('click', '.btn-acao-editar', function() {
        const numeroSenha = $(this).data('senha-numero');
        const senhas = (window.estadoLocal && window.estadoLocal.senhas) ? window.estadoLocal.senhas : [];
        const senha = senhas.find(s => s.numero === numeroSenha);
        if (senha) {
            $('#modal-editar-titulo').text(`Editar Descrição (${senha.numero})`);
            $('#hidden-editar-senha-numero').val(senha.numero);
            $('#textarea-editar-descricao').val(senha.descricao || '');
            $('#modal-editar-descricao').css('display', 'flex');
        }
    });

    $('#tab-stats').on('click', '.btn-acao-devolver', function() {
        const numeroSenha = $(this).data('senha-numero');
        if (!numeroSenha) return;

        mostrarModalConfirmacao(
            'Devolver à Fila',
            `Tem certeza que deseja devolver a senha <strong>${numeroSenha}</strong> para a fila de espera?`,
            function() {
                devolverSenha(numeroSenha);
            }
        );
    });
}
