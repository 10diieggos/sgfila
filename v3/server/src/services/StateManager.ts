/**
 * StateManager - Gerenciamento de estado do sistema
 * SGFILA v3.0
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import type { EstadoSistema, Guiche, ConfiguracoesGerais, ConfiguracaoTipoSenha, ConfiguracaoMotivoRetorno, ConfiguracaoComportamentoFila, ConfiguracaoInterface, ConfiguracaoNotificacoes, ConfiguracaoSeguranca, ConfiguracaoCorrecoes, ConfiguracaoDesignTokens } from '../../../shared/types.ts';
function getConfigPadraoLocal(): ConfiguracoesGerais {
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
      wfq: { alphaAging: 0.1, agingWindowMin: 30, slowdownMax: 0.5, clampMax: 2.0 },
      fast: { msLimit: 180000, windowSize: 20, minCount: 10, minFraction: 0.5, boost: 1.1, maxConsecutiveBoost: 3, cooldownCalls: 10 },
      wrr: { weights: { prioridade: 3, contratual: 2, normal: 1 }, enableThreshold: 0.2, windowCalls: 20, checkRounds: 2, cooldownCalls: 10 },
      mlHintThresholds: { minScore: 0.65, maxLatencyMs: 200, enabled: true }
    },
    algoritmoVersao: '1.0.0',
    versao: '3.2.0',
    ultimaAtualizacao: Date.now()
  }
}

const DADOS_FILE = './dados.json';

export class StateManager {
  private static instance: StateManager;
  private estado: EstadoSistema;

  private constructor() {
    this.estado = this.carregarEstado();
  }

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  /**
   * Retorna o estado padrão inicial do sistema
   */
  private getEstadoPadrao(): EstadoSistema {
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().split('T')[0];

    return {
      senhas: [],
      senhasHoje: 0,
      contadorPrioridade: 0,
      contadorContratual: 0,
      contadorNormal: 0,
      contadorPrioridadeDesdeUltimaNormal: 0,
      contadorContratualDesdeUltimaNormal: 0,
      proporcaoPrioridade: 2,
      proporcaoContratual: 1,
      atendimentosAtuais: {},
      guichesConfigurados: [],
      dataReinicioSistema: dataFormatada,
      configuracoes: getConfigPadraoLocal(),
      chamadasPorTipoRecente: {
        prioridade: 0,
        contratual: 0,
        normal: 0,
      },
      totalChamadasRecente: 0,
      wrrAtivo: false,
    };
  }

  /**
   * Carrega o estado do arquivo dados.json
   */
  private carregarEstado(): EstadoSistema {
    try {
      if (existsSync(DADOS_FILE)) {
        const data = readFileSync(DADOS_FILE, 'utf8');
        const estadoCarregado = JSON.parse(data) as EstadoSistema;

        // Migração de dados antigos (v1/v2)
        if (!estadoCarregado.dataReinicioSistema) {
          estadoCarregado.dataReinicioSistema = new Date().toISOString().split('T')[0];
        }
        if (!estadoCarregado.guichesConfigurados) {
          estadoCarregado.guichesConfigurados = [];
        }
        if (!estadoCarregado.atendimentosAtuais) {
          estadoCarregado.atendimentosAtuais = {};
        }
        // Migração para v3.1 - Sistema de Configurações
        if (!estadoCarregado.configuracoes) {
          console.log('Migrando para sistema de configurações...');
          estadoCarregado.configuracoes = getConfigPadraoLocal();
        } else {
          // Mesclar configurações existentes com padrão (caso novas configs sejam adicionadas)
          estadoCarregado.configuracoes = this.mesclarConfiguracoes(estadoCarregado.configuracoes);
        }

        console.log('Estado carregado do arquivo dados.json');
        return estadoCarregado;
      }
    } catch (error) {
      console.error('Erro ao carregar estado:', error);
    }

    console.log('Criando novo estado padrão');
    return this.getEstadoPadrao();
  }

  /**
   * Salva o estado atual no arquivo dados.json
   */
  public salvarEstado(): void {
    try {
      writeFileSync(DADOS_FILE, JSON.stringify(this.estado, null, 2), 'utf8');
      console.log('Estado salvo em dados.json');
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  }

  /**
   * Retorna o estado atual
   */
  public getEstado(): EstadoSistema {
    return this.estado;
  }

  /**
   * Atualiza o estado e salva
   */
  public setEstado(novoEstado: EstadoSistema): void {
    this.estado = novoEstado;
    this.salvarEstado();
  }

  /**
   * Reinicia o sistema com estado limpo
   */
  public reiniciar(): void {
    this.estado = this.getEstadoPadrao();
    this.salvarEstado();
    console.log('Sistema reiniciado');
  }

  /**
   * Gera um ID único para guichê (timestamp + random)
   */
  private gerarIdGuiche(): string {
    return `guiche_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Atualiza guichês globais
   * - Mantém IDs existentes
   * - Gera novos IDs para guichês sem ID
   * - Valida exclusão de guichês em uso
   */
  public atualizarGuiches(guiches: Guiche[]): { sucesso: boolean; erro?: string } {
    // Garantir que todos os guichês tenham ID
    const guichesComId = guiches.map(guiche => {
      if (!guiche.id) {
        return { ...guiche, id: this.gerarIdGuiche() };
      }
      return guiche;
    });

    // Verificar se algum guichê sendo removido está em atendimento
    const idsNovos = new Set(guichesComId.map(g => g.id));
    const idsAntigos = this.estado.guichesConfigurados.map(g => g.id);
    const idsRemovidos = idsAntigos.filter(id => !idsNovos.has(id));

    for (const idRemovido of idsRemovidos) {
      if (this.estado.atendimentosAtuais[idRemovido]) {
        const guicheRemovido = this.estado.guichesConfigurados.find(g => g.id === idRemovido);
        return {
          sucesso: false,
          erro: `Não é possível remover "${guicheRemovido?.nome || 'guichê'}": há uma senha em atendimento. Encerre o atendimento primeiro.`
        };
      }
    }

    this.estado.guichesConfigurados = guichesComId;
    this.salvarEstado();
    return { sucesso: true };
  }

  /**
   * Atualiza proporção de prioridade
   */
  public atualizarProporcaoPrioridade(proporcao: number): void {
    this.estado.proporcaoPrioridade = proporcao;
    this.salvarEstado();
  }

  /**
   * Atualiza proporção de contratual
   */
  public atualizarProporcaoContratual(proporcao: number): void {
    this.estado.proporcaoContratual = proporcao;
    this.salvarEstado();
  }

  /**
   * Mescla configurações existentes com configurações padrão
   * Útil quando novas configurações são adicionadas ao sistema
   */
  private mesclarConfiguracoes(configExistente: ConfiguracoesGerais): ConfiguracoesGerais {
    const padrao = getConfigPadraoLocal();
    return {
      tiposSenha: configExistente.tiposSenha || padrao.tiposSenha,
      motivosRetorno: configExistente.motivosRetorno || padrao.motivosRetorno,
      comportamentoFila: { ...padrao.comportamentoFila, ...configExistente.comportamentoFila },
      interface: { ...padrao.interface, ...configExistente.interface },
      notificacoes: { ...padrao.notificacoes, ...configExistente.notificacoes },
      estatisticas: {
        metricas: { ...padrao.estatisticas.metricas, ...configExistente.estatisticas?.metricas },
        periodoAnalise: configExistente.estatisticas?.periodoAnalise || padrao.estatisticas.periodoAnalise,
        atualizacaoAutomatica: configExistente.estatisticas?.atualizacaoAutomatica ?? padrao.estatisticas.atualizacaoAutomatica,
        intervaloAtualizacaoSegundos: configExistente.estatisticas?.intervaloAtualizacaoSegundos || padrao.estatisticas.intervaloAtualizacaoSegundos
      },
      seguranca: { ...padrao.seguranca, ...configExistente.seguranca },
      correcoes: configExistente.correcoes ? {
        tempoLimite: { ...padrao.correcoes.tempoLimite, ...configExistente.correcoes.tempoLimite },
        ausencias: { ...padrao.correcoes.ausencias, ...configExistente.correcoes.ausencias },
        frequenciaVerificacao: configExistente.correcoes.frequenciaVerificacao || padrao.correcoes.frequenciaVerificacao,
        intervaloVerificacaoMinutos: configExistente.correcoes.intervaloVerificacaoMinutos ?? padrao.correcoes.intervaloVerificacaoMinutos,
        limitarCorrecoesEmMassa: configExistente.correcoes.limitarCorrecoesEmMassa ?? padrao.correcoes.limitarCorrecoesEmMassa,
        maxCorrecoesSimultaneas: configExistente.correcoes.maxCorrecoesSimultaneas || padrao.correcoes.maxCorrecoesSimultaneas,
        destacarSenhasTempoLimite: configExistente.correcoes.destacarSenhasTempoLimite ?? padrao.correcoes.destacarSenhasTempoLimite,
        mostrarHistoricoAusencias: configExistente.correcoes.mostrarHistoricoAusencias ?? padrao.correcoes.mostrarHistoricoAusencias
      } : padrao.correcoes,
      designTokens: configExistente.designTokens ? ({
        colors: { ...padrao.designTokens.colors, ...configExistente.designTokens.colors },
        spacing: { ...padrao.designTokens.spacing, ...configExistente.designTokens.spacing },
        radii: { ...padrao.designTokens.radii, ...configExistente.designTokens.radii },
        fontSizes: { ...padrao.designTokens.fontSizes, ...configExistente.designTokens.fontSizes },
        shadows: { ...(padrao.designTokens.shadows || {}), ...(configExistente.designTokens.shadows || {}) },
        zIndex: { ...(padrao.designTokens.zIndex || {}), ...(configExistente.designTokens.zIndex || {}) },
        transitions: { ...(padrao.designTokens.transitions || {}), ...(configExistente.designTokens.transitions || {}) }
      } as ConfiguracaoDesignTokens) : padrao.designTokens,
      roteamento: configExistente.roteamento ? {
        jsedWeights: { ...padrao.roteamento.jsedWeights, ...configExistente.roteamento.jsedWeights },
        wfq: { ...padrao.roteamento.wfq, ...configExistente.roteamento.wfq },
        fast: { ...padrao.roteamento.fast, ...configExistente.roteamento.fast },
        wrr: { ...padrao.roteamento.wrr, ...configExistente.roteamento.wrr },
        mlHintThresholds: { ...padrao.roteamento.mlHintThresholds, ...(configExistente.roteamento as any).mlHintThresholds }
      } : padrao.roteamento,
      algoritmoVersao: configExistente.algoritmoVersao || padrao.algoritmoVersao,
      versao: padrao.versao,
      ultimaAtualizacao: Date.now()
    };
  }

  /**
   * Registra telemetria de decisão de IA e atualiza última decisão
   */
  public registrarDecisaoIA(info: { numero: string; source: string; confianca?: number; timestamp: number; top3?: string[]; wrrAtivo?: boolean }): void {
    const estado = this.getEstado();
    const entry = { numero: info.numero, source: info.source as any, confianca: info.confianca, timestamp: info.timestamp, top3: info.top3, wrrAtivo: info.wrrAtivo };
    if (!estado.iaTelemetria) estado.iaTelemetria = [];
    estado.iaTelemetria.push(entry);
    while (estado.iaTelemetria.length > 500) estado.iaTelemetria.shift();
    estado.ultimaDecisaoIA = entry as any;
    this.setEstado(estado);
  }

  /**
   * Atualiza configurações gerais (parcial ou completa)
   */
  public atualizarConfiguracoes(configParcial: Partial<ConfiguracoesGerais>): void {
    this.estado.configuracoes = {
      ...this.estado.configuracoes,
      ...configParcial,
      ultimaAtualizacao: Date.now()
    };
    this.salvarEstado();
  }

  /**
   * Atualiza configurações de tipos de senha
   */
  public atualizarTiposSenha(tipos: ConfiguracaoTipoSenha[]): void {
    this.estado.configuracoes.tiposSenha = tipos;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  /**
   * Atualiza configurações de motivos de retorno
   */
  public atualizarMotivosRetorno(motivos: ConfiguracaoMotivoRetorno[]): void {
    this.estado.configuracoes.motivosRetorno = motivos;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  /**
   * Atualiza configurações de comportamento da fila
   */
  public atualizarComportamentoFila(comportamento: ConfiguracaoComportamentoFila): void {
    this.estado.configuracoes.comportamentoFila = comportamento;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  /**
   * Atualiza configurações de interface
   */
  public atualizarConfigInterface(interfaceConfig: ConfiguracaoInterface): void {
    this.estado.configuracoes.interface = interfaceConfig;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  /**
   * Atualiza tokens de design (visual)
   */
  public atualizarDesignTokens(tokens: ConfiguracaoDesignTokens): void {
    this.estado.configuracoes.designTokens = tokens;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  /**
   * Atualiza configurações de notificações
   */
  public atualizarNotificacoes(notificacoes: ConfiguracaoNotificacoes): void {
    this.estado.configuracoes.notificacoes = notificacoes;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  /**
   * Atualiza configurações de segurança
   */
  public atualizarSeguranca(seguranca: ConfiguracaoSeguranca): void {
    this.estado.configuracoes.seguranca = seguranca;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  /**
   * Atualiza configurações de correções (v3.2)
   */
  public atualizarCorrecoes(correcoes: ConfiguracaoCorrecoes): void {
    this.estado.configuracoes.correcoes = correcoes;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
  }

  public atualizarRoteamento(roteamento: any): void {
    this.estado.configuracoes.roteamento = roteamento;
    this.estado.configuracoes.ultimaAtualizacao = Date.now();
    this.salvarEstado();
    console.log('✅ [StateManager] Configuração de roteamento atualizada:', {
      mlHintEnabled: roteamento.mlHintThresholds?.enabled,
      minScore: roteamento.mlHintThresholds?.minScore,
      maxLatency: roteamento.mlHintThresholds?.maxLatencyMs
    });
  }

  /**
   * Reseta todas as configurações para o padrão
   */
  public resetarConfiguracoes(): void {
    this.estado.configuracoes = getConfigPadraoLocal();
    this.salvarEstado();
    console.log('Configurações resetadas para o padrão');
  }

  /**
   * Retorna as configurações atuais
   */
  public getConfiguracoes(): ConfiguracoesGerais {
    return this.estado.configuracoes;
  }
}
