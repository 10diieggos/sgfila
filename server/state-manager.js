// state-manager.js - Gerenciamento de estado da aplicação
const fs = require('fs');
const path = require('path');

const ARQUIVO_DADOS = path.join(__dirname, '..', 'dados.json');

function getEstadoPadrao() {
    return {
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
        guichesConfigurados: []
    };
}

function carregarEstado() {
    try {
        if (fs.existsSync(ARQUIVO_DADOS)) {
            const dadosCrus = fs.readFileSync(ARQUIVO_DADOS);
            let estadoSalvo = JSON.parse(dadosCrus);

            const hoje = new Date().toDateString();
            if (estadoSalvo.dataAtual !== hoje) {
                console.log('Novo dia. Resetando contadores e senhas...');
                const guichesSalvos = estadoSalvo.guichesConfigurados || [];
                const estadoNovoDia = {
                    ...getEstadoPadrao(),
                    dataAtual: hoje,
                    guichesConfigurados: guichesSalvos
                };
                return estadoNovoDia;
            }

            // Migração de formato antigo
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

            // Inicialização de campos
            if (!estadoSalvo.atendimentosAtuais) estadoSalvo.atendimentosAtuais = {};
            if (estadoSalvo.proporcaoPrioridade === undefined) estadoSalvo.proporcaoPrioridade = 2;
            if (estadoSalvo.contadorPrioridadeDesdeUltimaNormal === undefined) estadoSalvo.contadorPrioridadeDesdeUltimaNormal = 0;
            if (estadoSalvo.contadorContratual === undefined) estadoSalvo.contadorContratual = 0;
            if (estadoSalvo.proporcaoContratual === undefined) estadoSalvo.proporcaoContratual = 1;
            if (estadoSalvo.contadorContratualDesdeUltimaNormal === undefined) estadoSalvo.contadorContratualDesdeUltimaNormal = 0;
            if (estadoSalvo.guichesConfigurados === undefined) estadoSalvo.guichesConfigurados = [];

            // Garante campos nas senhas
            estadoSalvo.senhas.forEach(senha => {
                if (!senha.sortKey) senha.sortKey = senha.timestamp;
                if (senha.descricao === undefined) senha.descricao = '';
            });

            return estadoSalvo;
        }
    } catch (e) {
        console.error('Erro ao ler dados.json, usando estado padrão:', e);
    }
    const novoEstado = { ...getEstadoPadrao(), dataAtual: new Date().toDateString() };
    salvarEstado(novoEstado);
    return novoEstado;
}

function salvarEstado(estado) {
    try {
        fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(estado, null, 2));
    } catch (e) {
        console.error('Erro ao salvar dados.json:', e);
    }
}

module.exports = {
    carregarEstado,
    salvarEstado,
    getEstadoPadrao
};
