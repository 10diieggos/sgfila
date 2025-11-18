/**
 * QueueService - Gerenciamento de senhas e fila
 * SGFILA v3.0
 */

import type { EstadoSistema, Senha, TipoSenha, MotivoRetorno, RegistroDevolucao } from '../../../shared/types.js';
import { StateManager } from './StateManager.js';

export class QueueService {
  private stateManager: StateManager;

  constructor() {
    this.stateManager = StateManager.getInstance();
  }

  /**
   * Gera número de senha no formato adequado
   */
  private gerarNumeroSenha(tipo: TipoSenha, subtipo: string, contador: number): string {
    let prefixo = '';

    if (tipo === 'prioridade') {
      prefixo = 'P';
    } else if (tipo === 'contratual') {
      prefixo = 'C';
    } else {
      prefixo = 'N';
    }

    const numero = String(contador).padStart(3, '0');
    return subtipo ? `${prefixo}-${subtipo.toUpperCase()}-${numero}` : `${prefixo}-${numero}`;
  }

  /**
   * Emite uma nova senha
   */
  public emitirSenha(tipo: TipoSenha, subtipo: string = ''): Senha {
    const estado = this.stateManager.getEstado();

    // Incrementa contador apropriado
    if (tipo === 'prioridade') {
      estado.contadorPrioridade++;
    } else if (tipo === 'contratual') {
      estado.contadorContratual++;
    } else {
      estado.contadorNormal++;
    }

    estado.senhasHoje++;

    // Gera número da senha
    const contador = tipo === 'prioridade'
      ? estado.contadorPrioridade
      : tipo === 'contratual'
        ? estado.contadorContratual
        : estado.contadorNormal;

    const numero = this.gerarNumeroSenha(tipo, subtipo, contador);

    // Cria nova senha
    const novaSenha: Senha = {
      numero,
      tipo,
      subtipo,
      timestamp: Date.now(),
      status: 'espera',
      descricao: '',
      tempoEspera: 0,
      tempoAtendimento: 0
    };

    estado.senhas.push(novaSenha);
    this.stateManager.setEstado(estado);

    console.log(`Senha emitida: ${numero}`);
    return novaSenha;
  }

  /**
   * Chama próxima senha da fila para um guichê
   */
  public chamarSenha(guicheId: string): Senha | null {
    const estado = this.stateManager.getEstado();

    // Verifica se guichê já está atendendo
    if (estado.atendimentosAtuais[guicheId]) {
      console.log(`Guichê ${guicheId} já está atendendo`);
      return null;
    }

    // Busca senhas em espera
    const senhasEspera = estado.senhas
      .filter(s => s.status === 'espera')
      .sort((a, b) => a.timestamp - b.timestamp);

    if (senhasEspera.length === 0) {
      console.log('Nenhuma senha na fila');
      return null;
    }

    // Aplica lógica de proporção
    const prioritarias = senhasEspera.filter(s => s.tipo === 'prioridade');
    const contratuais = senhasEspera.filter(s => s.tipo === 'contratual');
    const normais = senhasEspera.filter(s => s.tipo === 'normal');

    const contadorP = estado.contadorPrioridadeDesdeUltimaNormal;
    const contadorC = estado.contadorContratualDesdeUltimaNormal;
    const proporcaoP = estado.proporcaoPrioridade;
    const proporcaoC = estado.proporcaoContratual;

    let senhaChamada: Senha | null = null;

    if (prioritarias.length > 0 && contadorP < proporcaoP) {
      senhaChamada = prioritarias[0];
      estado.contadorPrioridadeDesdeUltimaNormal++;
    } else if (contratuais.length > 0 && contadorC < proporcaoC) {
      senhaChamada = contratuais[0];
      estado.contadorContratualDesdeUltimaNormal++;
    } else if (normais.length > 0) {
      senhaChamada = normais[0];
      estado.contadorPrioridadeDesdeUltimaNormal = 0;
      estado.contadorContratualDesdeUltimaNormal = 0;
    } else if (prioritarias.length > 0) {
      senhaChamada = prioritarias[0];
      estado.contadorPrioridadeDesdeUltimaNormal++;
    } else if (contratuais.length > 0) {
      senhaChamada = contratuais[0];
      estado.contadorContratualDesdeUltimaNormal++;
    }

    if (!senhaChamada) {
      return null;
    }

    // Atualiza senha para chamada
    const agora = Date.now();
    senhaChamada.status = 'chamada';
    senhaChamada.guicheAtendendo = guicheId;
    senhaChamada.chamadaTimestamp = agora;
    senhaChamada.tempoEspera = agora - senhaChamada.timestamp;

    // Adiciona aos atendimentos atuais
    estado.atendimentosAtuais[guicheId] = senhaChamada;

    this.stateManager.setEstado(estado);

    console.log(`Senha ${senhaChamada.numero} chamada para ${guicheId}`);
    return senhaChamada;
  }

  /**
   * Chama uma senha específica
   */
  public chamarSenhaEspecifica(guicheId: string, numeroSenha: string): Senha | null {
    const estado = this.stateManager.getEstado();

    // Verifica se guichê já está atendendo
    if (estado.atendimentosAtuais[guicheId]) {
      console.log(`Guichê ${guicheId} já está atendendo`);
      return null;
    }

    // Busca senha específica
    const senha = estado.senhas.find(s => s.numero === numeroSenha && s.status === 'espera');
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Atualiza senha
    const agora = Date.now();
    senha.status = 'chamada';
    senha.guicheAtendendo = guicheId;
    senha.chamadaTimestamp = agora;
    senha.tempoEspera = agora - senha.timestamp;

    estado.atendimentosAtuais[guicheId] = senha;

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} chamada para ${guicheId}`);
    return senha;
  }

  /**
   * Finaliza atendimento de um guichê
   */
  public finalizarAtendimento(guicheId: string): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.atendimentosAtuais[guicheId];
    if (!senha) {
      console.log(`Nenhuma senha em atendimento no ${guicheId}`);
      return null;
    }

    // Atualiza senha para atendida
    const agora = Date.now();
    senha.status = 'atendida';
    senha.finalizadoTimestamp = agora;
    senha.tempoAtendimento = agora - (senha.chamadaTimestamp || agora);

    // Remove dos atendimentos atuais
    delete estado.atendimentosAtuais[guicheId];

    this.stateManager.setEstado(estado);

    console.log(`Atendimento finalizado no ${guicheId}: ${senha.numero}`);
    return senha;
  }

  /**
   * Devolve senha para a fila
   */
  public devolverSenha(numeroSenha: string): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Não pode devolver senha que já está em espera
    if (senha.status === 'espera') {
      console.log(`Senha ${numeroSenha} já está na fila de espera`);
      return null;
    }

    // Restaura para espera
    senha.status = 'espera';
    senha.tempoEspera = 0;
    senha.tempoAtendimento = 0;

    // Remove dos atendimentos atuais (se estiver em chamada)
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    // Limpa dados de atendimento
    senha.guicheAtendendo = undefined;
    senha.chamadaTimestamp = undefined;
    senha.finalizadoTimestamp = undefined;

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} devolvida para fila (status anterior: ${senha.status})`);
    return senha;
  }

  /**
   * Devolve senha para fila com motivo específico e regras de reposicionamento
   */
  public devolverSenhaComMotivo(numeroSenha: string, motivo: MotivoRetorno): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Não pode devolver senha que já está em espera
    if (senha.status === 'espera') {
      console.log(`Senha ${numeroSenha} já está na fila de espera`);
      return null;
    }

    // Calcula tempo decorrido desde histórico
    const agora = Date.now();
    const timestampHistorico = senha.finalizadoTimestamp || agora;
    const tempoDecorridoMs = agora - timestampHistorico;
    const tempoDecorridoMinutos = Math.floor(tempoDecorridoMs / 60000);

    // Validações por motivo
    if (motivo === 'ausente_retornou' && tempoDecorridoMinutos > 15) {
      console.log(`Devolução bloqueada: Ausência superior a 15 minutos (${tempoDecorridoMinutos}min)`);
      return null;
    }

    if (motivo === 'reabertura_atendimento' && tempoDecorridoMinutos > 30) {
      console.log(`Devolução bloqueada: Tempo superior a 30 minutos (${tempoDecorridoMinutos}min)`);
      return null;
    }

    // Remove dos atendimentos atuais se estiver lá
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    // Limpa dados de atendimento
    senha.guicheAtendendo = undefined;
    senha.chamadaTimestamp = undefined;
    senha.finalizadoTimestamp = undefined;
    senha.tempoEspera = 0;
    senha.tempoAtendimento = 0;

    // Aplica estratégia de reposicionamento baseada no motivo
    let posicaoAtribuida: number | undefined;

    switch (motivo) {
      case 'retorno_impressao':
        // Fila especial de retorno - usa timestamp negativo para prioridade
        senha.timestamp = Date.now() - 1000000000; // Alta prioridade
        posicaoAtribuida = 1;
        console.log(`Retorno por impressão: ${numeroSenha} - Alta prioridade`);
        break;

      case 'erro_operacional':
        // Posição original aproximada - mantém timestamp original
        posicaoAtribuida = senha.posicaoOriginal || 1;
        console.log(`Erro operacional: ${numeroSenha} - Mantém posição original (aprox.)`);
        break;

      case 'ausente_retornou':
      case 'reabertura_atendimento':
        // Terceira posição da fila atual
        const senhasEsperaOrdenadas = estado.senhas
          .filter(s => s.status === 'espera')
          .sort((a, b) => {
            // Prioridade para retorno_impressao
            const aPrioridade = a.timestamp < 0 ? -1 : 1;
            const bPrioridade = b.timestamp < 0 ? -1 : 1;
            if (aPrioridade !== bPrioridade) return aPrioridade - bPrioridade;
            return a.timestamp - b.timestamp;
          });

        // Define timestamp para ficar na terceira posição
        if (senhasEsperaOrdenadas.length === 0) {
          senha.timestamp = Date.now();
          posicaoAtribuida = 1;
        } else if (senhasEsperaOrdenadas.length === 1) {
          senha.timestamp = senhasEsperaOrdenadas[0].timestamp + 1;
          posicaoAtribuida = 2;
        } else if (senhasEsperaOrdenadas.length === 2) {
          senha.timestamp = senhasEsperaOrdenadas[1].timestamp + 1;
          posicaoAtribuida = 3;
        } else {
          // Posicionar após a segunda senha
          senha.timestamp = senhasEsperaOrdenadas[2].timestamp - 1;
          posicaoAtribuida = 3;
        }

        console.log(`${motivo}: ${numeroSenha} - Terceira posição (${posicaoAtribuida})`);
        break;
    }

    // Atualiza status
    senha.status = 'espera';

    // Registra devolução no histórico
    if (!senha.historicoDevolucoes) {
      senha.historicoDevolucoes = [];
    }

    const registro: RegistroDevolucao = {
      timestamp: agora,
      motivo,
      timestampHistorico,
      tempoDecorridoMinutos,
      posicaoAtribuida
    };

    senha.historicoDevolucoes.push(registro);

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} devolvida com motivo: ${motivo} (${tempoDecorridoMinutos}min decorridos)`);
    return senha;
  }

  /**
   * Exclui senha da fila
   */
  public excluirSenha(numeroSenha: string): boolean {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return false;
    }

    // Marca como excluída ao invés de remover
    senha.status = 'excluida';
    senha.finalizadoTimestamp = Date.now();

    // Remove dos atendimentos atuais se estiver lá
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} excluída`);
    return true;
  }

  /**
   * Marca atendimento como não compareceu
   */
  public excluirAtendimento(numeroSenha: string): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    // Marca como não compareceu
    senha.status = 'nao_compareceu';
    senha.finalizadoTimestamp = Date.now();

    // Remove dos atendimentos atuais se estiver lá
    const guiche = senha.guicheAtendendo;
    if (guiche && estado.atendimentosAtuais[guiche]) {
      delete estado.atendimentosAtuais[guiche];
    }

    this.stateManager.setEstado(estado);

    console.log(`Senha ${numeroSenha} marcada como não compareceu`);
    return senha;
  }

  /**
   * Atualiza descrição de uma senha
   */
  public atualizarDescricao(numeroSenha: string, descricao: string): Senha | null {
    const estado = this.stateManager.getEstado();

    const senha = estado.senhas.find(s => s.numero === numeroSenha);
    if (!senha) {
      console.log(`Senha ${numeroSenha} não encontrada`);
      return null;
    }

    senha.descricao = descricao;
    this.stateManager.setEstado(estado);

    console.log(`Descrição atualizada para ${numeroSenha}`);
    return senha;
  }
}
