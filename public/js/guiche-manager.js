// guiche-manager.js - Gerenciamento de guichês

function initializeGuicheManager() {
    // Adicionar novo guichê global
    $('#btn-add-guiche-global').on('click', function() {
        const novoNome = `Guichê ${String(window.guichesGlobais.length + 1).padStart(2, '0')}`;
        window.guichesGlobais.push({ nome: novoNome, ativo: true });
        renderizarGuichesGlobais();
        salvarGuichesGlobais();
    });

    // Excluir guichê global
    $('#guiche-global-list').on('click', '.btn-delete-guiche-global', function() {
        const index = parseInt($(this).data('index'), 10);
        if (!isNaN(index) && window.guichesGlobais[index]) {
            const nome = window.guichesGlobais[index].nome;
            mostrarModalConfirmacao(
                'Excluir Guichê Global',
                `Tem certeza que deseja excluir o guichê <strong>${nome}</strong> do sistema?<br><br>Esta ação não pode ser desfeita.`,
                function() {
                    window.guichesGlobais.splice(index, 1);
                    renderizarGuichesGlobais();
                    salvarGuichesGlobais();
                }
            );
        }
    });

    // Salvar automaticamente ao alterar nome
    $('#guiche-global-list').on('input', '.guiche-global-nome', function() {
        salvarGuichesGlobais();
    });

    // Salvar automaticamente ao alterar status ativo
    $('#guiche-global-list').on('change', '.guiche-global-ativo', function() {
        salvarGuichesGlobais();
    });

    // Salvar exibição de guichês (checkbox)
    $('#guiche-exibicao-list').on('change', 'input[type="checkbox"]', salvarExibicaoGuiches);

    // Inicialização
    renderizarGuichesExibicao();
    renderizarPaineisDeGuiche();
}

function renderizarGuichesExibicao() {
    const $guicheExibicaoList = $('#guiche-exibicao-list');
    $guicheExibicaoList.empty();

    const exibicaoSalva = sessionStorage.getItem('sgfGuichesExibicao');
    const guichesExibicao = exibicaoSalva ? JSON.parse(exibicaoSalva) : [];

    if (window.guichesGlobais.length === 0) {
        $guicheExibicaoList.html('<p style="color: #868e96;">Nenhum guichê global cadastrado. Adicione guichês na seção "Guichês (Global)".</p>');
        return;
    }

    window.guichesGlobais.forEach(guiche => {
        const estaSelecionado = guichesExibicao.includes(guiche.nome);
        $guicheExibicaoList.append(`
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" id="exibicao-${guiche.nome}" ${estaSelecionado ? 'checked' : ''} data-guiche-nome="${guiche.nome}" style="transform: scale(1.2);">
                <label for="exibicao-${guiche.nome}" style="margin-bottom: 0; font-weight: normal;">${guiche.nome} ${guiche.ativo ? '' : '(Inativo)'}</label>
            </div>
        `);
    });
}

function salvarExibicaoGuiches() {
    const guichesSelecionados = [];
    $('#guiche-exibicao-list input[type="checkbox"]:checked').each(function() {
        guichesSelecionados.push($(this).data('guiche-nome'));
    });

    sessionStorage.setItem('sgfGuichesExibicao', JSON.stringify(guichesSelecionados));
    renderizarPaineisDeGuiche();
}

function renderizarGuichesGlobais() {
    const $guicheGlobalList = $('#guiche-global-list');
    $guicheGlobalList.empty();

    if (window.guichesGlobais.length === 0) {
        $guicheGlobalList.html('<p style="color: #868e96;">Nenhum guichê global cadastrado. Clique em "Adicionar Guichê".</p>');
    }

    window.guichesGlobais.forEach((guiche, index) => {
        const checked = guiche.ativo ? 'checked' : '';
        const nomeEscapado = $('<div />').text(guiche.nome).html();

        $guicheGlobalList.append(`
            <div style="display: flex; gap: 10px; align-items: center; background: #f8f9fa; padding: 10px; border-radius: 6px;">
                <input type="text" class="guiche-global-nome" data-index="${index}" value="${nomeEscapado}" placeholder="Nome do Guichê" style="flex-grow: 1; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                <input type="checkbox" class="guiche-global-ativo" data-index="${index}" id="guiche-ativo-${index}" ${checked} style="transform: scale(1.2); cursor: pointer;">
                <label for="guiche-ativo-${index}" style="margin-bottom: 0; font-weight: normal; cursor: pointer;">Ativo</label>
                <button class="btn-acao-senha btn-acao-excluir btn-delete-guiche-global" data-index="${index}" title="Excluir Guichê">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `);
    });

    renderizarGuichesExibicao();
}

function salvarGuichesGlobais() {
    const novosGuiches = [];
    $('.guiche-global-nome').each(function() {
        const index = parseInt($(this).data('index'), 10);
        const nome = $(this).val().trim();
        const ativo = $(`#guiche-ativo-${index}`).is(':checked');

        if (nome && !isNaN(index)) {
            novosGuiches[index] = { nome: nome, ativo: ativo };
        }
    });

    const guichesFinais = novosGuiches.filter(g => g !== undefined);

    window.guichesGlobais = guichesFinais;
    atualizarGuichesGlobais(guichesFinais);
}
