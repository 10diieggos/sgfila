/**
 * Tipos compartilhados entre cliente e servidor
 * Sistema de Gerenciamento de Filas - SGFILA v3.0
 */

// ============================================
// TIPOS DE SENHA
// ============================================

export type TipoSenha = 'prioridade' | 'contratual' | 'normal';
export type StatusSenha = 'espera' | 'chamada' | 'atendida' | 'nao_compareceu' | 'excluida';

export interface Senha {
  numero: string;
  tipo: TipoSenha;
  subtipo: string;
  timestamp: number;
  status: StatusSenha;
  descricao?: string;

  // Campos para senhas em atendimento
  guicheAtendendo?: string;
  chamadaTimestamp?: number;
  finalizadoTimestamp?: number;

  // Métricas de tempo
  tempoEspera: number;
  tempoAtendimento: number;
}

// ============================================
// GUICHÊS
// ============================================

export interface Guiche {
  nome: string;
  ativo: boolean;
}

export interface AtendimentoAtual {
  [guicheNome: string]: Senha;
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
}

// ============================================
// ESTATÍSTICAS
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
    [guicheNome: string]: DetalhesGuiche;
  };
  guichesAtivos: number;
}

// ============================================
// EVENTOS SOCKET.IO
// ============================================

export interface ServerToClientEvents {
  estadoAtualizado: (payload: { estado: EstadoSistema; estatisticas: Estatisticas }) => void;
  beep: (dados: { times: number; tipo: 'emissao' | 'chamada'; numero?: string }) => void;
  sistemaReiniciado: () => void;
}

export interface ClientToServerEvents {
  emitirSenha: (dados: { tipo: TipoSenha; subtipo: string }) => void;
  chamarSenha: (dados: { guicheId: string }) => void;
  chamarSenhaEspecifica: (dados: { guicheId: string; numeroSenha: string }) => void;
  finalizarAtendimento: (dados: { guicheId: string }) => void;
  excluirSenha: (dados: { numeroSenha: string }) => void;
  excluirAtendimento: (dados: { numeroSenha: string }) => void;
  devolverSenha: (dados: { numeroSenha: string }) => void;
  atualizarDescricao: (dados: { numeroSenha: string; descricao: string }) => void;
  atualizarProporcao: (novaProporcao: number) => void;
  atualizarProporcaoContratual: (novaProporcao: number) => void;
  atualizarGuichesGlobais: (guiches: Guiche[]) => void;
  reiniciarSistema: () => void;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export type FiltroFila = 'emissao' | 'automatica' | 'tipo';

export interface ConfiguracaoGuiche {
  guichesExibicao: string[];
}

export type TabType = 'stats' | 'history' | 'config';
export type SubTabStats = 'geral' | 'ticket';
export type SubTabConfig = 'guiches' | 'proporcao';

export interface ModalData {
  show: boolean;
  data?: any;
}
