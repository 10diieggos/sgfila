/**
 * Serviço de persistência de estatísticas em arquivos JSON
 * Um arquivo por dia, com modo teste para dados descartáveis
 * SGFILA v3.0
 */

import fs from 'fs/promises';
import path from 'path';
import { ArquivoEstatisticasDia, EstatisticasAvancadas, EstatisticasSnapshot } from '../../../shared/types.js';
import {
  getDataFormatadaBrasilia,
  getHoraBrasilia,
  timestampParaDataBrasilia
} from '../utils/timezone.js';

export class StatisticsPersistence {
  private pastaEstatisticas: string;
  private modoTeste: boolean;
  private arquivoAtual: string | null = null;
  private dadosCache: ArquivoEstatisticasDia | null = null;

  constructor(pastaBase: string, modoTeste: boolean = false) {
    this.pastaEstatisticas = path.join(pastaBase, 'estatisticas');
    this.modoTeste = modoTeste;
  }

  /**
   * Inicializa o serviço, criando a pasta se necessário
   */
  public async inicializar(): Promise<void> {
    if (this.modoTeste) {
      console.log('📊 Modo teste ativado - estatísticas não serão persistidas');
      return;
    }

    try {
      await fs.mkdir(this.pastaEstatisticas, { recursive: true });
      console.log(`📊 Pasta de estatísticas inicializada: ${this.pastaEstatisticas}`);
    } catch (erro) {
      console.error('Erro ao criar pasta de estatísticas:', erro);
      throw erro;
    }
  }

  /**
   * Obtém ou cria o arquivo de estatísticas do dia atual
   */
  private async obterArquivoDoDia(): Promise<ArquivoEstatisticasDia> {
    const dataAtual = getDataFormatadaBrasilia();

    // Se já tem cache e é do dia atual, retorna
    if (this.dadosCache && this.dadosCache.data === dataAtual) {
      return this.dadosCache;
    }

    // Modo teste: sempre retorna nova estrutura sem persistir
    if (this.modoTeste) {
      this.dadosCache = {
        data: dataAtual,
        modoTeste: true,
        criadoEm: Date.now(),
        atualizadoEm: Date.now(),
        snapshots: [],
        estatisticasFinais: null
      };
      return this.dadosCache;
    }

    // Monta o caminho do arquivo
    const nomeArquivo = `estatisticas_${dataAtual}.json`;
    this.arquivoAtual = path.join(this.pastaEstatisticas, nomeArquivo);

    // Tenta carregar arquivo existente
    try {
      const conteudo = await fs.readFile(this.arquivoAtual, 'utf-8');
      this.dadosCache = JSON.parse(conteudo);
      console.log(`📊 Arquivo de estatísticas carregado: ${nomeArquivo}`);
      return this.dadosCache!;
    } catch (erro) {
      // Arquivo não existe, cria novo
      this.dadosCache = {
        data: dataAtual,
        modoTeste: false,
        criadoEm: Date.now(),
        atualizadoEm: Date.now(),
        snapshots: [],
        estatisticasFinais: null
      };

      await this.salvarArquivo();
      console.log(`📊 Novo arquivo de estatísticas criado: ${nomeArquivo}`);
      return this.dadosCache;
    }
  }

  /**
   * Salva o arquivo atual no disco
   */
  private async salvarArquivo(): Promise<void> {
    if (this.modoTeste || !this.dadosCache || !this.arquivoAtual) {
      return;
    }

    try {
      this.dadosCache.atualizadoEm = Date.now();
      const conteudo = JSON.stringify(this.dadosCache, null, 2);
      await fs.writeFile(this.arquivoAtual, conteudo, 'utf-8');
    } catch (erro) {
      console.error('Erro ao salvar arquivo de estatísticas:', erro);
      throw erro;
    }
  }

  /**
   * Adiciona um snapshot de estatísticas
   */
  public async adicionarSnapshot(estatisticas: EstatisticasAvancadas): Promise<void> {
    const arquivo = await this.obterArquivoDoDia();
    const horaAtual = getHoraBrasilia();

    const snapshot: EstatisticasSnapshot = {
      timestamp: Date.now(),
      hora: horaAtual,
      estatisticas
    };

    arquivo.snapshots.push(snapshot);

    if (!this.modoTeste) {
      await this.salvarArquivo();
      console.log(`📊 Snapshot adicionado às ${horaAtual}h`);
    }
  }

  /**
   * Atualiza as estatísticas finais do dia
   */
  public async atualizarEstatisticasFinais(estatisticas: EstatisticasAvancadas): Promise<void> {
    const arquivo = await this.obterArquivoDoDia();
    arquivo.estatisticasFinais = estatisticas;

    if (!this.modoTeste) {
      await this.salvarArquivo();
      console.log('📊 Estatísticas finais atualizadas');
    }
  }

  /**
   * Obtém as estatísticas do dia atual
   */
  public async obterEstatisticasDia(data?: string): Promise<ArquivoEstatisticasDia | null> {
    const dataAlvo = data || getDataFormatadaBrasilia();

    // Se é o dia atual, retorna do cache
    if (dataAlvo === getDataFormatadaBrasilia()) {
      return await this.obterArquivoDoDia();
    }

    // Modo teste: não há histórico
    if (this.modoTeste) {
      return null;
    }

    // Busca arquivo histórico
    const nomeArquivo = `estatisticas_${dataAlvo}.json`;
    const caminhoArquivo = path.join(this.pastaEstatisticas, nomeArquivo);

    try {
      const conteudo = await fs.readFile(caminhoArquivo, 'utf-8');
      return JSON.parse(conteudo);
    } catch (erro) {
      return null;
    }
  }

  /**
   * Lista todos os dias com estatísticas disponíveis
   */
  public async listarDiasDisponiveis(): Promise<string[]> {
    if (this.modoTeste) {
      return [getDataFormatadaBrasilia()];
    }

    try {
      const arquivos = await fs.readdir(this.pastaEstatisticas);
      const datas = arquivos
        .filter(nome => nome.startsWith('estatisticas_') && nome.endsWith('.json'))
        .map(nome => nome.replace('estatisticas_', '').replace('.json', ''))
        .sort()
        .reverse(); // Mais recente primeiro

      return datas;
    } catch (erro) {
      console.error('Erro ao listar dias disponíveis:', erro);
      return [];
    }
  }

  /**
   * Obtém estatísticas de um período
   */
  public async obterEstatisticasPeriodo(dataInicio: string, dataFim: string): Promise<ArquivoEstatisticasDia[]> {
    const diasDisponiveis = await this.listarDiasDisponiveis();

    const diasNoPeriodo = diasDisponiveis.filter(dia => {
      return dia >= dataInicio && dia <= dataFim;
    });

    const estatisticas: ArquivoEstatisticasDia[] = [];

    for (const dia of diasNoPeriodo) {
      const stats = await this.obterEstatisticasDia(dia);
      if (stats) {
        estatisticas.push(stats);
      }
    }

    return estatisticas;
  }

  /**
   * Limpa dados de teste (se aplicável)
   */
  public limparDadosTeste(): void {
    if (this.modoTeste) {
      this.dadosCache = null;
      this.arquivoAtual = null;
      console.log('📊 Dados de teste limpos');
    }
  }

  /**
   * Obtém o último snapshot do dia
   */
  public async obterUltimoSnapshot(): Promise<EstatisticasSnapshot | null> {
    const arquivo = await this.obterArquivoDoDia();

    if (arquivo.snapshots.length === 0) {
      return null;
    }

    return arquivo.snapshots[arquivo.snapshots.length - 1];
  }

  /**
   * Verifica se precisa criar snapshot horário
   */
  public async verificarSnapshotHorario(ultimoSnapshot: number | null): Promise<boolean> {
    if (!ultimoSnapshot) {
      return true; // Primeiro snapshot
    }

    const horaUltimoSnapshot = timestampParaDataBrasilia(ultimoSnapshot);
    const horaAtual = getDataFormatadaBrasilia();

    // Verifica se mudou de hora
    return horaUltimoSnapshot !== horaAtual;
  }

  /**
   * Obtém informações sobre o serviço
   */
  public getInfo(): { modoTeste: boolean; pastaEstatisticas: string; arquivoAtual: string | null } {
    return {
      modoTeste: this.modoTeste,
      pastaEstatisticas: this.pastaEstatisticas,
      arquivoAtual: this.arquivoAtual
    };
  }
}
