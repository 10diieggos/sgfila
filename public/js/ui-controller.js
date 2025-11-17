/**
 * UI Controller Module - SGFILA (Sistema de Gerenciamento de Fila)
 *
 * Handles all UI rendering functions for queue management interface:
 * - Queue display rendering
 * - Counter panel rendering
 * - Ticket details rendering
 * - Statistics rendering
 * - Counter configuration rendering
 *
 * Dependencies: jQuery, Bootstrap (implied by HTML structure)
 *
 * Usage:
 * Call the initialization function with required DOM elements and state references
 * All rendering functions are made available through the returned UI controller object
 */

// UI Controller Module - Organizational wrapper for all rendering functions
const UIController = (function() {
    'use strict';

    // ========================================
    // STATE AND CONFIGURATION VARIABLES
    // ========================================
    // These will be injected during initialization
    let estadoLocal = {};
    let estatisticasLocais = {};
    let guichesGlobais = [];
    let filtroAtivo = 'emissao'; // 'emissao', 'automatica', 'tipo'
    let termoBusca = '';
    let ticketInfoSendoExibido = null;

    // Helper for sorting by type
    const tipoValor = { 'prioridade': 1, 'contratual': 2, 'normal': 3 };

    // ========================================
    // DOM ELEMENT REFERENCES
    // ========================================
    // Queue and attendance lists
    let $listaEspera;
    let $listaAtendimentosAtuais;
    let $historicoAtendimentos;

    // Statistics elements
    let $totalSenhas;
    let $senhasAtendidas;
    let $tempoMedio;
    let $proximaSenha;
    let $statsPorTipo;
    let $statsPorGuiche;
    let $totalNaoCompareceu;
    let $totalExcluidas;
    let $tabStats;

    // Counter control panels
    let $guicheControlPanels;

    // Counter configuration elements
    let $guicheGlobalList;
    let $guicheExibicaoList;
    let $btnAddGuicheGlobal;

    // Modals
    let $modalReiniciar;
    let $modalNovaSenha;
    let $modalEditarDescricao;
    let $modalConfirmarAcao;
    let $modalConfirmarTitulo;
    let $modalConfirmarTexto;

    // Input fields
    let $inputRatio;
    let $inputRatioContratual;

    // ========================================
    // INITIALIZATION FUNCTION
    // ========================================
    /**
     * Initialize UI Controller with DOM references and state
     * @param {Object} config - Configuration object containing:
     *   - estado: Local state object reference
     *   - estatisticas: Local statistics object reference
     *   - guiches: Global counters array reference
     *   - filtro: Current filter state reference
     *   - termo: Current search term reference
     *   - ticketExibido: Current displayed ticket number reference
     *   And jQuery element selectors for all UI components
     */
    function initializeUI(config) {
        // Inject state references
        if (config.estado) estadoLocal = config.estado;
        if (config.estatisticas) estatisticasLocais = config.estatisticas;
        if (config.guiches) guichesGlobais = config.guiches;
        if (config.filtro !== undefined) filtroAtivo = config.filtro;
        if (config.termo !== undefined) termoBusca = config.termo;
        if (config.ticketExibido !== undefined) ticketInfoSendoExibido = config.ticketExibido;

        // Initialize DOM element references
        $listaEspera = config.$listaEspera || $('#lista-espera');
        $listaAtendimentosAtuais = config.$listaAtendimentosAtuais || $('#lista-atendimentos-atuais');
        $historicoAtendimentos = config.$historicoAtendimentos || $('#historico-atendimentos');

        $totalSenhas = config.$totalSenhas || $('#total-senhas');
        $senhasAtendidas = config.$senhasAtendidas || $('#senhas-atendidas');
        $tempoMedio = config.$tempoMedio || $('#tempo-medio');
        $proximaSenha = config.$proximaSenha || $('#proxima-senha');
        $statsPorTipo = config.$statsPorTipo || $('#stats-por-tipo');
        $statsPorGuiche = config.$statsPorGuiche || $('#stats-por-guiche');
        $totalNaoCompareceu = config.$totalNaoCompareceu || $('#total-nao-compareceu');
        $totalExcluidas = config.$totalExcluidas || $('#total-excluidas');
        $tabStats = config.$tabStats || $('#tab-stats');

        $guicheControlPanels = config.$guicheControlPanels || $('#guiche-control-panels');

        $guicheGlobalList = config.$guicheGlobalList || $('#guiche-global-list');
        $guicheExibicaoList = config.$guicheExibicaoList || $('#guiche-exibicao-list');
        $btnAddGuicheGlobal = config.$btnAddGuicheGlobal || $('#btn-add-guiche-global');

        $modalReiniciar = config.$modalReiniciar || $('#modal-reiniciar');
        $modalNovaSenha = config.$modalNovaSenha || $('#modal-nova-senha');
        $modalEditarDescricao = config.$modalEditarDescricao || $('#modal-editar-descricao');
        $modalConfirmarAcao = config.$modalConfirmarAcao || $('#modal-confirmar-acao');
        $modalConfirmarTitulo = config.$modalConfirmarTitulo || $('#modal-confirmar-titulo');
        $modalConfirmarTexto = config.$modalConfirmarTexto || $('#modal-confirmar-texto');

        $inputRatio = config.$inputRatio || $('#input-ratio');
        $inputRatioContratual = config.$inputRatioContratual || $('#input-ratio-contratual');
    }

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    /**
     * Calculate waiting time in minutes from a timestamp
     * @param {number} timestamp - Milliseconds timestamp
     * @returns {number} Minutes of wait time
     */
    function calcularTempoEspera(timestamp) {
        const agora = new Date().getTime();
        return Math.round((agora - timestamp) / 60000);
    }

    /**
     * Format milliseconds to human-readable time string
     * @param {number} milissegundos - Time in milliseconds
     * @returns {string} Formatted time (e.g., "15 min", "< 1 min", "0 min")
     */
    function formatarTempo(milissegundos) {
        if (isNaN(milissegundos) || milissegundos === 0 || !isFinite(milissegundos)) {
            return '0 min';
        }
        if (milissegundos < 60000) return "< 1 min";
        const minutos = Math.round(milissegundos / 60000);
        return `${minutos} min`;
    }

    /**
     * Play audio beep notification
     * @param {number} times - Number of beeps (1 or 2)
     */
    function beep(times = 1) {
        try {
            for (let i = 0; i < times; i++) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.value = times === 1 ? 800 : 1000;
                gainNode.gain.value = 0.1;

                oscillator.start();
                setTimeout(() => {
                    oscillator.stop();
                }, 200);
            }
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    // ========================================
    // COUNTER MANAGEMENT FUNCTIONS
    // ========================================

    /**
     * Render counter display configuration checkboxes
     * Allows users to select which counters to display on their tab
     */
    function renderizarGuichesExibicao() {
        $guicheExibicaoList.empty();

        const exibicaoSalva = sessionStorage.getItem('sgfGuichesExibicao');
        const guichesExibicao = exibicaoSalva ? JSON.parse(exibicaoSalva) : [];

        if (guichesGlobais.length === 0) {
            $guicheExibicaoList.html('<p style="color: #868e96;">No global counters configured. Add counters in the "Counters (Global)" section.</p>');
            return;
        }

        guichesGlobais.forEach(guiche => {
            const estaSelecionado = guichesExibicao.includes(guiche.nome);
            $guicheExibicaoList.append(`
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="exibicao-${guiche.nome}" ${estaSelecionado ? 'checked' : ''} data-guiche-nome="${guiche.nome}" style="transform: scale(1.2);">
                    <label for="exibicao-${guiche.nome}" style="margin-bottom: 0; font-weight: normal;">${guiche.nome} ${guiche.ativo ? '' : '(Inactive)'}</label>
                </div>
            `);
        });
    }

    /**
     * Save selected counter display configuration to sessionStorage
     * Triggers re-rendering of counter control panels
     */
    function salvarExibicaoGuiches() {
        const guichesSelecionados = [];
        $('#guiche-exibicao-list input[type="checkbox"]:checked').each(function() {
            guichesSelecionados.push($(this).data('guiche-nome'));
        });

        sessionStorage.setItem('sgfGuichesExibicao', JSON.stringify(guichesSelecionados));
        renderizarPaineisDeGuiche();
    }

    /**
     * Render global counter configuration list
     * Allows management of all counters in the system (add/edit/delete)
     */
    function renderizarGuichesGlobais() {
        $guicheGlobalList.empty();
        if (guichesGlobais.length === 0) {
            $guicheGlobalList.html('<p style="color: #868e96;">No global counters configured. Click "Add Counter".</p>');
        }

        guichesGlobais.forEach((guiche, index) => {
            const checked = guiche.ativo ? 'checked' : '';
            const nomeEscapado = $('<div />').text(guiche.nome).html();

            $guicheGlobalList.append(`
                <div style="display: flex; gap: 10px; align-items: center; background: #f8f9fa; padding: 10px; border-radius: 6px;">
                    <input type="text" class="guiche-global-nome" data-index="${index}" value="${nomeEscapado}" placeholder="Counter Name" style="flex-grow: 1; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                    <input type="checkbox" class="guiche-global-ativo" data-index="${index}" id="guiche-ativo-${index}" ${checked} style="transform: scale(1.2); cursor: pointer;">
                    <label for="guiche-ativo-${index}" style="margin-bottom: 0; font-weight: normal; cursor: pointer;">Active</label>
                    <button class="btn-acao-senha btn-acao-excluir btn-delete-guiche-global" data-index="${index}" title="Delete Counter">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `);
        });

        renderizarGuichesExibicao();
    }

    /**
     * Save global counter configuration to server
     * Called automatically on any changes to counter list
     */
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
        guichesGlobais = guichesFinais;

        // Emit to server (requires socket.io reference)
        if (window.socket) {
            window.socket.emit('atualizarGuichesGlobais', guichesFinais);
        }
    }

    // ========================================
    // MAIN RENDERING FUNCTIONS
    // ========================================

    /**
     * Render counter control panels
     * Displays clickable panels for each selected counter showing current ticket being served
     * Lines ~1453-1494 of original index.html
     */
    function renderizarPaineisDeGuiche() {
        $guicheControlPanels.empty();

        const exibicaoSalva = sessionStorage.getItem('sgfGuichesExibicao');
        const guichesParaExibir = exibicaoSalva ? JSON.parse(exibicaoSalva) : [];

        const atendimentos = (estadoLocal && estadoLocal.atendimentosAtuais) ? estadoLocal.atendimentosAtuais : {};

        if (guichesParaExibir.length === 0) {
            $guicheControlPanels.html('<div class="alert">No counters selected for display. Go to Settings > Counters.</div>');
            return;
        }

        guichesParaExibir.forEach(nomeGuiche => {
            const atendimento = atendimentos[nomeGuiche];

            const isOcupado = !!atendimento;
            const numeroSenha = isOcupado ? atendimento.numero : '---';
            let classeTipo = '';

            if(atendimento) {
                if (atendimento.tipo === 'prioridade') classeTipo = 'prioridade';
                else if (atendimento.tipo === 'contratual') classeTipo = 'contratual';
                else classeTipo = 'normal';
            }

            const numeroHtml = isOcupado
                ? `<span class="senha-numero">${numeroSenha}</span>`
                : `<span class="senha-numero vazio">---</span>`;

            $guicheControlPanels.append(`
                <div class="guiche-painel">
                    <div class="senha-atual-guiche ${classeTipo}" data-guiche-id="${nomeGuiche}">
                        <span class="guiche-painel-nome">${nomeGuiche}</span>
                        ${numeroHtml}
                    </div>
                </div>
            `);
        });
    }

    /**
     * Render waiting queue list
     * Displays all tickets in waiting status with filtering and sorting options
     * Lines ~2209-2367 of original index.html
     */
    function renderizarFilaDeEspera() {
        if (!estadoLocal.senhas) {
            $listaEspera.empty().append('<div class="senha-item">No tickets in queue</div>');
            return;
        }

        let senhasEspera = estadoLocal.senhas.filter(s => s.status === 'espera');

        // 1. Apply search filter
        if (termoBusca) {
            senhasEspera = senhasEspera.filter(s =>
                s.descricao && s.descricao.toLowerCase().includes(termoBusca)
            );
        }

        // 2. Apply sorting filter
        switch (filtroAtivo) {
            case 'emissao':
                // Default: Arrival order (timestamp)
                senhasEspera.sort((a, b) => a.timestamp - b.timestamp);
                break;

            case 'automatica':
                // Simulate server's automatic calling algorithm
                const filaSimulada = [];
                let simFilaEspera = [...senhasEspera].sort((a, b) => a.timestamp - b.timestamp);
                let simContadorP = estadoLocal.contadorPrioridadeDesdeUltimaNormal || 0;
                let simContadorC = estadoLocal.contadorContratualDesdeUltimaNormal || 0;
                const proporcaoP = estadoLocal.proporcaoPrioridade || 2;
                const proporcaoC = estadoLocal.proporcaoContratual || 1;

                while (simFilaEspera.length > 0) {
                    const prioritariaMaisAntiga = simFilaEspera.find(s => s.tipo === 'prioridade');
                    const contratualMaisAntiga = simFilaEspera.find(s => s.tipo === 'contratual');
                    const normalMaisAntiga = simFilaEspera.find(s => s.tipo === 'normal');

                    let proximaSimulada = null;

                    if (prioritariaMaisAntiga && simContadorP < proporcaoP) {
                        proximaSimulada = prioritariaMaisAntiga;
                        simContadorP++;
                    }
                    else if (contratualMaisAntiga && simContadorC < proporcaoC) {
                        proximaSimulada = contratualMaisAntiga;
                        simContadorC++;
                    }
                    else if (normalMaisAntiga) {
                        proximaSimulada = normalMaisAntiga;
                        simContadorP = 0;
                        simContadorC = 0;
                    }
                    else if (prioritariaMaisAntiga) {
                        proximaSimulada = prioritariaMaisAntiga;
                        simContadorP++;
                    }
                    else if (contratualMaisAntiga) {
                        proximaSimulada = contratualMaisAntiga;
                        simContadorC++;
                    }

                    if (proximaSimulada) {
                        filaSimulada.push(proximaSimulada);
                        simFilaEspera = simFilaEspera.filter(s => s.numero !== proximaSimulada.numero);
                    } else {
                        break;
                    }
                }

                senhasEspera = filaSimulada;
                break;

            case 'tipo':
                // Group by type (Priority > Contractual > Normal) then by arrival
                senhasEspera.sort((a, b) => {
                    if (tipoValor[a.tipo] !== tipoValor[b.tipo]) {
                        return tipoValor[a.tipo] - tipoValor[b.tipo];
                    }
                    return a.timestamp - b.timestamp;
                });
                break;
        }

        // 3. Render to DOM
        $listaEspera.empty();
        if (senhasEspera.length > 0) {
            senhasEspera.forEach(senha => {
                let classe, icone;

                if (senha.tipo === 'prioridade') {
                    classe = 'prioridade';
                    icone = 'fas fa-wheelchair';
                } else if (senha.tipo === 'contratual') {
                    classe = 'contratual';
                    icone = 'fas fa-file-contract';
                } else {
                    classe = 'normal';
                    icone = 'fas fa-user';
                }

                let descricaoHtml = '';
                if (senha.descricao) {
                    const descricaoEscapada = $('<div />').text(senha.descricao).html().replace(/\n/g, '<br>');
                    descricaoHtml = `<div class="senha-item-descricao">${descricaoEscapada}</div>`;
                }

                $listaEspera.append(`
                    <div class="senha-item ${classe}" data-senha-numero="${senha.numero}">
                        <div>
                            <i class="${icone}"></i>
                            <strong>${senha.numero}</strong>
                            ${descricaoHtml}
                        </div>

                        <div class="senha-item-controles">
                            <span>${calcularTempoEspera(senha.timestamp)} min</span>
                            <div class="botoes-wrapper">
                                <button class="btn-acao-senha btn-acao-info" data-senha-numero="${senha.numero}" title="View Details">
                                    <i class="fas fa-info-circle"></i>
                                </button>
                                <button class="btn-acao-senha btn-acao-chamar" data-senha-numero="${senha.numero}" title="Call this ticket">
                                    <i class="fas fa-bullhorn"></i>
                                </button>
                                <button class="btn-acao-senha btn-acao-editar" data-senha-numero="${senha.numero}" title="Edit Description">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-acao-senha btn-acao-excluir" data-senha-numero="${senha.numero}" title="Delete this ticket">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `);
            });
        } else {
            if (termoBusca) {
                $listaEspera.append('<div class="senha-item">No tickets found with that description.</div>');
            } else {
                $listaEspera.append('<div class="senha-item">No tickets in queue</div>');
            }
        }
    }

    /**
     * Render ticket detail panel
     * Displays comprehensive information about a specific ticket including:
     * - Ticket number and type
     * - Current status and position in queue
     * - Wait time and service time estimates
     * - Relevant action buttons
     * Lines ~1778-1995 of original index.html
     */
    function renderizarDetalhesDoTicket(numeroSenha) {
        const senhas = (estadoLocal && estadoLocal.senhas) ? estadoLocal.senhas : [];
        const senha = senhas.find(s => s.numero === numeroSenha);
        const stats = estatisticasLocais || {};

        const $content = $('#ticket-info-content');

        if (senha) {
            $content.empty();

            // Calculate "People in front" logic
            let posicao = -1;
            let pessoasNaFrente = 'N/A';

            if (senha.status === 'espera') {
                const senhasEspera = (estadoLocal.senhas || []).filter(s => s.status === 'espera');

                const filaSimulada = [];
                let simFilaEspera = [...senhasEspera].sort((a, b) => a.timestamp - b.timestamp);
                let simContadorP = estadoLocal.contadorPrioridadeDesdeUltimaNormal || 0;
                let simContadorC = estadoLocal.contadorContratualDesdeUltimaNormal || 0;
                const proporcaoP = estadoLocal.proporcaoPrioridade || 2;
                const proporcaoC = estadoLocal.proporcaoContratual || 1;

                while (simFilaEspera.length > 0) {
                    const prioritariaMaisAntiga = simFilaEspera.find(s => s.tipo === 'prioridade');
                    const contratualMaisAntiga = simFilaEspera.find(s => s.tipo === 'contratual');
                    const normalMaisAntiga = simFilaEspera.find(s => s.tipo === 'normal');
                    let proximaSimulada = null;

                    if (prioritariaMaisAntiga && simContadorP < proporcaoP) {
                        proximaSimulada = prioritariaMaisAntiga;
                        simContadorP++;
                    }
                    else if (contratualMaisAntiga && simContadorC < proporcaoC) {
                        proximaSimulada = contratualMaisAntiga;
                        simContadorC++;
                    }
                    else if (normalMaisAntiga) {
                        proximaSimulada = normalMaisAntiga;
                        simContadorP = 0;
                        simContadorC = 0;
                    }
                    else if (prioritariaMaisAntiga) {
                        proximaSimulada = prioritariaMaisAntiga;
                        simContadorP++;
                    }
                    else if (contratualMaisAntiga) {
                        proximaSimulada = contratualMaisAntiga;
                        simContadorC++;
                    }

                    if (proximaSimulada) {
                        filaSimulada.push(proximaSimulada);
                        simFilaEspera = simFilaEspera.filter(s => s.numero !== proximaSimulada.numero);
                    } else {
                        break;
                    }
                }

                posicao = filaSimulada.findIndex(s => s.numero === numeroSenha);
                pessoasNaFrente = (posicao !== -1) ? `${posicao} people in front` : 'N/A';
            }

            // Calculate wait time estimate
            let estimativaMs = 0;
            let tmaDefault = stats.tempoMedioAtendimentoGeralMs || 300000;
            if (tmaDefault === 0) tmaDefault = 300000;

            const tmaPorTipo = {
                'prioridade': (stats.detalhesPorTipo && stats.detalhesPorTipo.prioridade.tempoMedioAtendimentoMs) ? stats.detalhesPorTipo.prioridade.tempoMedioAtendimentoMs : tmaDefault,
                'contratual': (stats.detalhesPorTipo && stats.detalhesPorTipo.contratual.tempoMedioAtendimentoMs) ? stats.detalhesPorTipo.contratual.tempoMedioAtendimentoMs : tmaDefault,
                'normal': (stats.detalhesPorTipo && stats.detalhesPorTipo.normal.tempoMedioAtendimentoMs) ? stats.detalhesPorTipo.normal.tempoMedioAtendimentoMs : tmaDefault
            };

            if (tmaPorTipo.prioridade === 0) tmaPorTipo.prioridade = tmaDefault;
            if (tmaPorTipo.contratual === 0) tmaPorTipo.contratual = tmaDefault;
            if (tmaPorTipo.normal === 0) tmaPorTipo.normal = tmaDefault;

            const guichesAtivos = stats.guichesAtivos || 1;

            if (posicao > 0) {
                for (let i = 0; i < posicao; i++) {
                    const pessoaNaFrente = filaSimulada[i];
                    estimativaMs += tmaPorTipo[pessoaNaFrente.tipo];
                }
            }

            const estimativaFinalMs = (posicao >= 0) ? (estimativaMs / guichesAtivos) : 0;

            const agoraMs = new Date().getTime();
            const etaMs = (estimativaFinalMs > 0) ? (agoraMs + estimativaFinalMs) : agoraMs;
            const etaFormatada = (estimativaFinalMs > 0 && isFinite(etaMs)) ? new Date(etaMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---';
            const estimativaFormatada = formatarTempo(estimativaFinalMs);

            const tempoEsperaAtual = (senha.status === 'espera') ? calcularTempoEspera(senha.timestamp) : (senha.tempoEspera > 0 ? formatarTempo(senha.tempoEspera) : '0 min');
            const tipo = senha.tipo.charAt(0).toUpperCase() + senha.tipo.slice(1);
            const descricao = (senha.descricao || 'N/A').replace(/\n/g, '<br>');

            const tsEmissao = new Date(senha.timestamp).toLocaleTimeString();
            const tsChamada = senha.chamadaTimestamp ? new Date(senha.chamadaTimestamp).toLocaleTimeString() : '---';
            const tsFinalizado = senha.finalizadoTimestamp ? new Date(senha.finalizadoTimestamp).toLocaleTimeString() : '---';

            let botoesHTML = `
                <button class="btn-acao-senha btn-acao-editar" data-senha-numero="${senha.numero}" title="Edit Description" style="padding: 5px 10px; font-size: 0.9rem;">
                    <i class="fas fa-edit"></i> Edit
                </button>
            `;

            if (senha.status === 'chamada') {
                botoesHTML += `
                    <button class="btn-acao-senha btn-acao-devolver" data-senha-numero="${senha.numero}" title="Return to Queue" style="padding: 5px 10px; font-size: 0.9rem;">
                        <i class="fas fa-undo"></i> Return
                    </button>
                    <button class="btn-acao-senha btn-acao-excluir btn-excluir-atendimento" data-senha-numero="${senha.numero}" title="Mark as No-Show" style="padding: 5px 10px; font-size: 0.9rem;">
                        <i class="fas fa-user-slash"></i> Absent
                    </button>
                `;
            } else if (senha.status === 'espera') {
                botoesHTML += `
                    <button class="btn-acao-senha btn-acao-chamar" data-senha-numero="${senha.numero}" title="Call this ticket" style="padding: 5px 10px; font-size: 0.9rem;">
                        <i class="fas fa-bullhorn"></i> Call
                    </button>
                    <button class="btn-acao-senha btn-acao-excluir btn-excluir-atendimento" data-senha-numero="${senha.numero}" title="Mark as No-Show" style="padding: 5px 10px; font-size: 0.9rem;">
                        <i class="fas fa-user-slash"></i> Absent
                    </button>
                    <button class="btn-acao-senha btn-acao-excluir" data-senha-numero="${senha.numero}" title="Delete this ticket" style="padding: 5px 10px; font-size: 0.9rem;">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                `;
            }

            const statusFormatado = {
                'espera': 'In Queue',
                'chamada': 'In Service',
                'atendida': 'Completed',
                'nao_compareceu': 'No-Show',
                'excluida': 'Deleted'
            };

            $content.append(`
                <div class="stat-item">
                    <span>Number:</span>
                    <strong>${senha.numero}</strong>
                </div>
                <div class="stat-item">
                    <span>Type:</span>
                    <span>${tipo}</span>
                </div>
                <div class="stat-item">
                    <span>Status:</span>
                    <span>${statusFormatado[senha.status] || senha.status}</span>
                </div>
                <div class="stat-item">
                    <span>Position (Automatic):</span>
                    <span><strong>${pessoasNaFrente}</strong></span>
                </div>
                <div class="stat-item">
                    <span>Wait Time:</span>
                    <span>${senha.status === 'espera' ? `~ ${tempoEsperaAtual} min` : tempoEsperaAtual}</span>
                </div>
                <div class="stat-item">
                    <span>Service Estimate:</span>
                    <span title="Estimate based on average service time of people ahead and number of active counters."><strong>${senha.status === 'espera' ? `~ ${estimativaFormatada}` : '---'}</strong></span>
                </div>

                <div class="stat-item">
                    <span>Estimated Time:</span>
                    <span title="Estimated start time of service."><strong>${senha.status === 'espera' ? `~ ${etaFormatada}` : '---'}</strong></span>
                </div>
                <div class="stat-item">
                    <span>Issued at:</span>
                    <span>${tsEmissao}</span>
                </div>
                <div class="stat-item">
                    <span>Called at:</span>
                    <span>${tsChamada}</span>
                </div>
                <div class="stat-item">
                    <span>Completed at:</span>
                    <span>${tsFinalizado}</span>
                </div>
                <div class="stat-item" style="flex-direction: column; align-items: flex-start;">
                    <span>Description:</span>
                    <span style="padding-top: 5px; color: #333; font-style: italic;">${descricao}</span>
                </div>

                <div class="botoes-wrapper" style="margin-top: 20px; justify-content: center; display: flex; gap: 10px;">
                    ${botoesHTML}
                </div>
            `);
        } else {
            ticketInfoSendoExibido = null;
            $content.html(`
                <p style="padding: 10px 0; color: #868e96;">
                    Ticket ${numeroSenha} is no longer in the queue or has already been served.
                </p>
            `);
        }
    }

    /**
     * Main UI update function
     * Orchestrates rendering of all UI components based on server state and statistics
     * Lines ~2370-2553 of original index.html
     * @param {Object} estatisticas - Statistics object from server
     */
    function atualizarInterface(estatisticas) {

        const senhas = (estadoLocal && estadoLocal.senhas) ? estadoLocal.senhas : [];
        const atendimentos = (estadoLocal && estadoLocal.atendimentosAtuais) ? estadoLocal.atendimentosAtuais : {};

        // 1. Render counter control panels
        renderizarPaineisDeGuiche();

        // 2. Render waiting queue
        renderizarFilaDeEspera();

        // 3. Render current service list
        $listaAtendimentosAtuais.empty();
        const senhasEmAtendimento = senhas.filter(s => s.status === 'chamada');

        if (senhasEmAtendimento.length > 0) {
            senhasEmAtendimento.forEach(senha => {
                let classe = 'normal';
                if (senha.tipo === 'prioridade') classe = 'prioridade';
                if (senha.tipo === 'contratual') classe = 'contratual';

                $listaAtendimentosAtuais.append(`
                    <div class="senha-item ${classe}">
                        <div>
                            <i class="fas fa-user-headset"></i>
                            <strong>${senha.numero}</strong>
                            <span style="font-weight: normal; margin-left: 10px; color: #555;">(${senha.guicheAtendendo})</span>
                        </div>

                        <div class="senha-item-controles">
                            <div class="botoes-wrapper">
                                <button class="btn-acao-senha btn-acao-info" data-senha-numero="${senha.numero}" title="View Details">
                                    <i class="fas fa-info-circle"></i>
                                </button>
                                <button class="btn-acao-senha btn-acao-devolver" data-senha-numero="${senha.numero}" title="Return to Queue">
                                    <i class="fas fa-undo"></i>
                                </button>
                                <button class="btn-acao-senha btn-acao-excluir btn-excluir-atendimento" data-senha-numero="${senha.numero}" title="Mark No-Show">
                                    <i class="fas fa-user-slash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `);
            });
        } else {
            $listaAtendimentosAtuais.append('<div class="senha-item">No service in progress</div>');
        }

        // 4. Render service history
        const senhasAtendidas = senhas.filter(s => s.status === 'atendida');
        $historicoAtendimentos.empty();

        if (senhasAtendidas.length > 0) {
            const ultimasSenhas = senhasAtendidas.slice(-10).reverse();

            ultimasSenhas.forEach(senha => {
                let classe, icone;

                if (senha.tipo === 'prioridade') {
                    classe = 'prioridade';
                    icone = 'fas fa-wheelchair';
                } else if (senha.tipo === 'contratual') {
                    classe = 'contratual';
                    icone = 'fas fa-file-contract';
                } else {
                    classe = 'normal';
                    icone = 'fas fa-user';
                }

                let descricaoHtml = '';
                if (senha.descricao) {
                    const descricaoEscapada = $('<div />').text(senha.descricao).html().replace(/\n/g, '<br>');
                    descricaoHtml = `<div class="senha-item-descricao">${descricaoEscapada}</div>`;
                }

                const botoesHtml = `
                    <div class="botoes-wrapper">
                        <button class="btn-acao-senha btn-acao-info" data-senha-numero="${senha.numero}" title="View Details">
                            <i class="fas fa-info-circle"></i>
                        </button>
                        <button class="btn-acao-senha btn-acao-chamar" data-senha-numero="${senha.numero}" title="Call this ticket">
                            <i class="fas fa-bullhorn"></i>
                        </button>
                        <button class="btn-acao-senha btn-acao-editar" data-senha-numero="${senha.numero}" title="Edit Description">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-acao-senha btn-acao-excluir" data-senha-numero="${senha.numero}" title="Delete this ticket">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;

                const tempoAtendimentoFormatado = formatarTempo(senha.tempoAtendimento);
                const guicheQueAtendeu = senha.guicheAtendendo || 'Counter';

                $historicoAtendimentos.append(`
                    <div class="senha-item ${classe}" data-senha-numero="${senha.numero}">
                        <div>
                            <i class="${icone}"></i>
                            <strong>${senha.numero}</strong>
                            ${descricaoHtml}
                        </div>

                        <div class="senha-item-controles">
                            <span title="Served by ${guicheQueAtendeu} in ${tempoAtendimentoFormatado}">
                                ${tempoAtendimentoFormatado}
                            </span>
                            ${botoesHtml}
                        </div>
                    </div>
                `);
            });
        } else {
            $historicoAtendimentos.append('<div class="senha-item">No service history</div>');
        }

        // 5. Render statistics
        $totalSenhas.text(estatisticas.totalEmitidas || 0);
        $senhasAtendidas.text(estatisticas.totalAtendidas || 0);
        $tempoMedio.text(estatisticas.tempoMedioEsperaGeral || '0 min');
        $proximaSenha.text(estatisticas.proximaSenha || '---');

        $totalNaoCompareceu.text(estatisticas.totalNaoCompareceu || 0);
        $totalExcluidas.text(estatisticas.totalExcluidas || 0);

        // 6. Render statistics by type table
        $statsPorTipo.empty();
        const tipos = [
            { key: 'prioridade', nome: 'Priority' },
            { key: 'contratual', nome: 'Contractual' },
            { key: 'normal', nome: 'Normal' }
        ];

        tipos.forEach(tipo => {
            const dados = (estatisticas.detalhesPorTipo && estatisticas.detalhesPorTipo[tipo.key])
                        ? estatisticas.detalhesPorTipo[tipo.key]
                        : { emitidas: 0, atendidas: 0, tempoMedioEspera: '0 min', tempoMedioAtendimento: '0 min', maiorTempoEspera: '0 min', menorTempoEspera: '---' };

            $statsPorTipo.append(`
                <tr data-tipo="${tipo.key}">
                    <td>${tipo.nome}</td>
                    <td>${dados.emitidas}</td>
                    <td>${dados.atendidas}</td>
                    <td>${dados.tempoMedioEspera}</td>
                    <td>${dados.tempoMedioAtendimento}</td>
                    <td>${dados.maiorTempoEspera}</td>
                    <td>${dados.menorTempoEspera}</td>
                </tr>
            `);
        });

        // 7. Render counter performance
        $statsPorGuiche.empty();
        if (estatisticas.detalhesPorGuiche && Object.keys(estatisticas.detalhesPorGuiche).length > 0) {
            Object.keys(estatisticas.detalhesPorGuiche).sort().forEach(guicheNome => {
                const dados = estatisticas.detalhesPorGuiche[guicheNome];
                $statsPorGuiche.append(`
                    <div class="stat-item">
                        <span>${guicheNome}</span>
                        <span><strong>${dados.atendidas}</strong> served (AST: ${dados.tempoMedioAtendimento})</span>
                    </div>
                `);
            });
        } else {
            $statsPorGuiche.append('<div class="stat-item">No counter finished services.</div>');
        }

        // 8. Re-render ticket details if being displayed
        if (ticketInfoSendoExibido) {
            renderizarDetalhesDoTicket(ticketInfoSendoExibido);
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================
    return {
        // Initialization
        initialize: initializeUI,

        // State accessors and mutators
        setEstado: function(estado) { estadoLocal = estado; },
        getEstado: function() { return estadoLocal; },

        setEstatisticas: function(stats) { estatisticasLocais = stats; },
        getEstatisticas: function() { return estatisticasLocais; },

        setGuiches: function(guiches) { guichesGlobais = guiches; },
        getGuiches: function() { return guichesGlobais; },

        setFiltro: function(filtro) { filtroAtivo = filtro; },
        getFiltro: function() { return filtroAtivo; },

        setTermoBusca: function(termo) { termoBusca = termo; },
        getTermoBusca: function() { return termoBusca; },

        setTicketExibido: function(ticket) { ticketInfoSendoExibido = ticket; },
        getTicketExibido: function() { return ticketInfoSendoExibido; },

        // Main rendering functions
        atualizarInterface: atualizarInterface,
        renderizarFilaDeEspera: renderizarFilaDeEspera,
        renderizarPaineisDeGuiche: renderizarPaineisDeGuiche,
        renderizarDetalhesDoTicket: renderizarDetalhesDoTicket,

        // Counter management
        renderizarGuichesGlobais: renderizarGuichesGlobais,
        renderizarGuichesExibicao: renderizarGuichesExibicao,
        salvarGuichesGlobais: salvarGuichesGlobais,
        salvarExibicaoGuiches: salvarExibicaoGuiches,

        // Helper utilities
        calcularTempoEspera: calcularTempoEspera,
        formatarTempo: formatarTempo,
        beep: beep
    };
})();

// Expose UIController globally for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}

// Expose functions globally for backward compatibility
window.UIController = UIController;
window.atualizarInterface = UIController.atualizarInterface;
window.renderizarFilaDeEspera = UIController.renderizarFilaDeEspera;
window.renderizarPaineisDeGuiche = UIController.renderizarPaineisDeGuiche;
window.renderizarDetalhesDoTicket = UIController.renderizarDetalhesDoTicket;
window.renderizarGuichesGlobais = UIController.renderizarGuichesGlobais;
window.renderizarGuichesExibicao = UIController.renderizarGuichesExibicao;
window.salvarGuichesGlobais = UIController.salvarGuichesGlobais;
window.salvarExibicaoGuiches = UIController.salvarExibicaoGuiches;
window.initializeUI = UIController.initialize;
