/**
 * StatisticsAggregator - Agregação de estatísticas de múltiplos dias
 * Consolida dados de períodos e calcula tendências
 * SGFILA v3.0
 */

import type {
  ArquivoEstatisticasDia,
  EstatisticasAvancadas,
  EstatisticasPorHora,
  FiltroPeriodo,
  DetalhesTipo,
  DetalhesGuiche
} from '../../../shared/types';
import { StatisticsPersistence } from './StatisticsPersistence.js';

export interface EstatisticasAgregadas extends EstatisticasAvancadas {
  // Informações do período
  diasAnalisados: number;
  periodoDescricao: string;

  // Comparações e tendências
  tendenciaEmissao: 'crescente' | 'estavel' | 'decrescente';
  tendenciaAtendimento: 'melhorando' | 'estavel' | 'piorando';
  variacaoPercentualEmissao: number;
  variacaoPercentualTempo: number;
}

export class StatisticsAggregator {
  constructor(private persistence: StatisticsPersistence) {}

  /**
   * Formata milissegundos para string legível
   */
  private formatarTempo(ms: number): string {
    if (isNaN(ms) || ms === 0 || !isFinite(ms)) {
      return '0 min';
    }
    if (ms < 60000) return '< 1 min';
    const minutos = Math.round(ms / 60000);
    return `${minutos} min`;
  }

  /**
   * Calcula a data de N dias atrás
   */
  private calcularDataPassada(diasAtras: number): string {
    const data = new Date();
    data.setDate(data.getDate() - diasAtras);
    return data.toISOString().split('T')[0];
  }

  /**
   * Cria filtro de período baseado no tipo
   */
  public criarFiltroPeriodo(tipo: 'dia' | 'semana' | 'mes' | 'personalizado', dataInicio?: string, dataFim?: string): {
    dataInicio: string;
    dataFim: string;
    descricao: string;
  } {
    const hoje = new Date().toISOString().split('T')[0];

    switch (tipo) {
      case 'dia':
        return {
          dataInicio: hoje,
          dataFim: hoje,
          descricao: 'Hoje'
        };

      case 'semana':
        return {
          dataInicio: this.calcularDataPassada(6), // Últimos 7 dias
          dataFim: hoje,
          descricao: 'Últimos 7 dias'
        };

      case 'mes':
        return {
          dataInicio: this.calcularDataPassada(29), // Últimos 30 dias
          dataFim: hoje,
          descricao: 'Últimos 30 dias'
        };

      case 'personalizado':
        if (!dataInicio || !dataFim) {
          throw new Error('Datas de início e fim são obrigatórias para período personalizado');
        }
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return {
          dataInicio,
          dataFim,
          descricao: `${dias} dia${dias > 1 ? 's' : ''} (${dataInicio} a ${dataFim})`
        };

      default:
        throw new Error(`Tipo de período inválido: ${tipo}`);
    }
  }

  /**
   * Agrega estatísticas de múltiplos dias
   */
  public async agregarEstatisticasPeriodo(
    dataInicio: string,
    dataFim: string
  ): Promise<EstatisticasAgregadas | null> {
    // Busca dados do período
    const arquivos = await this.persistence.obterEstatisticasPeriodo(dataInicio, dataFim);

    if (arquivos.length === 0) {
      return null;
    }

    // Extrai todas as estatísticas finais (ignora snapshots para agregação)
    const estatisticas = arquivos
      .map(arq => arq.estatisticasFinais)
      .filter((est): est is EstatisticasAvancadas => est !== null);

    if (estatisticas.length === 0) {
      return null;
    }

    // Calcula totais agregados
    const totalEmitidas = estatisticas.reduce((sum, e) => sum + e.totalEmitidas, 0);
    const totalAtendidas = estatisticas.reduce((sum, e) => sum + e.totalAtendidas, 0);
    const totalNaoCompareceu = estatisticas.reduce((sum, e) => sum + e.totalNaoCompareceu, 0);
    const totalExcluidas = estatisticas.reduce((sum, e) => sum + e.totalExcluidas, 0);

    // Calcula médias ponderadas de tempo
    const somaTemposEsperaMs = estatisticas.reduce(
      (sum, e) => sum + (e.tempoMedioEsperaGeralMs * e.totalAtendidas),
      0
    );
    const tempoMedioEsperaGeralMs = totalAtendidas > 0 ? somaTemposEsperaMs / totalAtendidas : 0;

    const somaTemposAtendimentoMs = estatisticas.reduce(
      (sum, e) => sum + (e.tempoMedioAtendimentoGeralMs * e.totalAtendidas),
      0
    );
    const tempoMedioAtendimentoGeralMs = totalAtendidas > 0 ? somaTemposAtendimentoMs / totalAtendidas : 0;

    // Agrega detalhes por tipo
    const detalhesPorTipo = this.agregarDetalhesPorTipo(estatisticas);

    // Agrega detalhes por guichê
    const detalhesPorGuiche = this.agregarDetalhesPorGuiche(estatisticas);

    // Distribui por hora (soma todas as horas equivalentes)
    const distribuicaoPorHora = this.agregarDistribuicaoPorHora(estatisticas);

    // Calcula picos agregados
    const horasPico = this.identificarPicosAgregados(distribuicaoPorHora);

    // Performance por atendente (média do período)
    const performancePorAtendente = this.agregarPerformancePorAtendente(estatisticas);

    // Devoluções agregadas
    const devolucoes = this.agregarDevolucoes(estatisticas);

    // Qualidade agregada
    const qualidade = this.calcularQualidadeAgregada(
      totalEmitidas,
      totalAtendidas,
      totalNaoCompareceu,
      estatisticas
    );

    // Estatísticas agregadas
    const mediaAtendimentosPorHora = distribuicaoPorHora.reduce((sum, h) => sum + h.atendidas, 0) / 24;
    const picoMaximoAtendimentos = Math.max(...distribuicaoPorHora.map(h => h.emitidas));
    const horaPico = distribuicaoPorHora.find(h => h.emitidas === picoMaximoAtendimentos);
    const horarioPicoMaximo = horaPico ? `${horaPico.hora}h` : '---';

    const menorMovimento = distribuicaoPorHora
      .filter(h => h.emitidas > 0)
      .sort((a, b) => a.emitidas - b.emitidas)[0];
    const periodoMenorMovimento = menorMovimento ? `${menorMovimento.hora}h` : '---';

    // Calcula média de guichês ativos
    const guichesAtivos = Math.round(
      estatisticas.reduce((sum, e) => sum + e.guichesAtivos, 0) / estatisticas.length
    );

    // Calcula tendências
    const tendencias = this.calcularTendencias(estatisticas);

    // Descrição do período
    const diasAnalisados = arquivos.length;
    const periodoDescricao = diasAnalisados === 1
      ? `Dia ${dataInicio}`
      : `${diasAnalisados} dias (${dataInicio} a ${dataFim})`;

    return {
      // Totais
      totalEmitidas,
      totalAtendidas,
      totalNaoCompareceu,
      totalExcluidas,

      // Médias de tempo
      tempoMedioEsperaGeral: this.formatarTempo(tempoMedioEsperaGeralMs),
      tempoMedioEsperaGeralMs,
      tempoMedioAtendimentoGeral: this.formatarTempo(tempoMedioAtendimentoGeralMs),
      tempoMedioAtendimentoGeralMs,

      // Próxima senha não faz sentido em agregação
      proximaSenha: '---',

      // Detalhes
      detalhesPorTipo,
      detalhesPorGuiche,
      guichesAtivos,

      // Metadados
      dataReferencia: dataInicio === dataFim ? dataInicio : `${dataInicio}_${dataFim}`,
      timestampInicio: new Date(dataInicio).getTime(),
      timestampFim: new Date(dataFim + 'T23:59:59').getTime(),
      periodoAtivo: false,
      modoTeste: false,

      // Distribuição temporal
      distribuicaoPorHora,
      horasPico,

      // Performance
      performancePorAtendente,

      // Devoluções
      devolucoes,

      // Qualidade
      qualidade,

      // Projeção não faz sentido em dados históricos
      projecao: null,

      // Agregados
      mediaAtendimentosPorHora,
      picoMaximoAtendimentos,
      horarioPicoMaximo,
      periodoMenorMovimento,

      // Informações específicas de agregação
      diasAnalisados,
      periodoDescricao,
      tendenciaEmissao: tendencias.emissao,
      tendenciaAtendimento: tendencias.atendimento,
      variacaoPercentualEmissao: tendencias.variacaoEmissao,
      variacaoPercentualTempo: tendencias.variacaoTempo
    };
  }

  /**
   * Agrega detalhes por tipo de senha
   */
  private agregarDetalhesPorTipo(estatisticas: EstatisticasAvancadas[]): {
    prioridade: DetalhesTipo;
    contratual: DetalhesTipo;
    normal: DetalhesTipo;
  } {
    const tipos = ['prioridade', 'contratual', 'normal'] as const;
    const resultado: any = {};

    tipos.forEach(tipo => {
      const emitidas = estatisticas.reduce((sum, e) => sum + e.detalhesPorTipo[tipo].emitidas, 0);
      const atendidas = estatisticas.reduce((sum, e) => sum + e.detalhesPorTipo[tipo].atendidas, 0);

      // Média ponderada de tempos
      const somaTemposEspera = estatisticas.reduce(
        (sum, e) => sum + (e.detalhesPorTipo[tipo].tempoMedioEsperaMs * e.detalhesPorTipo[tipo].atendidas),
        0
      );
      const tempoMedioEsperaMs = atendidas > 0 ? somaTemposEspera / atendidas : 0;

      const somaTemposAtendimento = estatisticas.reduce(
        (sum, e) => sum + (e.detalhesPorTipo[tipo].tempoMedioAtendimentoMs * e.detalhesPorTipo[tipo].atendidas),
        0
      );
      const tempoMedioAtendimentoMs = atendidas > 0 ? somaTemposAtendimento / atendidas : 0;

      // Maior e menor tempo do período
      const todosTemposEspera = estatisticas
        .map(e => e.detalhesPorTipo[tipo].maiorTempoEsperaMs)
        .filter(t => t > 0);
      const maiorTempoEsperaMs = todosTemposEspera.length > 0 ? Math.max(...todosTemposEspera) : 0;

      const todosMenoresTempos = estatisticas
        .map(e => e.detalhesPorTipo[tipo].menorTempoEsperaMs)
        .filter(t => t > 0);
      const menorTempoEsperaMs = todosMenoresTempos.length > 0 ? Math.min(...todosMenoresTempos) : 0;

      resultado[tipo] = {
        emitidas,
        atendidas,
        tempoMedioEspera: this.formatarTempo(tempoMedioEsperaMs),
        tempoMedioEsperaMs,
        tempoMedioAtendimento: this.formatarTempo(tempoMedioAtendimentoMs),
        tempoMedioAtendimentoMs,
        maiorTempoEspera: this.formatarTempo(maiorTempoEsperaMs),
        maiorTempoEsperaMs,
        menorTempoEspera: menorTempoEsperaMs > 0 ? this.formatarTempo(menorTempoEsperaMs) : '---',
        menorTempoEsperaMs
      };
    });

    return resultado;
  }

  /**
   * Agrega detalhes por guichê
   */
  private agregarDetalhesPorGuiche(estatisticas: EstatisticasAvancadas[]): {
    [guicheId: string]: DetalhesGuiche;
  } {
    const resultado: { [guicheId: string]: DetalhesGuiche } = {};

    estatisticas.forEach(est => {
      Object.entries(est.detalhesPorGuiche).forEach(([guicheId, dados]) => {
        if (!resultado[guicheId]) {
          resultado[guicheId] = {
            atendidas: 0,
            tempoMedioAtendimento: '0 min',
            tempoMedioAtendimentoMs: 0
          };
        }

        resultado[guicheId].atendidas += dados.atendidas;
      });
    });

    // Calcula média ponderada de tempo por guichê
    Object.keys(resultado).forEach(guicheId => {
      const somaTempos = estatisticas.reduce((sum, est) => {
        const dados = est.detalhesPorGuiche[guicheId];
        return dados ? sum + (dados.tempoMedioAtendimentoMs * dados.atendidas) : sum;
      }, 0);

      const totalAtendidas = resultado[guicheId].atendidas;
      const tempoMedio = totalAtendidas > 0 ? somaTempos / totalAtendidas : 0;

      resultado[guicheId].tempoMedioAtendimento = this.formatarTempo(tempoMedio);
      resultado[guicheId].tempoMedioAtendimentoMs = tempoMedio;
    });

    return resultado;
  }

  /**
   * Agrega distribuição por hora
   */
  private agregarDistribuicaoPorHora(estatisticas: EstatisticasAvancadas[]): EstatisticasPorHora[] {
    const distribuicao: Map<number, EstatisticasPorHora> = new Map();

    // Inicializa todas as horas
    for (let hora = 0; hora < 24; hora++) {
      distribuicao.set(hora, {
        hora,
        emitidas: 0,
        atendidas: 0,
        naoCompareceu: 0,
        tempoMedioEsperaMs: 0,
        tempoMedioAtendimentoMs: 0,
        pico: false
      });
    }

    // Soma dados de todos os dias
    estatisticas.forEach(est => {
      est.distribuicaoPorHora.forEach(horaData => {
        const stats = distribuicao.get(horaData.hora)!;
        stats.emitidas += horaData.emitidas;
        stats.atendidas += horaData.atendidas;
        stats.naoCompareceu += horaData.naoCompareceu;
      });
    });

    // Calcula médias ponderadas de tempo por hora
    distribuicao.forEach((stats, hora) => {
      let somaTemposEspera = 0;
      let somaTemposAtendimento = 0;
      let totalComEspera = 0;
      let totalComAtendimento = 0;

      estatisticas.forEach(est => {
        const horaData = est.distribuicaoPorHora.find(h => h.hora === hora);
        if (horaData) {
          if (horaData.atendidas > 0 && horaData.tempoMedioEsperaMs > 0) {
            somaTemposEspera += horaData.tempoMedioEsperaMs * horaData.atendidas;
            totalComEspera += horaData.atendidas;
          }
          if (horaData.atendidas > 0 && horaData.tempoMedioAtendimentoMs > 0) {
            somaTemposAtendimento += horaData.tempoMedioAtendimentoMs * horaData.atendidas;
            totalComAtendimento += horaData.atendidas;
          }
        }
      });

      stats.tempoMedioEsperaMs = totalComEspera > 0 ? somaTemposEspera / totalComEspera : 0;
      stats.tempoMedioAtendimentoMs = totalComAtendimento > 0 ? somaTemposAtendimento / totalComAtendimento : 0;
    });

    // Identifica picos (acima de 80% do máximo)
    const maxEmitidas = Math.max(...Array.from(distribuicao.values()).map(s => s.emitidas));
    const limitePico = maxEmitidas * 0.8;

    distribuicao.forEach(stats => {
      if (stats.emitidas >= limitePico && stats.emitidas > 0) {
        stats.pico = true;
      }
    });

    return Array.from(distribuicao.values()).sort((a, b) => a.hora - b.hora);
  }

  /**
   * Identifica picos agregados
   */
  private identificarPicosAgregados(distribuicao: EstatisticasPorHora[]) {
    const picos: any[] = [];
    let picoAtual: any = null;

    distribuicao.forEach(stats => {
      if (stats.pico && stats.emitidas > 0) {
        if (!picoAtual) {
          picoAtual = {
            horarioInicio: stats.hora,
            horarioFim: stats.hora,
            quantidadeSenhas: stats.emitidas,
            descricao: `${stats.hora}h`
          };
        } else {
          picoAtual.horarioFim = stats.hora;
          picoAtual.quantidadeSenhas += stats.emitidas;
        }
      } else if (picoAtual !== null) {
        picoAtual.descricao = picoAtual.horarioInicio === picoAtual.horarioFim
          ? `${picoAtual.horarioInicio}h`
          : `${picoAtual.horarioInicio}h - ${picoAtual.horarioFim}h`;
        picos.push(picoAtual);
        picoAtual = null;
      }
    });

    if (picoAtual !== null) {
      picoAtual.descricao = picoAtual.horarioInicio === picoAtual.horarioFim
        ? `${picoAtual.horarioInicio}h`
        : `${picoAtual.horarioInicio}h - ${picoAtual.horarioFim}h`;
      picos.push(picoAtual);
    }

    return picos;
  }

  /**
   * Agrega performance por atendente
   */
  private agregarPerformancePorAtendente(estatisticas: EstatisticasAvancadas[]) {
    const performance: Map<string, any> = new Map();

    estatisticas.forEach(est => {
      est.performancePorAtendente.forEach(perf => {
        if (!performance.has(perf.guicheId)) {
          performance.set(perf.guicheId, {
            guicheId: perf.guicheId,
            guicheNome: perf.guicheNome,
            totalAtendimentos: 0,
            tempoMedioAtendimentoMs: 0,
            tempoTotalAtivoMs: 0,
            eficiencia: 0,
            taxaOcupacao: 0,
            maiorTempoAtendimentoMs: 0,
            menorTempoAtendimentoMs: Infinity
          });
        }

        const stats = performance.get(perf.guicheId)!;
        stats.totalAtendimentos += perf.totalAtendimentos;
        stats.tempoTotalAtivoMs += perf.tempoTotalAtivoMs;

        if (perf.maiorTempoAtendimentoMs > stats.maiorTempoAtendimentoMs) {
          stats.maiorTempoAtendimentoMs = perf.maiorTempoAtendimentoMs;
        }
        if (perf.menorTempoAtendimentoMs < stats.menorTempoAtendimentoMs) {
          stats.menorTempoAtendimentoMs = perf.menorTempoAtendimentoMs;
        }
      });
    });

    // Calcula médias
    performance.forEach(stats => {
      if (stats.totalAtendimentos > 0) {
        stats.tempoMedioAtendimentoMs = stats.tempoTotalAtivoMs / stats.totalAtendimentos;
      }

      // Média de eficiência e taxa de ocupação do período
      const eficiencias = estatisticas
        .map(e => e.performancePorAtendente.find(p => p.guicheId === stats.guicheId))
        .filter(p => p !== undefined)
        .map(p => p!.eficiencia);

      stats.eficiencia = eficiencias.length > 0
        ? eficiencias.reduce((sum, e) => sum + e, 0) / eficiencias.length
        : 0;

      const taxas = estatisticas
        .map(e => e.performancePorAtendente.find(p => p.guicheId === stats.guicheId))
        .filter(p => p !== undefined)
        .map(p => p!.taxaOcupacao);

      stats.taxaOcupacao = taxas.length > 0
        ? taxas.reduce((sum, t) => sum + t, 0) / taxas.length
        : 0;

      if (stats.menorTempoAtendimentoMs === Infinity) {
        stats.menorTempoAtendimentoMs = 0;
      }
    });

    return Array.from(performance.values()).sort((a, b) => b.totalAtendimentos - a.totalAtendimentos);
  }

  /**
   * Agrega devoluções
   */
  private agregarDevolucoes(estatisticas: EstatisticasAvancadas[]) {
    const totalDevolucoes = estatisticas.reduce((sum, e) => sum + e.devolucoes.totalDevolucoes, 0);
    const porMotivo: any = {};

    // Agrega por motivo
    estatisticas.forEach(est => {
      Object.entries(est.devolucoes.porMotivo).forEach(([motivo, dados]) => {
        if (!porMotivo[motivo]) {
          porMotivo[motivo] = { quantidade: 0, percentual: 0 };
        }
        porMotivo[motivo].quantidade += dados.quantidade;
      });
    });

    // Recalcula percentuais
    Object.keys(porMotivo).forEach(motivo => {
      porMotivo[motivo].percentual = totalDevolucoes > 0
        ? (porMotivo[motivo].quantidade / totalDevolucoes) * 100
        : 0;
    });

    // Média ponderada de tempo até retorno
    const somaTemposRetorno = estatisticas.reduce(
      (sum, e) => sum + (e.devolucoes.tempoMedioAteRetornoMs * e.devolucoes.totalDevolucoes),
      0
    );
    const tempoMedioAteRetornoMs = totalDevolucoes > 0 ? somaTemposRetorno / totalDevolucoes : 0;

    return {
      totalDevolucoes,
      porMotivo,
      tempoMedioAteRetornoMs
    };
  }

  /**
   * Calcula qualidade agregada
   */
  private calcularQualidadeAgregada(
    totalEmitidas: number,
    totalAtendidas: number,
    totalNaoCompareceu: number,
    estatisticas: EstatisticasAvancadas[]
  ) {
    const totalDevolucoes = estatisticas.reduce((sum, e) => sum + e.devolucoes.totalDevolucoes, 0);

    const taxaAtendimento = totalEmitidas > 0 ? (totalAtendidas / totalEmitidas) * 100 : 0;
    const taxaNaoComparecimento = totalEmitidas > 0 ? (totalNaoCompareceu / totalEmitidas) * 100 : 0;
    const taxaDevolucao = totalEmitidas > 0 ? (totalDevolucoes / totalEmitidas) * 100 : 0;

    // Média de eficiência geral
    const eficienciaGeral = estatisticas.reduce((sum, e) => sum + e.qualidade.eficienciaGeral, 0) / estatisticas.length;

    // Média ponderada de tempo ocioso
    const somaTemposOciosos = estatisticas.reduce(
      (sum, e) => sum + (e.qualidade.tempoOciosoMedioMs * e.totalAtendidas),
      0
    );
    const tempoOciosoMedioMs = totalAtendidas > 0 ? somaTemposOciosos / totalAtendidas : 0;

    return {
      taxaAtendimento,
      taxaNaoComparecimento,
      taxaDevolucao,
      eficienciaGeral,
      tempoOciosoMedioMs
    };
  }

  /**
   * Calcula tendências comparando primeira e última metade do período
   */
  private calcularTendencias(estatisticas: EstatisticasAvancadas[]): {
    emissao: 'crescente' | 'estavel' | 'decrescente';
    atendimento: 'melhorando' | 'estavel' | 'piorando';
    variacaoEmissao: number;
    variacaoTempo: number;
  } {
    if (estatisticas.length < 2) {
      return {
        emissao: 'estavel',
        atendimento: 'estavel',
        variacaoEmissao: 0,
        variacaoTempo: 0
      };
    }

    const metade = Math.floor(estatisticas.length / 2);
    const primeira = estatisticas.slice(0, metade);
    const segunda = estatisticas.slice(metade);

    // Média de emissões
    const mediaEmissaoPrimeira = primeira.reduce((sum, e) => sum + e.totalEmitidas, 0) / primeira.length;
    const mediaEmissaoSegunda = segunda.reduce((sum, e) => sum + e.totalEmitidas, 0) / segunda.length;
    const variacaoEmissao = mediaEmissaoPrimeira > 0
      ? ((mediaEmissaoSegunda - mediaEmissaoPrimeira) / mediaEmissaoPrimeira) * 100
      : 0;

    // Média de tempo de espera
    const mediaTempoPrimeira = primeira.reduce((sum, e) => sum + e.tempoMedioEsperaGeralMs, 0) / primeira.length;
    const mediaTempoSegunda = segunda.reduce((sum, e) => sum + e.tempoMedioEsperaGeralMs, 0) / segunda.length;
    const variacaoTempo = mediaTempoPrimeira > 0
      ? ((mediaTempoSegunda - mediaTempoPrimeira) / mediaTempoPrimeira) * 100
      : 0;

    // Determina tendências (margem de 10% para considerar estável)
    const emissao = variacaoEmissao > 10 ? 'crescente'
      : variacaoEmissao < -10 ? 'decrescente'
      : 'estavel';

    const atendimento = variacaoTempo < -10 ? 'melhorando'  // Tempo menor = melhor
      : variacaoTempo > 10 ? 'piorando'
      : 'estavel';

    return {
      emissao,
      atendimento,
      variacaoEmissao: Math.round(variacaoEmissao * 10) / 10,
      variacaoTempo: Math.round(variacaoTempo * 10) / 10
    };
  }
}
