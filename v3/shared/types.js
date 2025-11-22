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
        designTokens: {
            colors: {
                primary: '#004a8d',
                secondary: '#6c757d',
                success: '#198754',
                danger: '#dc3545',
                warning: '#ff922b',
                info: '#17a2b8',
                neutral: '#868e96'
            },
            spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
            radii: { sm: 4, md: 6, lg: 8 },
            fontSizes: { small: 12, base: 14, md: 16, lg: 18, xl: 20 },
            shadows: { sm: '0 1px 2px rgba(0,0,0,0.06)', md: '0 2px 6px rgba(0,0,0,0.1)', lg: '0 4px 12px rgba(0,0,0,0.12)' },
            zIndex: { modal: 1000, overlay: 900, dropdown: 800 },
            transitions: { fast: '150ms ease-out', normal: '250ms ease', slow: '400ms ease-in' }
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
        roteamento: {
            jsedWeights: { prioridade: 1.3, contratual: 1.1, normal: 1.0 },
            wfq: { alphaAging: 0.1, agingWindowMin: 30, clampMax: 2.0 },
            fast: { msLimit: 180000, windowSize: 20, minCount: 10, minFraction: 0.5, boost: 1.1, maxConsecutiveBoost: 3, cooldownCalls: 10 },
            wrr: { weights: { prioridade: 3, contratual: 2, normal: 1 }, enableThreshold: 0.2, windowCalls: 20, checkRounds: 2, cooldownCalls: 10 }
        },
        algoritmoVersao: '1.0.0',
        versao: '3.2.0',
        ultimaAtualizacao: Date.now()
    };
}
