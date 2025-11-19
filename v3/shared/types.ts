/**
 * Tipos compartilhados entre cliente e servidor
 * Sistema de Gerenciamento de Filas - SGFILA v3.0
 */

// ============================================
// TIPOS DE SENHA
// ============================================

export type TipoSenha = 'prioridade' | 'contratual' | 'normal';
export type StatusSenha = 'espera' | 'chamada' | 'atendida' | 'nao_compareceu' | 'excluida';
export type MotivoRetorno = 'retorno_impressao' | 'erro_operacional' | 'ausente_retornou' | 'reabertura_atendimento';

export interface RegistroDevolucao {
  timestamp: number;
  motivo: MotivoRetorno;
  timestampHistorico: number;
  tempoDecorridoMinutos: number;
  posicaoAtribuida?: number;
}

export interface Senha {
  numero: string;
  tipo: TipoSenha;
  subtipo: string;
  timestamp: number;
  status: StatusSenha;
  descricao?: string;

  // Campos para senhas em atendimento
  guicheAtendendo?: string;
  guicheNome?: string;
  chamadaTimestamp?: number;
  finalizadoTimestamp?: number;

  // Métricas de tempo
  tempoEspera: number;
  tempoAtendimento: number;

  // Campos para controle de devoluções
  posicaoOriginal?: number;
  historicoDevolucoes?: RegistroDevolucao[];
}

// ============================================
// GUICHÊS
// ============================================

export interface Guiche {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface AtendimentoAtual {
  [guicheId: string]: Senha;
}

// ============================================
// ESTADO DO SISTEMA
// ============================================

export interface EstadoSistema {
  senhas: Senha[];
  senhasHoje: number;
  contadorPrioridade: number;
  contadorContratual: number;
  contadorNormal: number;
  contadorPrioridadeDesdeUltimaNormal: number;
  contadorContratualDesdeUltimaNormal: number;
  proporcaoPrioridade: number;
  proporcaoContratual: number;
  atendimentosAtuais: AtendimentoAtual;
  guichesConfigurados: Guiche[];
  dataReinicioSistema: string;
  configuracoes: ConfiguracoesGerais;
}

// ============================================
// ESTATÍSTICAS BÁSICAS
// ============================================

export interface DetalhesTipo {
  emitidas: number;
  atendidas: number;
  tempoMedioEspera: string;
  tempoMedioEsperaMs: number;
  tempoMedioAtendimento: string;
  tempoMedioAtendimentoMs: number;
  maiorTempoEspera: string;
  maiorTempoEsperaMs: number;
  menorTempoEspera: string;
  menorTempoEsperaMs: number;
}

export interface DetalhesGuiche {
  atendidas: number;
  tempoMedioAtendimento: string;
  tempoMedioAtendimentoMs: number;
}

export interface Estatisticas {
  totalEmitidas: number;
  totalAtendidas: number;
  totalNaoCompareceu: number;
  totalExcluidas: number;
  tempoMedioEsperaGeral: string;
  tempoMedioEsperaGeralMs: number;
  tempoMedioAtendimentoGeral: string;
  tempoMedioAtendimentoGeralMs: number;
  proximaSenha: string;
  detalhesPorTipo: {
    prioridade: DetalhesTipo;
    contratual: DetalhesTipo;
    normal: DetalhesTipo;
  };
  detalhesPorGuiche: {
    [guicheId: string]: DetalhesGuiche;
  };
  guichesAtivos: number;
}

// ============================================
// ESTATÍSTICAS AVANÇADAS
// ============================================

export interface FiltroPeriodo {
  inicio: number; // timestamp
  fim: number; // timestamp
  tipo: 'hora' | 'dia' | 'semana' | 'mes' | 'personalizado';
}

export interface EstatisticasPorHora {
  hora: number; // 0-23
  emitidas: number;
  atendidas: number;
  naoCompareceu: number;
  tempoMedioEsperaMs: number;
  tempoMedioAtendimentoMs: number;
  pico: boolean; // marca horários de pico
}

export interface EstatisticasPorAtendente {
  guicheId: string;
  guicheNome: string;
  totalAtendimentos: number;
  tempoMedioAtendimentoMs: number;
  tempoTotalAtivoMs: number; // tempo que ficou com senhas em atendimento
  eficiencia: number; // atendimentos por hora
  taxaOcupacao: number; // % do tempo ocupado
  maiorTempoAtendimentoMs: number;
  menorTempoAtendimentoMs: number;
}

export interface EstatisticasDevolucoes {
  totalDevolucoes: number;
  porMotivo: {
    [motivo: string]: {
      quantidade: number;
      percentual: number;
    };
  };
  tempoMedioAteRetornoMs: number;
}

export interface EstatisticasQualidade {
  taxaAtendimento: number; // % de senhas atendidas vs emitidas
  taxaNaoComparecimento: number; // % de não comparecimento
  taxaDevolucao: number; // % de devoluções
  eficienciaGeral: number; // atendimentos por hora (todos os guichês)
  tempoOciosoMedioMs: number; // tempo médio entre atendimentos
}

export interface PicoAtendimento {
  horarioInicio: number; // hora 0-23
  horarioFim: number;
  quantidadeSenhas: number;
  descricao: string;
}

export interface ProjecaoAtendimento {
  senhasRestantes: number;
  tempoEstimadoFinalizacaoMs: number;
  horarioEstimadoFinalizacao: string;
  baseadoEm: 'tempo-medio' | 'tempo-atual' | 'historico';
}

export interface EstatisticasAvancadas extends Estatisticas {
  // Metadados
  dataReferencia: string; // YYYY-MM-DD (horário de Brasília)
  timestampInicio: number;
  timestampFim: number;
  periodoAtivo: boolean; // false se for histórico
  modoTeste: boolean; // identifica se são dados de teste

  // Distribuição temporal
  distribuicaoPorHora: EstatisticasPorHora[];
  horasPico: PicoAtendimento[];

  // Performance por atendente
  performancePorAtendente: EstatisticasPorAtendente[];

  // Devoluções
  devolucoes: EstatisticasDevolucoes;

  // Qualidade do serviço
  qualidade: EstatisticasQualidade;

  // Projeções
  projecao: ProjecaoAtendimento | null;

  // Estatísticas agregadas
  mediaAtendimentosPorHora: number;
  picoMaximoAtendimentos: number;
  horarioPicoMaximo: string;
  periodoMenorMovimento: string;
}

export interface EstatisticasSnapshot {
  timestamp: number; // momento do snapshot
  hora: number; // hora de Brasília 0-23
  estatisticas: EstatisticasAvancadas;
}

export interface ArquivoEstatisticasDia {
  data: string; // YYYY-MM-DD (horário de Brasília)
  modoTeste: boolean;
  criadoEm: number;
  atualizadoEm: number;
  snapshots: EstatisticasSnapshot[]; // snapshot a cada hora ou em eventos importantes
  estatisticasFinais: EstatisticasAvancadas | null; // estatísticas do dia completo (preenchido ao final)
}

// ============================================
// EVENTOS SOCKET.IO
// ============================================

export interface ServerToClientEvents {
  estadoAtualizado: (payload: { estado: EstadoSistema; estatisticas: Estatisticas }) => void;
  beep: (dados: { times: number; tipo: 'emissao' | 'chamada'; numero?: string }) => void;
  sistemaReiniciado: () => void;
  erroOperacao: (dados: { mensagem: string; tipo: string }) => void;
}

export interface ClientToServerEvents {
  emitirSenha: (dados: { tipo: TipoSenha; subtipo: string }) => void;
  chamarSenha: (dados: { guicheId: string }) => void;
  chamarSenhaEspecifica: (dados: { guicheId: string; numeroSenha: string }) => void;
  finalizarAtendimento: (dados: { guicheId: string }) => void;
  excluirSenha: (dados: { numeroSenha: string }) => void;
  excluirAtendimento: (dados: { numeroSenha: string }) => void;
  devolverSenha: (dados: { numeroSenha: string }) => void;
  devolverSenhaComMotivo: (dados: { numeroSenha: string; motivo: MotivoRetorno }) => void;
  atualizarDescricao: (dados: { numeroSenha: string; descricao: string }) => void;
  atualizarProporcao: (novaProporcao: number) => void;
  atualizarProporcaoContratual: (novaProporcao: number) => void;
  atualizarGuichesGlobais: (guiches: Guiche[]) => void;
  reiniciarSistema: () => void;

  // Novos eventos para configurações
  atualizarConfiguracoes: (configuracoes: Partial<ConfiguracoesGerais>) => void;
  atualizarTiposSenha: (tipos: ConfiguracaoTipoSenha[]) => void;
  atualizarMotivosRetorno: (motivos: ConfiguracaoMotivoRetorno[]) => void;
  atualizarComportamentoFila: (comportamento: ConfiguracaoComportamentoFila) => void;
  atualizarConfigInterface: (interfaceConfig: ConfiguracaoInterface) => void;
  atualizarNotificacoes: (notificacoes: ConfiguracaoNotificacoes) => void;
  atualizarSeguranca: (seguranca: ConfiguracaoSeguranca) => void;
  resetarConfiguracoes: () => void;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export type FiltroFila = 'emissao' | 'automatica' | 'tipo';

export interface ConfiguracaoGuiche {
  guichesExibicao: string[]; // Array de IDs de guichês
}

export type TabType = 'stats' | 'history' | 'config';
export type SubTabStats = 'geral' | 'ticket';
export type SubTabConfig = 'guiches' | 'proporcao' | 'tipos' | 'retornos' | 'comportamento' | 'interface' | 'notificacoes';

export interface ModalData {
  show: boolean;
  data?: any;
}

// ============================================
// SISTEMA DE CONFIGURAÇÕES COMPLETO
// ============================================

export interface ConfiguracaoTipoSenha {
  id: TipoSenha;
  nome: string;
  nomeCompleto: string;
  prefixo: string;
  cor: string;
  corFundo: string;
  icone: string;
  ativo: boolean;
  ordem: number;
  subtipos: string[];
}

export interface ConfiguracaoMotivoRetorno {
  id: MotivoRetorno;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  prazoMinutos: number | null; // null = sem prazo
  posicionamentoFila: 'inicio' | 'meio' | 'fim' | 'original';
  ativo: boolean;
}

export interface ConfiguracaoComportamentoFila {
  algoritmo: 'proporcao' | 'round_robin' | 'fifo';
  permitirPularSenhas: boolean;
  autoFinalizarMinutos: number | null; // null = desativado
  chamarProximaAutomatica: boolean;
  tempoEsperaMaximoMinutos: number | null; // null = sem limite
  alertarTempoEsperaExcedido: boolean;
}

export interface ConfiguracaoInterface {
  tema: 'claro' | 'escuro' | 'auto';
  tamanhoFonteSenhas: 'pequeno' | 'medio' | 'grande' | 'extra-grande';
  formatoNumeroSenha: 'com-hifen' | 'sem-hifen' | 'apenas-numero';
  mostrarDescricaoSenha: boolean;
  mostrarTempoEspera: boolean;
  mostrarTempoAtendimento: boolean;
  ordenacaoFilaPadrao: 'emissao' | 'tipo' | 'tempo-espera';
  exibirIconesPrioridade: boolean;
}

export interface ConfiguracaoNotificacoes {
  somAtivo: boolean;
  volumeSom: number; // 0-100
  beepsEmissao: number;
  beepsChamada: number;
  alertaFilaCheia: boolean;
  limiteFilaCheia: number;
  alertaGuicheInativo: boolean;
  tempoInativoMinutos: number;
}

export interface ConfiguracaoEstatisticas {
  metricas: {
    totalEmitidas: boolean;
    totalAtendidas: boolean;
    tempoMedioEspera: boolean;
    tempoMedioAtendimento: boolean;
    taxaNaoComparecimento: boolean;
    produtividadePorGuiche: boolean;
  };
  periodoAnalise: 'dia' | 'semana' | 'mes' | 'personalizado';
  atualizacaoAutomatica: boolean;
  intervaloAtualizacaoSegundos: number;
}

export interface ConfiguracaoSeguranca {
  senhaAdmin: string | null;
  exigirConfirmacaoExclusao: boolean;
  exigirConfirmacaoReinicio: boolean;
  logAuditoria: boolean;
  backupAutomatico: boolean;
  intervaloBackupMinutos: number;
}

export interface ConfiguracoesGerais {
  tiposSenha: ConfiguracaoTipoSenha[];
  motivosRetorno: ConfiguracaoMotivoRetorno[];
  comportamentoFila: ConfiguracaoComportamentoFila;
  interface: ConfiguracaoInterface;
  notificacoes: ConfiguracaoNotificacoes;
  estatisticas: ConfiguracaoEstatisticas;
  seguranca: ConfiguracaoSeguranca;
  versao: string;
  ultimaAtualizacao: number;
}

// Função para obter valores padrão para configurações
export function getConfigPadrao(): ConfiguracoesGerais {
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
    versao: '3.0.0',
    ultimaAtualizacao: Date.now()
  };
}
