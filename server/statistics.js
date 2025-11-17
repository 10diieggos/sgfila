// statistics.js - Cálculo de estatísticas

function formatarTempo(milissegundos) {
    if (isNaN(milissegundos) || milissegundos === 0 || !isFinite(milissegundos)) {
        return '0 min';
    }
    if (milissegundos < 60000) return "< 1 min";
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

    const tempoAtendimentoGeral = senhasAtendidas.reduce((acc, s) => acc + (s.tempoAtendimento || 0), 0);
    const tempoMedioAtendimentoGeralMs = (tempoAtendimentoGeral / senhasAtendidas.length);

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

        let maiorTempoEsperaMs = 0;
        let menorTempoEsperaMs = Infinity;

        atendidasTipo.forEach(s => {
            if (s.tempoEspera > maiorTempoEsperaMs) maiorTempoEsperaMs = s.tempoEspera;
            if (s.tempoEspera < menorTempoEsperaMs) menorTempoEsperaMs = s.tempoEspera;
        });

        const tempoMedioAtendimentoMs = (tempoAtendimentoTipo / atendidasTipo.length);

        detalhesPorTipo[tipo] = {
            emitidas: emitidasTipo.length,
            atendidas: atendidasTipo.length,
            tempoMedioEspera: formatarTempo(tempoEsperaTipo / atendidasTipo.length),
            tempoMedioAtendimento: formatarTempo(tempoMedioAtendimentoMs),
            tempoMedioAtendimentoMs: isNaN(tempoMedioAtendimentoMs) ? 0 : tempoMedioAtendimentoMs,
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

    Object.keys(detalhesPorGuiche).forEach(guiche => {
        const dados = detalhesPorGuiche[guiche];
        detalhesPorGuiche[guiche].tempoMedioAtendimento = formatarTempo(dados.tempoTotalAtendimento / dados.atendidas);
    });

    return {
        totalEmitidas,
        totalAtendidas,
        totalNaoCompareceu,
        totalExcluidas,
        tempoMedioEsperaGeral,
        tempoMedioAtendimentoGeralMs: isNaN(tempoMedioAtendimentoGeralMs) ? 0 : tempoMedioAtendimentoGeralMs,
        guichesAtivos: (guichesAtivosGlobal > 0 ? guichesAtivosGlobal : 1),
        proximaSenha,
        detalhesPorTipo,
        detalhesPorGuiche
    };
}

module.exports = {
    calcularEstatisticas
};
