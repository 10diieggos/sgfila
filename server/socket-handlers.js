/**
 * Socket Handlers Module
 * Extracts all WebSocket event handlers for the SGF queue management system
 */

function setupSocketHandlers(io, estado, salvarEstado, broadcastEstadoAtualizado) {
    let guichePorSocketId = {};

    io.on('connection', (socket) => {
        console.log(`Novo guichê conectado: ${socket.id}`);

        // Envia o estado ATUAL + ESTATÍSTICAS para o novo cliente
        // Nota: calcularEstatisticas será chamada internamente por broadcastEstadoAtualizado
        // Por enquanto, apenas emitimos o estado atual
        socket.emit('estadoAtualizado', {
            estado: estado,
            estatisticas: {} // Será recalculado no cliente ou no servidor
        });

        socket.on('registrarGuiche', (nomeGuiche) => {
            if (!nomeGuiche) return;
            console.log(`Guichê ${socket.id} se registrou como: ${nomeGuiche}`);

            const socketAntigo = Object.keys(guichePorSocketId).find(key => guichePorSocketId[key] === nomeGuiche);
            if (socketAntigo) {
                delete guichePorSocketId[socketAntigo];
            }

            guichePorSocketId[socket.id] = nomeGuiche;
            socket.emit('guicheRegistrado', nomeGuiche);
        });

        socket.on('emitirSenha', (dados) => {
            let numeroSenha, prefixo;
            const { tipo, subtipo } = dados;
            const agora = new Date().getTime();

            if (tipo === 'prioridade') {
                estado.contadorPrioridade++;
                prefixo = 'P';
                numeroSenha = `${prefixo}${estado.contadorPrioridade.toString().padStart(3, '0')}`;
            } else if (tipo === 'contratual') {
                estado.contadorContratual++;
                prefixo = 'C';
                numeroSenha = `${prefixo}${estado.contadorContratual.toString().padStart(3, '0')}`;
            } else {
                estado.contadorNormal++;
                prefixo = 'N';
                numeroSenha = `${prefixo}${estado.contadorNormal.toString().padStart(3, '0')}`;
            }

            // ATUALIZADO: Objeto novaSenha agora inclui 'descricao'
            const novaSenha = {
                id: tipo === 'prioridade' ? estado.contadorPrioridade : (tipo === 'contratual' ? estado.contadorContratual : estado.contadorNormal),
                numero: numeroSenha,
                tipo: tipo,
                subtipo: subtipo || '',
                timestamp: agora,
                sortKey: agora,
                status: 'espera',
                tempoEspera: 0,
                tempoAtendimento: 0,
                chamadaTimestamp: null,
                finalizadoTimestamp: null,
                guicheAtendendo: null,
                descricao: '' // NOVO CAMPO
            };

            estado.senhas.push(novaSenha);

            salvarEstado(estado);
            broadcastEstadoAtualizado();
            socket.emit('beep', { times: 1, numero: novaSenha.numero, tipo: 'emissao' });
        });

        // Lógica de chamada AUTOMÁTICA
        socket.on('chamarSenha', (dados) => {
            const { guicheId } = dados;
            if (!guicheId) return;
            if (estado.atendimentosAtuais[guicheId]) return;

            let proxima = null;

            const senhasEmEspera = estado.senhas.filter(s => s.status === 'espera');
            if (senhasEmEspera.length === 0) {
                return;
            }

            const filaPorChegada = [...senhasEmEspera].sort((a, b) => a.timestamp - b.timestamp);

            const prioritariaMaisAntiga = filaPorChegada.find(s => s.tipo === 'prioridade');
            const contratualMaisAntiga = filaPorChegada.find(s => s.tipo === 'contratual');
            const normalMaisAntiga = filaPorChegada.find(s => s.tipo === 'normal');

            // LÓGICA DE PROPORÇÃO P:C:N
            if (prioritariaMaisAntiga && estado.contadorPrioridadeDesdeUltimaNormal < estado.proporcaoPrioridade) {
                proxima = prioritariaMaisAntiga;
                estado.contadorPrioridadeDesdeUltimaNormal++;
                console.log(`Chamando por proporção (P): ${proxima.numero}`);
            }
            else if (contratualMaisAntiga && estado.contadorContratualDesdeUltimaNormal < estado.proporcaoContratual) {
                proxima = contratualMaisAntiga;
                estado.contadorContratualDesdeUltimaNormal++;
                console.log(`Chamando por proporção (C): ${proxima.numero}`);
            }
            else if (normalMaisAntiga) {
                proxima = normalMaisAntiga;
                estado.contadorPrioridadeDesdeUltimaNormal = 0;
                estado.contadorContratualDesdeUltimaNormal = 0;
                console.log(`Chamando por proporção (N): ${proxima.numero}`);
            }
            else if (prioritariaMaisAntiga) {
                proxima = prioritariaMaisAntiga;
                estado.contadorPrioridadeDesdeUltimaNormal++;
                console.log(`Chamando por proporção (N-fallback->P): ${proxima.numero}`);
            }
            else if (contratualMaisAntiga) {
                proxima = contratualMaisAntiga;
                estado.contadorContratualDesdeUltimaNormal++;
                console.log(`Chamando por proporção (N/P-fallback->C): ${proxima.numero}`);
            }

            if (proxima) {
                proxima.status = 'chamada';
                proxima.chamadaTimestamp = new Date().getTime();
                proxima.tempoEspera = proxima.chamadaTimestamp - proxima.timestamp;
                proxima.guicheAtendendo = guicheId;

                estado.atendimentosAtuais[guicheId] = proxima;

                salvarEstado(estado);
                broadcastEstadoAtualizado();
                socket.emit('beep', { times: 2, numero: proxima.numero, tipo: 'chamada' });
            }
        });

        // Lógica de chamada MANUAL
        socket.on('chamarSenhaEspecifica', (dados) => {
            const { guicheId, numeroSenha } = dados;

            if (!guicheId) return;
            if (estado.atendimentosAtuais[guicheId]) return;

            const senhaClicada = estado.senhas.find(s =>
                s.numero === numeroSenha &&
                s.status === 'espera'
            );

            if (senhaClicada) {
                console.log(`Chamando por clique (Manual): ${senhaClicada.numero}`);

                if (senhaClicada.tipo === 'normal') {
                    estado.contadorPrioridadeDesdeUltimaNormal = 0;
                    estado.contadorContratualDesdeUltimaNormal = 0;
                    console.log('...Contadores de proporção ZERADOS.');
                } else if (senhaClicada.tipo === 'prioridade') {
                    estado.contadorPrioridadeDesdeUltimaNormal++;
                    console.log('...Contador de proporção (P) INCREMENTADO.');
                } else if (senhaClicada.tipo === 'contratual') {
                    estado.contadorContratualDesdeUltimaNormal++;
                    console.log('...Contador de proporção (C) INCREMENTADO.');
                }

                senhaClicada.status = 'chamada';
                senhaClicada.chamadaTimestamp = new Date().getTime();
                senhaClicada.tempoEspera = senhaClicada.chamadaTimestamp - senhaClicada.timestamp;
                senhaClicada.guicheAtendendo = guicheId;

                estado.atendimentosAtuais[guicheId] = senhaClicada;

                salvarEstado(estado);
                broadcastEstadoAtualizado();
                socket.emit('beep', { times: 2, numero: senhaClicada.numero, tipo: 'chamada' });
            }
        });

        // *** ATUALIZADO: Lógica para "Excluir" (da Fila de Espera) ***
        socket.on('excluirSenha', (dados) => {
            const { numeroSenha } = dados;
            if (!numeroSenha) return;

            // Encontra a senha na lista principal
            const senhaParaExcluir = estado.senhas.find(s =>
                s.numero === numeroSenha &&
                s.status === 'espera'
            );

            if (senhaParaExcluir) {
                console.log(`Marcando senha ${senhaParaExcluir.numero} como 'excluida' da fila.`);

                // *** ATUALIZADO: Muda o status ao invés de deletar, para manter a contagem ***
                // Isso garante que senhas.length (total de emitidas) não seja afetado.
                senhaParaExcluir.status = 'excluida';

                salvarEstado(estado);
                broadcastEstadoAtualizado();
            } else {
                console.log(`Senha ${numeroSenha} não encontrada ou já foi chamada.`);
            }
        });
        // *** FIM DA ATUALIZAÇÃO ***

        // Lógica para marcar como "Não-Compareceu" (da fila Em Atendimento)
        socket.on('excluirAtendimento', (dados) => {
            const { numeroSenha } = dados;
            if (!numeroSenha) return;

            // 1. Encontrar o guichê que está atendendo esta senha
            let guicheIdQueAtende = null;
            for (const guicheId in estado.atendimentosAtuais) {
                if (estado.atendimentosAtuais[guicheId].numero === numeroSenha) {
                    guicheIdQueAtende = guicheId;
                    break;
                }
            }

            // 2. Encontrar a senha na lista principal
            const senhaParaMarcar = estado.senhas.find(s => s.numero === numeroSenha);

            if (senhaParaMarcar) {
                // 3. Mudar o status para 'nao_compareceu'
                console.log(`Marcando senha ${senhaParaMarcar.numero} como 'nao_compareceu'.`);
                senhaParaMarcar.status = 'nao_compareceu';
                senhaParaMarcar.guicheAtendendo = null; // Limpa o guichê

                // 4. Se estava em atendimento, remover de atendimentosAtuais
                if (guicheIdQueAtende) {
                    delete estado.atendimentosAtuais[guicheIdQueAtende];
                }

                // 5. Salvar e notificar
                salvarEstado(estado);
                broadcastEstadoAtualizado();
            } else {
                console.log(`Tentativa de marcar "Não Compareceu" para a senha ${numeroSenha}, mas não foi encontrada.`);
            }
        });

        // --- NOVO: Lógica para devolver senha à fila ---
        socket.on('devolverSenha', (dados) => {
            const { numeroSenha } = dados;
            if (!numeroSenha) return;

            // 1. Encontrar o guichê que está atendendo esta senha
            let guicheIdQueAtende = null;
            for (const guicheId in estado.atendimentosAtuais) {
                if (estado.atendimentosAtuais[guicheId].numero === numeroSenha) {
                    guicheIdQueAtende = guicheId;
                    break;
                }
            }

            // 2. Encontrar a senha na lista principal
            const senhaParaDevolver = estado.senhas.find(s => s.numero === numeroSenha);

            if (senhaParaDevolver && guicheIdQueAtende) {
                console.log(`Devolvendo senha ${senhaParaDevolver.numero} para a fila.`);

                // 3. Reverter o status para 'espera'
                senhaParaDevolver.status = 'espera';
                senhaParaDevolver.chamadaTimestamp = null;
                senhaParaDevolver.tempoEspera = 0;
                senhaParaDevolver.guicheAtendendo = null;

                // 4. Ajustar o timestamp para manter a posição original na fila
                // Diminui 1ms para garantir que volte para frente da senha seguinte
                senhaParaDevolver.timestamp = senhaParaDevolver.timestamp - 1;

                // 5. Remover de atendimentosAtuais
                delete estado.atendimentosAtuais[guicheIdQueAtende];

                // 6. Salvar e notificar
                salvarEstado(estado);
                broadcastEstadoAtualizado();
            } else {
                console.log(`Tentativa de devolver senha ${numeroSenha}, mas não foi encontrada em atendimento.`);
            }
        });

        // Lógica para atualizar a descrição
        socket.on('atualizarDescricao', (dados) => {
            const { numeroSenha, descricao } = dados;
            if (!numeroSenha) return;

            // Encontra a senha em qualquer estado (espera, chamada, etc.)
            const senhaParaAtualizar = estado.senhas.find(s => s.numero === numeroSenha);

            if (senhaParaAtualizar) {
                console.log(`Atualizando descrição da senha ${numeroSenha}`);
                // Garante que a descrição seja uma string
                senhaParaAtualizar.descricao = (descricao || '').toString();

                salvarEstado(estado);
                broadcastEstadoAtualizado();
            } else {
                console.log(`Descrição: Senha ${numeroSenha} não encontrada.`);
            }
        });


        socket.on('finalizarAtendimento', (dados) => {
            const { guicheId } = dados;
            if (!guicheId) return;

            const senhaEmAtendimento = estado.atendimentosAtuais[guicheId];

            if (senhaEmAtendimento) {
                const senhaFinalizada = estado.senhas.find(s => s.numero === senhaEmAtendimento.numero);

                if (senhaFinalizada) {
                    senhaFinalizada.status = 'atendida';
                    senhaFinalizada.finalizadoTimestamp = new Date().getTime();
                    senhaFinalizada.tempoAtendimento = senhaFinalizada.finalizadoTimestamp - senhaFinalizada.chamadaTimestamp;
                }

                delete estado.atendimentosAtuais[guicheId];

                salvarEstado(estado);
                broadcastEstadoAtualizado();
            }
        });

        // Evento P:N
        socket.on('atualizarProporcao', (novaProporcao) => {
            const proporcao = parseInt(novaProporcao, 10);
            if (!isNaN(proporcao) && proporcao >= 1) {
                console.log(`Proporção P:N atualizada para: ${proporcao}:1`);
                estado.proporcaoPrioridade = proporcao;
                estado.contadorPrioridadeDesdeUltimaNormal = 0;

                salvarEstado(estado);
                broadcastEstadoAtualizado();
            }
        });

        // Evento C:N
        socket.on('atualizarProporcaoContratual', (novaProporcao) => {
            const proporcao = parseInt(novaProporcao, 10);
            if (!isNaN(proporcao) && proporcao >= 1) {
                console.log(`Proporção C:N atualizada para: ${proporcao}:1`);
                estado.proporcaoContratual = proporcao;
                estado.contadorContratualDesdeUltimaNormal = 0;

                salvarEstado(estado);
                broadcastEstadoAtualizado();
            }
        });

        // --- NOVO: Handler para Configuração Global de Guichês ---
        socket.on('atualizarGuichesGlobais', (novosGuiches) => {
            if (Array.isArray(novosGuiches)) {
                console.log('Atualizando guichês globais.');
                // Limpa os nomes e status
                const guichesLimpados = novosGuiches.map(g => ({
                    nome: (g.nome || 'Guichê').trim(),
                    ativo: !!g.ativo
                }));

                estado.guichesConfigurados = guichesLimpados;
                salvarEstado(estado);
                broadcastEstadoAtualizado();
            }
        });

        socket.on('reiniciarSistema', () => {
            console.log('Sistema sendo reiniciado por um guichê.');

            const proporcaoP = estado.proporcaoPrioridade || 2;
            const proporcaoC = estado.proporcaoContratual || 1;
            const guichesSalvos = estado.guichesConfigurados || [];

            // Note: getEstadoPadrao() needs to be passed or defined elsewhere
            // For now, we'll need to handle this carefully
            // The calling code should provide access to getEstadoPadrao

            estado.senhas = [];
            estado.atendimentosAtuais = {};
            estado.contadorPrioridade = 0;
            estado.contadorNormal = 0;
            estado.contadorContratual = 0;
            estado.contadorPrioridadeDesdeUltimaNormal = 0;
            estado.contadorContratualDesdeUltimaNormal = 0;
            estado.dataAtual = new Date().toDateString();
            estado.proporcaoPrioridade = proporcaoP;
            estado.proporcaoContratual = proporcaoC;
            estado.guichesConfigurados = guichesSalvos;

            guichePorSocketId = {};
            salvarEstado(estado);

            broadcastEstadoAtualizado();
            io.emit('sistemaReiniciado');
        });


        socket.on('disconnect', () => {
            console.log(`Guichê desconectado: ${socket.id}`);
            const guicheId = guichePorSocketId[socket.id];

            if (guicheId) {
                const senhaEmAtendimento = estado.atendimentosAtuais[guicheId];

                if (senhaEmAtendimento) {
                    console.log(`Guichê ${guicheId} desconectou. Devolvendo senha ${senhaEmAtendimento.numero} para a fila.`);

                    const senhaDevolvida = estado.senhas.find(s => s.numero === senhaEmAtendimento.numero);

                    if (senhaDevolvida) {
                        senhaDevolvida.status = 'espera';
                        senhaDevolvida.chamadaTimestamp = null;
                        senhaDevolvida.tempoEspera = 0;
                        senhaDevolvida.guicheAtendendo = null;
                        senhaDevolvida.sortKey = senhaDevolvida.timestamp;
                    }

                    delete estado.atendimentosAtuais[guicheId];

                    salvarEstado(estado);
                    broadcastEstadoAtualizado();
                }

                delete guichePorSocketId[socket.id];
            }
        });
    });
}

module.exports = setupSocketHandlers;
