/**
 * StatisticsService - Cálculo de estatísticas do sistema
 * SGFILA v3.0
 */

import type { EstadoSistema, Estatisticas, Senha, TipoSenha, DetalhesTipo, DetalhesGuiche } from '../../../shared/types';

export class StatisticsService {
  /**
   * Formata milissegundos para string legível
   */
  private static formatarTempo(ms: number): string {
    if (isNaN(ms) || ms === 0 || !isFinite(ms)) {
      return '0 min';
    }
    if (ms < 60000) return '< 1 min';
    const minutos = Math.round(ms / 60000);
    return `${minutos} min`;
  }

  /**
   * Calcula a próxima senha baseado na lógica de proporção
   */
  private static calcularProximaSenha(estado: EstadoSistema): string {
    const senhasEspera = estado.senhas
      .filter(s => s.status === 'espera')
      .sort((a, b) => a.timestamp - b.timestamp);

    if (senhasEspera.length === 0) return '---';

    const prioritarias = senhasEspera.filter(s => s.tipo === 'prioridade');
    const contratuais = senhasEspera.filter(s => s.tipo === 'contratual');
    const normais = senhasEspera.filter(s => s.tipo === 'normal');

    const contadorP = estado.contadorPrioridadeDesdeUltimaNormal;
    const contadorC = estado.contadorContratualDesdeUltimaNormal;
    const proporcaoP = estado.proporcaoPrioridade;
    const proporcaoC = estado.proporcaoContratual;

    // Lógica de seleção
    if (prioritarias.length > 0 && contadorP < proporcaoP) {
      return prioritarias[0].numero;
    }
    if (contratuais.length > 0 && contadorC < proporcaoC) {
      return contratuais[0].numero;
    }
    if (normais.length > 0) {
      return normais[0].numero;
    }
    if (prioritarias.length > 0) {
      return prioritarias[0].numero;
    }
    if (contratuais.length > 0) {
      return contratuais[0].numero;
    }

    return '---';
  }

  /**
   * Calcula estatísticas por tipo de senha
   */
  private static calcularDetalhesPorTipo(senhas: Senha[], tipo: TipoSenha): DetalhesTipo {
    const senhasTipo = senhas.filter(s => s.tipo === tipo);
    const atendidas = senhasTipo.filter(s => s.status === 'atendida');

    const emitidas = senhasTipo.length;
    const numAtendidas = atendidas.length;

    // Tempo de espera
    const temposEspera = atendidas
      .map(s => s.tempoEspera)
      .filter(t => t > 0);

    let tempoMedioEsperaMs = 0;
    let maiorTempoEsperaMs = 0;
    let menorTempoEsperaMs = Infinity;

    if (temposEspera.length > 0) {
      tempoMedioEsperaMs = temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length;
      maiorTempoEsperaMs = Math.max(...temposEspera);
      menorTempoEsperaMs = Math.min(...temposEspera);
    }

    // Tempo de atendimento
    const temposAtendimento = atendidas
      .map(s => s.tempoAtendimento)
      .filter(t => t > 0);

    let tempoMedioAtendimentoMs = 0;
    if (temposAtendimento.length > 0) {
      tempoMedioAtendimentoMs = temposAtendimento.reduce((a, b) => a + b, 0) / temposAtendimento.length;
    }

    return {
      emitidas,
      atendidas: numAtendidas,
      tempoMedioEspera: this.formatarTempo(tempoMedioEsperaMs),
      tempoMedioEsperaMs,
      tempoMedioAtendimento: this.formatarTempo(tempoMedioAtendimentoMs),
      tempoMedioAtendimentoMs,
      maiorTempoEspera: this.formatarTempo(maiorTempoEsperaMs),
      maiorTempoEsperaMs,
      menorTempoEspera: menorTempoEsperaMs === Infinity ? '---' : this.formatarTempo(menorTempoEsperaMs),
      menorTempoEsperaMs: menorTempoEsperaMs === Infinity ? 0 : menorTempoEsperaMs
    };
  }

  /**
   * Calcula estatísticas por guichê
   */
  private static calcularDetalhesPorGuiche(senhas: Senha[]): { [guiche: string]: DetalhesGuiche } {
    const detalhes: { [guiche: string]: DetalhesGuiche } = {};

    senhas
      .filter(s => s.status === 'atendida' && s.guicheAtendendo)
      .forEach(senha => {
        const guiche = senha.guicheAtendendo!;

        if (!detalhes[guiche]) {
          detalhes[guiche] = {
            atendidas: 0,
            tempoMedioAtendimento: '0 min',
            tempoMedioAtendimentoMs: 0
          };
        }

        detalhes[guiche].atendidas++;
      });

    // Calcula tempo médio de atendimento por guichê
    Object.keys(detalhes).forEach(guiche => {
      const senhasGuiche = senhas.filter(
        s => s.status === 'atendida' && s.guicheAtendendo === guiche && s.tempoAtendimento > 0
      );

      if (senhasGuiche.length > 0) {
        const tempoMedio = senhasGuiche.reduce((sum, s) => sum + s.tempoAtendimento, 0) / senhasGuiche.length;
        detalhes[guiche].tempoMedioAtendimento = this.formatarTempo(tempoMedio);
        detalhes[guiche].tempoMedioAtendimentoMs = tempoMedio;
      }
    });

    return detalhes;
  }

  /**
   * Calcula todas as estatísticas do sistema
   */
  public static calcularEstatisticas(estado: EstadoSistema): Estatisticas {
    const senhas = estado.senhas;

    // Totais gerais
    const totalEmitidas = senhas.length;
    const totalAtendidas = senhas.filter(s => s.status === 'atendida').length;
    const totalNaoCompareceu = senhas.filter(s => s.status === 'nao_compareceu').length;
    const totalExcluidas = senhas.filter(s => s.status === 'excluida').length;

    // Tempo médio de espera geral
    const senhasAtendidas = senhas.filter(s => s.status === 'atendida');
    let tempoMedioEsperaGeralMs = 0;
    if (senhasAtendidas.length > 0) {
      const temposEspera = senhasAtendidas.map(s => s.tempoEspera).filter(t => t > 0);
      if (temposEspera.length > 0) {
        tempoMedioEsperaGeralMs = temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length;
      }
    }

    // Tempo médio de atendimento geral
    let tempoMedioAtendimentoGeralMs = 0;
    if (senhasAtendidas.length > 0) {
      const temposAtendimento = senhasAtendidas.map(s => s.tempoAtendimento).filter(t => t > 0);
      if (temposAtendimento.length > 0) {
        tempoMedioAtendimentoGeralMs = temposAtendimento.reduce((a, b) => a + b, 0) / temposAtendimento.length;
      }
    }

    // Próxima senha
    const proximaSenha = this.calcularProximaSenha(estado);

    // Detalhes por tipo
    const detalhesPorTipo = {
      prioridade: this.calcularDetalhesPorTipo(senhas, 'prioridade'),
      contratual: this.calcularDetalhesPorTipo(senhas, 'contratual'),
      normal: this.calcularDetalhesPorTipo(senhas, 'normal')
    };

    // Detalhes por guichê
    const detalhesPorGuiche = this.calcularDetalhesPorGuiche(senhas);

    // Número de guichês ativos
    const guichesAtivos = estado.guichesConfigurados.filter(g => g.ativo).length;

    return {
      totalEmitidas,
      totalAtendidas,
      totalNaoCompareceu,
      totalExcluidas,
      tempoMedioEsperaGeral: this.formatarTempo(tempoMedioEsperaGeralMs),
      tempoMedioEsperaGeralMs,
      tempoMedioAtendimentoGeral: this.formatarTempo(tempoMedioAtendimentoGeralMs),
      tempoMedioAtendimentoGeralMs,
      proximaSenha,
      detalhesPorTipo,
      detalhesPorGuiche,
      guichesAtivos: guichesAtivos || 1
    };
  }
}
