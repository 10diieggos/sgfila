/**
 * Tipos compartilhados entre cliente e servidor
 * Sistema de Gerenciamento de Filas - SGFILA v3.0
 */
// Função para obter valores padrão para configurações
export function getConfigPadrao() {
    return {
        tiposSenha: [
            {
                id: 'prioridade',
                nome: 'Prioritária',
                nomeCompleto: 'Atendimento Prioritário',
                prefixo: 'P',
                cor: '#ff6b6b',
                corFundo: '#fff5f5',
                icone: 'wheelchair',
                ativo: true,
                ordem: 1,
                subtipos: ['Idoso', 'Gestante', 'Deficiente', 'Lactante', 'Criança de Colo']
            },
            {
                id: 'contratual',
                nome: 'Contratual',
                nomeCompleto: 'Cliente Contratual',
                prefixo: 'C',
                cor: '#845ef7',
                corFundo: '#f3e8ff',
                icone: 'file-contract',
                ativo: true,
                ordem: 2,
                subtipos: ['Empresa', 'Governo', 'Parceiro']
            },
            {
                id: 'normal',
                nome: 'Normal',
                nomeCompleto: 'Atendimento Normal',
                prefixo: 'N',
                cor: '#4dabf7',
                corFundo: '#f0f8ff',
                icone: 'user',
                ativo: true,
                ordem: 3,
                subtipos: ['Geral', 'Consulta', 'Reclamação']
            }
        ],
        motivosRetorno: [
            {
                id: 'retorno_impressao',
                nome: 'Erro de Impressão',
                descricao: 'Senha emitida com erro na impressão',
                icone: 'print',
                cor: '#ffc107',
                prazoMinutos: 5,
                posicionamentoFila: 'inicio',
                ativo: true
            },
            {
                id: 'erro_operacional',
                nome: 'Erro Operacional',
                descricao: 'Erro durante o atendimento que requer reabrir',
                icone: 'exclamation-triangle',
                cor: '#dc3545',
                prazoMinutos: 10,
                posicionamentoFila: 'inicio',
                ativo: true
            },
            {
                id: 'ausente_retornou',
                nome: 'Ausente Retornou',
                descricao: 'Cliente não compareceu mas retornou',
                icone: 'user-clock',
                cor: '#17a2b8',
                prazoMinutos: 30,
                posicionamentoFila: 'fim',
                ativo: true
            },
            {
                id: 'reabertura_atendimento',
                nome: 'Reabertura de Atendimento',
                descricao: 'Atendimento precisa ser reaberto',
                icone: 'redo',
                cor: '#6c757d',
                prazoMinutos: null,
                posicionamentoFila: 'original',
                ativo: true
            }
        ],
        comportamentoFila: {
            algoritmo: 'proporcao',
            permitirPularSenhas: true,
            autoFinalizarMinutos: null,
            chamarProximaAutomatica: false,
            tempoEsperaMaximoMinutos: null,
            alertarTempoEsperaExcedido: false
        },
        interface: {
            tema: 'claro',
            tamanhoFonteSenhas: 'grande',
            formatoNumeroSenha: 'com-hifen',
            mostrarDescricaoSenha: true,
            mostrarTempoEspera: true,
            mostrarTempoAtendimento: true,
            ordenacaoFilaPadrao: 'emissao',
            exibirIconesPrioridade: true
        },
        notificacoes: {
            somAtivo: true,
            volumeSom: 80,
            beepsEmissao: 1,
            beepsChamada: 3,
            alertaFilaCheia: false,
            limiteFilaCheia: 100,
            alertaGuicheInativo: false,
            tempoInativoMinutos: 10
        },
        estatisticas: {
            metricas: {
                totalEmitidas: true,
                totalAtendidas: true,
                tempoMedioEspera: true,
                tempoMedioAtendimento: true,
                taxaNaoComparecimento: true,
                produtividadePorGuiche: true
            },
            periodoAnalise: 'dia',
            atualizacaoAutomatica: true,
            intervaloAtualizacaoSegundos: 5
        },
        seguranca: {
            senhaAdmin: null,
            exigirConfirmacaoExclusao: true,
            exigirConfirmacaoReinicio: true,
            logAuditoria: false,
            backupAutomatico: false,
            intervaloBackupMinutos: 60
        },
        correcoes: {
            tempoLimite: {
                ativo: true,
                temposPorTipo: {
                    contratual: 10,
                    prioridade: 20,
                    normal: 25
                },
                maxReposicionamentos: 0,
                notificarDisplay: false,
                registrarLog: true,
                mensagemReposicionamento: 'Priorizada por tempo de espera excedido: {tempo}min'
            },
            ausencias: {
                ativo: true,
                tentativasPermitidas: 1,
                notificarDisplay: false,
                alertaSonoro: false,
                mensagemAusencia: 'Senha {numero} ausente - {tentativas} de {max_tentativas}'
            },
            frequenciaVerificacao: 'tempo_real',
            intervaloVerificacaoMinutos: 1,
            limitarCorrecoesEmMassa: false,
            maxCorrecoesSimultaneas: 5,
            destacarSenhasTempoLimite: true,
            mostrarHistoricoAusencias: true
        },
        versao: '3.2.0',
        ultimaAtualizacao: Date.now()
    };
}
