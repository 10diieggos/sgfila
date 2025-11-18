/**
 * StateManager - Gerenciamento de estado do sistema
 * SGFILA v3.0
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import type { EstadoSistema, Guiche } from '../../../shared/types.js';

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
      dataReinicioSistema: dataFormatada
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
}
