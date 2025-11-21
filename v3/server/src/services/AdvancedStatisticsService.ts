/**
 * AdvancedStatisticsService - Cálculo de estatísticas avançadas
 * Expande o StatisticsService com métricas detalhadas, distribuição temporal e projeções
 * SGFILA v3.0
 */

import type {
  EstadoSistema,
  EstatisticasAvancadas,
  EstatisticasPorHora,
  EstatisticasPorAtendente,
  EstatisticasDevolucoes,
  EstatisticasQualidade,
  PicoAtendimento,
  ProjecaoAtendimento,
  Senha,
  FiltroPeriodo
} from '../../../shared/types';
import { StatisticsService } from './StatisticsService.js';
import {
  getDataFormatadaBrasilia,
  getInicioHojeBrasilia,
  getFimHojeBrasilia,
  timestampParaHoraBrasilia,
  getHorarioFormatadoBrasilia
} from '../utils/timezone.js';

export class AdvancedStatisticsService {
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
   * Filtra senhas por período
   */
  private static filtrarPorPeriodo(senhas: Senha[], periodo?: FiltroPeriodo): Senha[] {
    if (!periodo) {
      return senhas;
    }

    return senhas.filter(s => s.timestamp >= periodo.inicio && s.timestamp <= periodo.fim);
  }

  /**
   * Calcula distribuição de senhas por hora
   */
  private static calcularDistribuicaoPorHora(senhas: Senha[]): EstatisticasPorHora[] {
    const distribuicao: Map<number, EstatisticasPorHora> = new Map();

    // Inicializa todas as horas (0-23)
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

    // Agrupa senhas por hora de emissão
    senhas.forEach(senha => {
      const hora = timestampParaHoraBrasilia(senha.timestamp);
      const stats = distribuicao.get(hora)!;

      stats.emitidas++;

      if (senha.status === 'atendida') {
        stats.atendidas++;
      } else if (senha.status === 'nao_compareceu') {
        stats.naoCompareceu++;
      }
    });

    // Calcula tempos médios por hora
    distribuicao.forEach((stats, hora) => {
      const senhasHora = senhas.filter(s => timestampParaHoraBrasilia(s.timestamp) === hora);
      const atendidas = senhasHora.filter(s => s.status === 'atendida');

      if (atendidas.length > 0) {
        const temposEspera = atendidas.map(s => s.tempoEspera).filter(t => t > 0);
        const temposAtendimento = atendidas.map(s => s.tempoAtendimento).filter(t => t > 0);

        if (temposEspera.length > 0) {
          stats.tempoMedioEsperaMs = temposEspera.reduce((a, b) => a + b, 0) / temposEspera.length;
        }
        if (temposAtendimento.length > 0) {
          stats.tempoMedioAtendimentoMs = temposAtendimento.reduce((a, b) => a + b, 0) / temposAtendimento.length;
        }
      }
    });

    // Identifica horários de pico (acima de 80% do máximo)
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
   * Identifica períodos de pico detalhados
   */
  private static identificarHorasPico(distribuicao: EstatisticasPorHora[]): PicoAtendimento[] {
    const picos: PicoAtendimento[] = [];
    let picoAtual: PicoAtendimento | null = null;

    distribuicao.forEach(stats => {
      if (stats.pico && stats.emitidas > 0) {
        if (!picoAtual) {
          // Inicia novo pico
          picoAtual = {
            horarioInicio: stats.hora,
            horarioFim: stats.hora,
            quantidadeSenhas: stats.emitidas,
            descricao: `${stats.hora}h`
          };
        } else {
          // Estende pico existente
          picoAtual.horarioFim = stats.hora;
          picoAtual.quantidadeSenhas += stats.emitidas;
        }
      } else if (picoAtual !== null) {
        // Finaliza pico
        const pico = picoAtual as PicoAtendimento;
        pico.descricao = pico.horarioInicio === pico.horarioFim
          ? `${pico.horarioInicio}h`
          : `${pico.horarioInicio}h - ${pico.horarioFim}h`;
        picos.push(pico);
        picoAtual = null;
      }
    });

    // Finaliza último pico se existir
    if (picoAtual !== null) {
      const pico = picoAtual as PicoAtendimento;
      pico.descricao = pico.horarioInicio === pico.horarioFim
        ? `${pico.horarioInicio}h`
        : `${pico.horarioInicio}h - ${pico.horarioFim}h`;
      picos.push(pico);
    }

    return picos;
  }

  /**
   * Calcula performance por atendente/guichê
   */
  private static calcularPerformancePorAtendente(
    senhas: Senha[],
    estado: EstadoSistema
  ): EstatisticasPorAtendente[] {
    const performance: Map<string, EstatisticasPorAtendente> = new Map();

    // Processa todas as senhas atendidas
    senhas
      .filter(s => s.status === 'atendida' && s.guicheAtendendo)
      .forEach(senha => {
        const guicheId = senha.guicheAtendendo!;
        const guiche = estado.guichesConfigurados.find(g => g.id === guicheId);

        if (!performance.has(guicheId)) {
          performance.set(guicheId, {
            guicheId,
            guicheNome: guiche?.nome || guicheId,
            totalAtendimentos: 0,
            tempoMedioAtendimentoMs: 0,
            tempoTotalAtivoMs: 0,
            eficiencia: 0,
            taxaOcupacao: 0,
            maiorTempoAtendimentoMs: 0,
            menorTempoAtendimentoMs: Infinity
          });
        }

        const stats = performance.get(guicheId)!;
        stats.totalAtendimentos++;
        stats.tempoTotalAtivoMs += senha.tempoAtendimento;

        if (senha.tempoAtendimento > stats.maiorTempoAtendimentoMs) {
          stats.maiorTempoAtendimentoMs = senha.tempoAtendimento;
        }
        if (senha.tempoAtendimento < stats.menorTempoAtendimentoMs && senha.tempoAtendimento > 0) {
          stats.menorTempoAtendimentoMs = senha.tempoAtendimento;
        }
      });

    // Calcula métricas derivadas
    const inicioDia = getInicioHojeBrasilia();
    const agora = Date.now();
    const tempoDecorridoMs = agora - inicioDia;
    const horasDecorridas = tempoDecorridoMs / (1000 * 60 * 60);

    performance.forEach(stats => {
      // Tempo médio de atendimento
      if (stats.totalAtendimentos > 0) {
        stats.tempoMedioAtendimentoMs = stats.tempoTotalAtivoMs / stats.totalAtendimentos;
      }

      // Eficiência (atendimentos por hora)
      if (horasDecorridas > 0) {
        stats.eficiencia = stats.totalAtendimentos / horasDecorridas;
      }

      // Taxa de ocupação (% do tempo ativo)
      if (tempoDecorridoMs > 0) {
        stats.taxaOcupacao = (stats.tempoTotalAtivoMs / tempoDecorridoMs) * 100;
      }

      // Corrige menor tempo se nenhum atendimento foi registrado
      if (stats.menorTempoAtendimentoMs === Infinity) {
        stats.menorTempoAtendimentoMs = 0;
      }
    });

    return Array.from(performance.values()).sort((a, b) => b.totalAtendimentos - a.totalAtendimentos);
  }

  /**
   * Calcula estatísticas de devoluções
   */
  private static calcularDevolucoes(senhas: Senha[]): EstatisticasDevolucoes {
    const senhasComDevolucao = senhas.filter(s => s.historicoDevolucoes && s.historicoDevolucoes.length > 0);

    const totalDevolucoes = senhasComDevolucao.reduce(
      (sum, s) => sum + (s.historicoDevolucoes?.length || 0),
      0
    );

    const porMotivo: { [motivo: string]: { quantidade: number; percentual: number } } = {};

    // Agrupa por motivo
    senhasComDevolucao.forEach(senha => {
      senha.historicoDevolucoes?.forEach(devolucao => {
        if (!porMotivo[devolucao.motivo]) {
          porMotivo[devolucao.motivo] = { quantidade: 0, percentual: 0 };
        }
        porMotivo[devolucao.motivo].quantidade++;
      });
    });

    // Calcula percentuais
    Object.keys(porMotivo).forEach(motivo => {
      porMotivo[motivo].percentual = (porMotivo[motivo].quantidade / totalDevolucoes) * 100;
    });

    // Tempo médio até retorno
    let tempoMedioAteRetornoMs = 0;
    if (senhasComDevolucao.length > 0) {
      const temposRetorno: number[] = [];
      senhasComDevolucao.forEach(senha => {
        senha.historicoDevolucoes?.forEach(devolucao => {
          temposRetorno.push(devolucao.tempoDecorridoMinutos * 60000); // converte para ms
        });
      });
      if (temposRetorno.length > 0) {
        tempoMedioAteRetornoMs = temposRetorno.reduce((a, b) => a + b, 0) / temposRetorno.length;
      }
    }

    return {
      totalDevolucoes,
      porMotivo,
      tempoMedioAteRetornoMs
    };
  }

  /**
   * Calcula métricas de qualidade do serviço
   */
  private static calcularQualidade(senhas: Senha[], estado: EstadoSistema): EstatisticasQualidade {
    const totalEmitidas = senhas.length;
    const totalAtendidas = senhas.filter(s => s.status === 'atendida').length;
    const totalNaoCompareceu = senhas.filter(s => s.status === 'nao_compareceu').length;
    const totalDevolucoes = senhas.reduce((sum, s) => sum + (s.historicoDevolucoes?.length || 0), 0);

    const taxaAtendimento = totalEmitidas > 0 ? (totalAtendidas / totalEmitidas) * 100 : 0;
    const taxaNaoComparecimento = totalEmitidas > 0 ? (totalNaoCompareceu / totalEmitidas) * 100 : 0;
    const taxaDevolucao = totalEmitidas > 0 ? (totalDevolucoes / totalEmitidas) * 100 : 0;

    // Eficiência geral (atendimentos por hora)
    const inicioDia = getInicioHojeBrasilia();
    const agora = Date.now();
    const horasDecorridas = (agora - inicioDia) / (1000 * 60 * 60);
    const eficienciaGeral = horasDecorridas > 0 ? totalAtendidas / horasDecorridas : 0;

    // Tempo ocioso médio (tempo entre finalizações)
    let tempoOciosoMedioMs = 0;
    const senhasAtendidas = senhas
      .filter(s => s.status === 'atendida' && s.finalizadoTimestamp)
      .sort((a, b) => a.finalizadoTimestamp! - b.finalizadoTimestamp!);

    if (senhasAtendidas.length > 1) {
      const intervalos: number[] = [];
      for (let i = 1; i < senhasAtendidas.length; i++) {
        const intervalo = senhasAtendidas[i].finalizadoTimestamp! - senhasAtendidas[i - 1].finalizadoTimestamp!;
        intervalos.push(intervalo);
      }
      if (intervalos.length > 0) {
        tempoOciosoMedioMs = intervalos.reduce((a, b) => a + b, 0) / intervalos.length;
      }
    }

    return {
      taxaAtendimento,
      taxaNaoComparecimento,
      taxaDevolucao,
      eficienciaGeral,
      tempoOciosoMedioMs
    };
  }


  /**
   * Calcula projeção de atendimento
   */
  private static calcularProjecao(senhas: Senha[], estado: EstadoSistema): ProjecaoAtendimento | null {
    const senhasEspera = senhas.filter(s => s.status === 'espera');
    const senhasRestantes = senhasEspera.length;

    if (senhasRestantes === 0) {
      return null;
    }

    // Calcula tempo médio de atendimento com base nos atendimentos recentes
    const senhasAtendidas = senhas
      .filter(s => s.status === 'atendida' && s.tempoAtendimento > 0)
      .sort((a, b) => (b.finalizadoTimestamp || 0) - (a.finalizadoTimestamp || 0))
      .slice(0, 10); // Usa últimos 10 atendimentos

    if (senhasAtendidas.length === 0) {
      return null;
    }

    const tempoMedioAtendimentoMs =
      senhasAtendidas.reduce((sum, s) => sum + s.tempoAtendimento, 0) / senhasAtendidas.length;

    const guichesAtivos = estado.guichesConfigurados.filter(g => g.ativo).length || 1;

    // Tempo estimado = (senhas restantes / guichês ativos) * tempo médio
    const tempoEstimadoFinalizacaoMs = (senhasRestantes / guichesAtivos) * tempoMedioAtendimentoMs;

    const horarioEstimadoFinalizacao = getHorarioFormatadoBrasilia(Date.now() + tempoEstimadoFinalizacaoMs);

    return {
      senhasRestantes,
      tempoEstimadoFinalizacaoMs,
      horarioEstimadoFinalizacao,
      baseadoEm: 'tempo-atual'
    };
  }

  /**
   * Calcula estatísticas avançadas completas
   */
  public static calcularEstatisticasAvancadas(
    estado: EstadoSistema,
    modoTeste: boolean = false,
    periodo?: FiltroPeriodo
  ): EstatisticasAvancadas {
    // Usa filtro de período se fornecido, senão usa todas as senhas
    const senhasFiltradas = periodo
      ? this.filtrarPorPeriodo(estado.senhas, periodo)
      : estado.senhas;

    // Calcula estatísticas básicas usando o serviço original
    const estatisticasBasicas = StatisticsService.calcularEstatisticas({
      ...estado,
      senhas: senhasFiltradas
    });

    // Calcula distribuição temporal
    const distribuicaoPorHora = this.calcularDistribuicaoPorHora(senhasFiltradas);
    const horasPico = this.identificarHorasPico(distribuicaoPorHora);

    // Performance por atendente
    const performancePorAtendente = this.calcularPerformancePorAtendente(senhasFiltradas, estado);

    // Devoluções
    const devolucoes = this.calcularDevolucoes(senhasFiltradas);

    // Qualidade
    const qualidade = this.calcularQualidade(senhasFiltradas, estado);

    // Projeção (apenas se não houver filtro de período)
    const projecao = periodo ? null : this.calcularProjecao(senhasFiltradas, estado);

    // Estatísticas agregadas
    const mediaAtendimentosPorHora = distribuicaoPorHora.reduce((sum, h) => sum + h.atendidas, 0) / 24;
    const picoMaximoAtendimentos = Math.max(...distribuicaoPorHora.map(h => h.emitidas));
    const horaPico = distribuicaoPorHora.find(h => h.emitidas === picoMaximoAtendimentos);
    const horarioPicoMaximo = horaPico ? `${horaPico.hora}h` : '---';

    // Período de menor movimento
    const menorMovimento = distribuicaoPorHora
      .filter(h => h.emitidas > 0)
      .sort((a, b) => a.emitidas - b.emitidas)[0];
    const periodoMenorMovimento = menorMovimento ? `${menorMovimento.hora}h` : '---';

    // Metadados
    const dataReferencia = getDataFormatadaBrasilia();
    const timestampInicio = periodo?.inicio || getInicioHojeBrasilia();
    const timestampFim = periodo?.fim || Date.now();
    const periodoAtivo = !periodo;

    return {
      // Estatísticas básicas
      ...estatisticasBasicas,

      // Metadados
      dataReferencia,
      timestampInicio,
      timestampFim,
      periodoAtivo,
      modoTeste,

      // Distribuição temporal
      distribuicaoPorHora,
      horasPico,

      // Performance
      performancePorAtendente,

      // Devoluções
      devolucoes,

      // Qualidade
      qualidade,

      // Projeções
      projecao,

      // Agregados
      mediaAtendimentosPorHora,
      picoMaximoAtendimentos,
      horarioPicoMaximo,
      periodoMenorMovimento
    };
  }
}
