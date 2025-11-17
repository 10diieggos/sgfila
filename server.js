const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const ARQUIVO_DADOS = path.join(__dirname, 'dados.json');

// --- Gerenciamento de Estado ---

const getEstadoPadrao = () => ({
    senhas: [],
    atendimentosAtuais: {}, 
    contadorPrioridade: 0,
    contadorNormal: 0,
    contadorContratual: 0,
    dataAtual: new Date().toDateString(),
    proporcaoPrioridade: 2,
    proporcaoContratual: 1,
    contadorPrioridadeDesdeUltimaNormal: 0,
    contadorContratualDesdeUltimaNormal: 0,
    guichesConfigurados: [] // NOVO
});

function carregarEstado() {
    try {
        if (fs.existsSync(ARQUIVO_DADOS)) {
            const dadosCrus = fs.readFileSync(ARQUIVO_DADOS);
            let estadoSalvo = JSON.parse(dadosCrus);
            
            const hoje = new Date().toDateString();
            if (estadoSalvo.dataAtual !== hoje) {
                console.log('Novo dia. Resetando contadores e senhas...');
                
                // Mantém a configuração global de guichês ao reiniciar o dia
                const guichesSalvos = estadoSalvo.guichesConfigurados || [];
                const estadoNovoDia = {
                    ...getEstadoPadrao(),
                    dataAtual: hoje,
                    guichesConfigurados: guichesSalvos // Mantém
                };
                return estadoNovoDia;
            }

            // *** MIGRAÇÃO (Mantida por segurança) ***
            if (estadoSalvo.senhaAtual && !estadoSalvo.atendimentosAtuais) {
                console.warn('Detectado formato de estado antigo. Migrando...');
                estadoSalvo.atendimentosAtuais = {};
                const guichePadrao = "Guiche_Migrado";
                estadoSalvo.atendimentosAtuais[guichePadrao] = estadoSalvo.senhaAtual;
                const senhaNaLista = estadoSalvo.senhas.find(s => s.numero === estadoSalvo.senhaAtual.numero);
                if (senhaNaLista) {
                    senhaNaLista.guicheAtendendo = guichePadrao;
                }
                delete estadoSalvo.senhaAtual; 
            }

            // --- Carregamento/Inicialização dos novos campos ---
            if (!estadoSalvo.atendimentosAtuais) {
                estadoSalvo.atendimentosAtuais = {};
            }
            if (estadoSalvo.proporcaoPrioridade === undefined) {
                estadoSalvo.proporcaoPrioridade = getEstadoPadrao().proporcaoPrioridade;
            }
            if (estadoSalvo.contadorPrioridadeDesdeUltimaNormal === undefined) {
                estadoSalvo.contadorPrioridadeDesdeUltimaNormal = 0;
            }
            if (estadoSalvo.contadorContratual === undefined) {
                estadoSalvo.contadorContratual = 0;
            }
            if (estadoSalvo.proporcaoContratual === undefined) {
                estadoSalvo.proporcaoContratual = getEstadoPadrao().proporcaoContratual;
            }
            if (estadoSalvo.contadorContratualDesdeUltimaNormal === undefined) {
                estadoSalvo.contadorContratualDesdeUltimaNormal = 0;
            }
            // NOVO: Inicializa a configuração global de guichês
            if (estadoSalvo.guichesConfigurados === undefined) {
                estadoSalvo.guichesConfigurados = [];
            }
            // --- Fim dos novos campos ---


            // ATUALIZADO: Garante que senhas antigas tenham os campos novos
            estadoSalvo.senhas.forEach(senha => {
                if (!senha.sortKey) {
                    senha.sortKey = senha.timestamp;
                }
                // NOVO: Garante que o campo descrição exista
                if (senha.descricao === undefined) {
                    senha.descricao = '';
                }
            });

            return estadoSalvo;
        }
    } catch (e) {
        console.error('Erro ao ler dados.json, usando estado padrão:', e);
    }
    const novoEstado = { ...getEstadoPadrao(), dataAtual: new Date().toDateString() };
    salvarEstado(novoEstado); // Salva o estado inicial
    return novoEstado;
}

function salvarEstado(estado) {
    try {
        fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(estado, null, 2));
    } catch (e) {
        console.error('Erro ao salvar dados.json:', e);
    }
}

let estado = carregarEstado();
let guichePorSocketId = {};

// --- NOVO: Lógica de Cálculo de Estatísticas ---

// --- ATUALIZADO: Função de formatação de tempo (substitui formatarTempoMedio) ---
function formatarTempo(milissegundos) {
    if (isNaN(milissegundos) || milissegundos === 0 || !isFinite(milissegundos)) {
        return '0 min';
    }
    if (milissegundos < 60000) return "< 1 min"; // NOVO: Para estimativas
    const minutos = Math.round(milissegundos / 60000);
    return `${minutos} min`;
}

function calcularEstatisticas(senhas, estadoAtual) {
    const senhasAtendidas = senhas.filter(s => s.status === 'atendida');
    const senhasEmEspera = senhas.filter(s => s.status === 'espera');

    // 1. Estatísticas Gerais
    const totalEmitidas = senhas.length;
    const totalAtendidas = senhasAtendidas.length;
    const totalNaoCompareceu = senhas.filter(s => s.status === 'nao_compareceu').length;
    const totalExcluidas = senhas.filter(s => s.status === 'excluida').length;
    
    const tempoEsperaGeral = senhasAtendidas.reduce((acc, s) => acc + (s.tempoEspera || 0), 0);
    const tempoMedioEsperaGeral = formatarTempo(tempoEsperaGeral / senhasAtendidas.length);
    
    // --- NOVO: Cálculo do TMA Geral em MS (para estimativa) ---
    const tempoAtendimentoGeral = senhasAtendidas.reduce((acc, s) => acc + (s.tempoAtendimento || 0), 0);
    const tempoMedioAtendimentoGeralMs = (tempoAtendimentoGeral / senhasAtendidas.length);
    // --- FIM: NOVO CÁLCULO ---

    // --- NOVO: Cálculo de Guichês Ativos (da config global) ---
    const guichesAtivosGlobal = (estadoAtual.guichesConfigurados || []).filter(g => g.ativo).length;


    // 2. Próxima Senha (Lógica do servidor)
    let proximaSenha = '---';
    if (senhasEmEspera.length > 0) {
        const filaPorChegada = [...senhasEmEspera].sort((a, b) => a.timestamp - b.timestamp);
        const prioritariaMaisAntiga = filaPorChegada.find(s => s.tipo === 'prioridade');
        const contratualMaisAntiga = filaPorChegada.find(s => s.tipo === 'contratual');
        const normalMaisAntiga = filaPorChegada.find(s => s.tipo === 'normal');

        if (prioritariaMaisAntiga && estadoAtual.contadorPrioridadeDesdeUltimaNormal < estadoAtual.proporcaoPrioridade) {
            proximaSenha = prioritariaMaisAntiga.numero;
        } else if (contratualMaisAntiga && estadoAtual.contadorContratualDesdeUltimaNormal < estadoAtual.proporcaoContratual) {
            proximaSenha = contratualMaisAntiga.numero;
        } else if (normalMaisAntiga) {
            proximaSenha = normalMaisAntiga.numero;
        } else if (prioritariaMaisAntiga) {
            proximaSenha = prioritariaMaisAntiga.numero;
        } else if (contratualMaisAntiga) {
            proximaSenha = contratualMaisAntiga.numero;
        }
    }

    // 3. Detalhes por Tipo
    const detalhesPorTipo = {};
    const tipos = ['prioridade', 'contratual', 'normal'];

    tipos.forEach(tipo => {
        const emitidasTipo = senhas.filter(s => s.tipo === tipo);
        const atendidasTipo = emitidasTipo.filter(s => s.status === 'atendida');
        
        const tempoEsperaTipo = atendidasTipo.reduce((acc, s) => acc + (s.tempoEspera || 0), 0);
        const tempoAtendimentoTipo = atendidasTipo.reduce((acc, s) => acc + (s.tempoAtendimento || 0), 0);
        
        // --- NOVO: Cálculo de Maior e Menor Tempo ---
        let maiorTempoEsperaMs = 0;
        let menorTempoEsperaMs = Infinity;
        
        atendidasTipo.forEach(s => {
           if (s.tempoEspera > maiorTempoEsperaMs) maiorTempoEsperaMs = s.tempoEspera;
           if (s.tempoEspera < menorTempoEsperaMs) menorTempoEsperaMs = s.tempoEspera;
        });
        // --- FIM: NOVO CÁLCULO ---
        
        // --- NOVO: Cálculo do TMA em MS (para estimativa) ---
        const tempoMedioAtendimentoMs = (tempoAtendimentoTipo / atendidasTipo.length);

        detalhesPorTipo[tipo] = {
            emitidas: emitidasTipo.length,
            atendidas: atendidasTipo.length,
            tempoMedioEspera: formatarTempo(tempoEsperaTipo / atendidasTipo.length),
            // --- ATUALIZADO: Inclui string e número ---
            tempoMedioAtendimento: formatarTempo(tempoMedioAtendimentoMs),
            tempoMedioAtendimentoMs: isNaN(tempoMedioAtendimentoMs) ? 0 : tempoMedioAtendimentoMs,
            // --- FIM DA ATUALIZAÇÃO ---
            maiorTempoEspera: formatarTempo(maiorTempoEsperaMs),
            menorTempoEspera: (menorTempoEsperaMs === Infinity) ? '---' : formatarTempo(menorTempoEsperaMs)
        };
    });

    // 4. Detalhes por Guichê
    const detalhesPorGuiche = {};
    senhasAtendidas.forEach(senha => {
        const guiche = senha.guicheAtendendo;
        if (!guiche) return;

        if (!detalhesPorGuiche[guiche]) {
            detalhesPorGuiche[guiche] = { atendidas: 0, tempoTotalAtendimento: 0 };
        }
        
        detalhesPorGuiche[guiche].atendidas++;
        detalhesPorGuiche[guiche].tempoTotalAtendimento += (senha.tempoAtendimento || 0);
    });

    // Formata a média por guichê
    Object.keys(detalhesPorGuiche).forEach(guiche => {
        const dados = detalhesPorGuiche[guiche];
        // --- ATUALIZADO: Usa formatarTempo ---
        detalhesPorGuiche[guiche].tempoMedioAtendimento = formatarTempo(dados.tempoTotalAtendimento / dados.atendidas);
    });

    return {
        totalEmitidas,
        totalAtendidas,
        totalNaoCompareceu,
        totalExcluidas,
        tempoMedioEsperaGeral,
        // --- NOVO: TMA Geral em MS ---
        tempoMedioAtendimentoGeralMs: isNaN(tempoMedioAtendimentoGeralMs) ? 0 : tempoMedioAtendimentoGeralMs,
        // --- NOVO: Guichês ativos da config global ---
        guichesAtivos: (guichesAtivosGlobal > 0 ? guichesAtivosGlobal : 1), // Garante no mínimo 1
        proximaSenha,
        detalhesPorTipo,
        detalhesPorGuiche
    };
}

// --- NOVO: Função centralizada para emitir o estado ---
function broadcastEstadoAtualizado() {
    // Calcula as estatísticas frescas ANTES de emitir
    const estatisticas = calcularEstatisticas(estado.senhas, estado);
    
    // Emite o payload combinado
    io.emit('estadoAtualizado', {
        estado: estado,
        estatisticas: estatisticas
    });
}

// --- Servidor Web ---
app.use(express.static(__dirname));

// --- Lógica do WebSocket (Comunicação em Tempo Real) ---

io.on('connection', (socket) => {
    console.log(`Novo guichê conectado: ${socket.id}`);
    
    // Envia o estado ATUAL + ESTATÍSTICAS para o novo cliente
    const estatisticas = calcularEstatisticas(estado.senhas, estado);
    socket.emit('estadoAtualizado', {
        estado: estado,
        estatisticas: estatisticas
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
        broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // ATUALIZADO
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
            broadcastEstadoAtualizado(); // Emite o novo estado (com guiches) e novas estatisticas (com contagem de ativos)
        }
    });

    socket.on('reiniciarSistema', () => {
        console.log('Sistema sendo reiniciado por um guichê.');
        
        const proporcaoP = estado.proporcaoPrioridade || 2; 
        const proporcaoC = estado.proporcaoContratual || 1;
        const guichesSalvos = estado.guichesConfigurados || []; // Mantém a config global de guichês
        
        estado = getEstadoPadrao(); 
        estado.dataAtual = new Date().toDateString();
        estado.proporcaoPrioridade = proporcaoP;
        estado.proporcaoContratual = proporcaoC;
        estado.guichesConfigurados = guichesSalvos; // Restaura a config global
        
        guichePorSocketId = {}; 
        salvarEstado(estado);
        
        broadcastEstadoAtualizado(); // ATUALIZADO
        io.emit('sistemaReiniciado'); // Mantém para o cliente recarregar
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
                broadcastEstadoAtualizado(); // ATUALIZADO
            }
            
            delete guichePorSocketId[socket.id];
        }
    });
});

// --- Iniciar Servidor DEEPSEEK ---
server.listen(PORT, () => {
    console.log(`Servidor SGF rodando.`);
    console.log(`Acesse http://localhost:${PORT} no seu navegador.`);
    console.log(`Outros guichês na rede devem acessar http://[IP_DO_SERVIDOR]:${PORT}`);
});