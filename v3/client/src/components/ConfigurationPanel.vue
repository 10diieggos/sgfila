<template>
  <div class="configuration-panel">
    <!-- Sub-tabs -->
    <div class="sub-tab-nav">
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'guiches' }]"
        @click="changeSubTab('guiches')"
      >
        <i class="fas fa-desktop" /> Guichês
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'proporcao' }]"
        @click="changeSubTab('proporcao')"
      >
        <i class="fas fa-balance-scale-right" /> Proporção & Comportamento
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'correcoes' }]"
        @click="changeSubTab('correcoes')"
      >
        <i class="fas fa-tools" /> Correções
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'reiniciar' }]"
        @click="changeSubTab('reiniciar')"
      >
        <i class="fas fa-redo" /> Reiniciar
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'design' }]"
        @click="changeSubTab('design')"
      >
        <i class="fas fa-palette" /> Design
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'ia' }]"
        @click="changeSubTab('ia')"
      >
        <i class="fas fa-brain" /> IA
      </button>
    </div>

    <!-- Conteúdo Guichês -->
    <div
      v-if="activeSubTab === 'guiches'"
      class="sub-tab-content"
    >
      <!-- Exibição Local -->
      <h3><i class="fas fa-desktop-alt" /> Exibição (Este Navegador)</h3>
      <p class="hint">
        Selecione os guichês que deseja exibir no painel de controle desta aba.
        A seleção é salva automaticamente no navegador.
      </p>

      <div class="guiche-checkbox-list">
        <label
          v-for="guiche in guichesGlobais"
          :key="'exib-' + guiche.id"
          class="checkbox-item"
        >
          <input
            type="checkbox"
            :value="guiche.id"
            :checked="guichesExibicaoLocal.includes(guiche.id)"
            :disabled="!guiche.ativo"
            @change="toggleGuicheExibicao(guiche.id)"
          >
          <span>{{ guiche.nome }}</span>
          <span
            v-if="!guiche.ativo"
            class="badge-inactive"
          >Inativo</span>
        </label>
      </div>

      <hr class="divider">

      <!-- Guichês Globais -->
      <h3><i class="fas fa-users-cog" /> Guichês (Global)</h3>
      <p class="hint">
        Adicione, nomeie e ative/desative guichês para <strong>todo o sistema</strong>.
        Guichês inativos não são contados na estimativa de tempo.
        As alterações são salvas automaticamente.
      </p>

      <div class="guiche-list">
        <div
          v-for="guiche in guichesGlobaisLocal"
          :key="'global-' + guiche.id"
          class="guiche-item"
        >
          <input
            v-model="guiche.nome"
            type="text"
            placeholder="Nome do guichê"
            class="guiche-input"
            @input="salvarGuichesGlobais"
            @blur="salvarGuichesGlobais"
          >
          <label class="toggle-switch">
            <input
              v-model="guiche.ativo"
              type="checkbox"
              @change="handleToggleAtivo(guiche)"
            >
            <span class="toggle-slider" />
          </label>
          <span class="status-label">{{ guiche.ativo ? 'Ativo' : 'Inativo' }}</span>
          <button
            class="btn-icon btn-delete"
            title="Remover guichê"
            @click="removerGuiche(guiche.id)"
          >
            <i class="fas fa-trash" />
          </button>
        </div>
      </div>

      <button
        class="btn btn-add"
        @click="adicionarGuiche"
      >
        <i class="fas fa-plus" /> Adicionar Guichê
      </button>
    </div>

    <!-- Conteúdo Proporção -->
    <div
      v-if="activeSubTab === 'proporcao'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-balance-scale-right" /> Configurações de Proporção</h2>
      <p class="hint">
        Defina a proporção de atendimento entre tipos de senha.
        Exemplo: P:N = 2:1 significa que a cada 2 senhas prioritárias, 1 normal é chamada.
      </p>

      <div class="ratio-controls">
        <div class="ratio-control">
          <label for="input-ratio">
            <i class="fas fa-wheelchair" /> Proporção Prioritária : Normal (P:N):
          </label>
          <div class="ratio-input-group">
            <input
              id="input-ratio"
              v-model.number="proporcaoPrioridadeLocal"
              type="number"
              min="1"
              max="20"
              @blur="salvarProporcaoPrioridade"
            >
            <span class="ratio-separator">:</span>
            <span class="ratio-fixed">1</span>
          </div>
          <p class="ratio-explanation">
            A cada <strong>{{ proporcaoPrioridadeLocal }}</strong> senha(s) prioritária(s),
            <strong>1</strong> senha normal será chamada.
          </p>
        </div>

        <div class="ratio-control">
          <label for="input-ratio-contratual">
            <i class="fas fa-file-contract" /> Proporção Contratual : Normal (C:N):
          </label>
          <div class="ratio-input-group">
            <input
              id="input-ratio-contratual"
              v-model.number="proporcaoContratualLocal"
              type="number"
              min="1"
              max="20"
              @blur="salvarProporcaoContratual"
            >
            <span class="ratio-separator">:</span>
            <span class="ratio-fixed">1</span>
          </div>
          <p class="ratio-explanation">
            A cada <strong>{{ proporcaoContratualLocal }}</strong> senha(s) contratual(is),
            <strong>1</strong> senha normal será chamada.
          </p>
        </div>
      </div>

      <div class="info-box">
        <i class="fas fa-info-circle" />
        <div>
          <strong>Como funciona a lógica de proporção:</strong>
          <p>
            O sistema alterna entre prioridades e contratos conforme as proporções definidas,
            sempre respeitando a ordem de chegada dentro de cada tipo.
            Senhas prioritárias têm precedência sobre contratuais.
          </p>
        </div>
      </div>

      <hr
        class="divider"
        style="margin: 30px 0;"
      >

      <!-- Comportamento da Fila (integrado) -->
      <h2><i class="fas fa-cogs" /> Comportamento da Fila</h2>
      <p class="hint">
        Configure como o sistema gerencia a fila de atendimento.
      </p>

      <div class="config-section">
        <h3>Algoritmo de Chamada</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="proporcao"
              @change="salvarComportamento"
            >
            <span>
              <strong>Proporção</strong> - Respeita proporção entre tipos
            </span>
          </label>
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="round_robin"
              @change="salvarComportamento"
            >
            <span>
              <strong>Round Robin</strong> - Alterna entre tipos igualmente
            </span>
          </label>
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="fifo"
              @change="salvarComportamento"
            >
            <span>
              <strong>FIFO</strong> - Primeiro a entrar, primeiro a sair
            </span>
          </label>
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="jsed_fair_wrr"
              @change="salvarComportamento"
            >
            <span>
              <strong>IA (JSED/Fair/WRR)</strong> - Decisão no servidor com validação top‑3 e dica ML opcional
            </span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Opções de Chamada</h3>
        <label class="checkbox-item-config">
          <input
            v-model="comportamentoConfig.permitirPularSenhas"
            type="checkbox"
            @change="salvarComportamento"
          >
          <span>Permitir pular senhas (chamar senha específica)</span>
        </label>

        <label class="checkbox-item-config">
          <input
            v-model="comportamentoConfig.chamarProximaAutomatica"
            type="checkbox"
            @change="salvarComportamento"
          >
          <span>Chamar próxima senha automaticamente após finalizar</span>
        </label>
      </div>

      <div class="config-section">
        <h3>Timeouts e Alertas</h3>
        <div class="config-item">
          <label>Auto-finalizar atendimento após (minutos):</label>
          <input
            v-model.number="comportamentoConfig.autoFinalizarMinutos"
            type="number"
            min="0"
            max="120"
            class="config-input"
            placeholder="Desativado"
            @blur="salvarComportamento"
          >
          <p class="input-hint">
            0 ou vazio = desativado
          </p>
        </div>

        <div class="config-item">
          <label>Tempo máximo de espera (minutos):</label>
          <input
            v-model.number="comportamentoConfig.tempoEsperaMaximoMinutos"
            type="number"
            min="0"
            max="300"
            class="config-input"
            placeholder="Sem limite"
            @blur="salvarComportamento"
          >
        </div>

        <label class="checkbox-item-config">
          <input
            v-model="comportamentoConfig.alertarTempoEsperaExcedido"
            type="checkbox"
            @change="salvarComportamento"
          >
          <span>Alertar quando tempo máximo de espera for excedido</span>
        </label>
      </div>
    </div>

    <!-- Conteúdo Tipos de Senha -->
    <div
      v-if="activeSubTab === 'tipos'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-ticket-alt" /> Tipos de Senha</h2>
      <p class="hint">
        Configure os tipos de senha disponíveis no sistema, incluindo cores, prefixos e subtipos.
      </p>

      <div class="info-box">
        <i class="fas fa-info-circle" />
        <div>
          <strong>Importante:</strong>
          <p>Alterações nos tipos de senha afetam todo o sistema. Tipos desativados não estarão disponíveis para emissão.</p>
        </div>
      </div>

      <div
        v-for="(tipo, index) in tiposConfig"
        :key="tipo.id"
        class="tipo-senha-card"
      >
        <div class="tipo-header">
          <div
            class="tipo-badge"
            :style="{ background: tipo.corFundo, color: tipo.cor }"
          >
            <i :class="'fas fa-' + tipo.icone" /> {{ tipo.nome }}
          </div>
          <label class="toggle-switch">
            <input
              v-model="tipo.ativo"
              type="checkbox"
              @change="salvarTipos"
            >
            <span class="toggle-slider" />
          </label>
        </div>

        <div class="tipo-config-grid">
          <div class="config-item">
            <label>Nome Completo:</label>
            <input
              v-model="tipo.nomeCompleto"
              type="text"
              class="config-input"
              @blur="salvarTipos"
            >
          </div>

          <div class="config-item">
            <label>Prefixo:</label>
            <input
              v-model="tipo.prefixo"
              type="text"
              maxlength="3"
              class="config-input small"
              @blur="salvarTipos"
            >
          </div>

          <div class="config-item">
            <label>Cor do Texto:</label>
            <input
              v-model="tipo.cor"
              type="color"
              class="config-input-color"
              @change="salvarTipos"
            >
          </div>

          <div class="config-item">
            <label>Cor de Fundo:</label>
            <input
              v-model="tipo.corFundo"
              type="color"
              class="config-input-color"
              @change="salvarTipos"
            >
          </div>
        </div>

        <div class="config-item">
          <label>Subtipos (separados por vírgula):</label>
          <input
            type="text"
            :value="tipo.subtipos.join(', ')"
            class="config-input"
            placeholder="Ex: Idoso, Gestante, Deficiente"
            @blur="atualizarSubtipos(index, $event)"
          >
        </div>
      </div>
    </div>

    <!-- Conteúdo Motivos de Retorno -->
    <div
      v-if="activeSubTab === 'retornos'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-undo" /> Motivos de Retorno</h2>
      <p class="hint">
        Configure os motivos disponíveis para devolução de senhas à fila.
      </p>

      <div
        v-for="motivo in motivosConfig"
        :key="motivo.id"
        class="motivo-card"
      >
        <div class="motivo-header">
          <div class="motivo-title">
            <i
              :class="'fas fa-' + motivo.icone"
              :style="{ color: motivo.cor }"
            />
            <strong>{{ motivo.nome }}</strong>
          </div>
          <label class="toggle-switch">
            <input
              v-model="motivo.ativo"
              type="checkbox"
              @change="salvarMotivos"
            >
            <span class="toggle-slider" />
          </label>
        </div>

        <div class="motivo-body">
          <div class="config-item">
            <label>Descrição:</label>
            <input
              v-model="motivo.descricao"
              type="text"
              class="config-input"
              @blur="salvarMotivos"
            >
          </div>

          <div class="config-grid-2">
            <div class="config-item">
              <label>Prazo (minutos):</label>
              <input
                v-model.number="motivo.prazoMinutos"
                type="number"
                min="0"
                max="120"
                class="config-input"
                placeholder="Sem prazo"
                @blur="salvarMotivos"
              >
            </div>

            <div class="config-item">
              <label>Posição na Fila:</label>
              <select
                v-model="motivo.posicionamentoFila"
                class="config-select"
                @change="salvarMotivos"
              >
                <option value="inicio">
                  Início
                </option>
                <option value="meio">
                  Meio
                </option>
                <option value="fim">
                  Fim
                </option>
                <option value="original">
                  Posição Original
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Comportamento da Fila -->
    <div
      v-if="activeSubTab === 'comportamento'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-cogs" /> Comportamento da Fila</h2>
      <p class="hint">
        Configure como o sistema gerencia a fila de atendimento.
      </p>

      <div class="config-section">
        <h3>Algoritmo de Chamada</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="proporcao"
              @change="salvarComportamento"
            >
            <span>
              <strong>Proporção</strong> - Respeita proporção entre tipos
            </span>
          </label>
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="round_robin"
              @change="salvarComportamento"
            >
            <span>
              <strong>Round Robin</strong> - Alterna entre tipos igualmente
            </span>
          </label>
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="fifo"
              @change="salvarComportamento"
            >
            <span>
              <strong>FIFO</strong> - Primeiro a entrar, primeiro a sair
            </span>
          </label>
          <label class="radio-item">
            <input
              v-model="comportamentoConfig.algoritmo"
              type="radio"
              value="jsed_fair_wrr"
              @change="salvarComportamento"
            >
            <span>
              <strong>IA (JSED/Fair/WRR)</strong> - Decisão no servidor com validação top‑3 e dica ML opcional
            </span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Opções de Chamada</h3>
        <label class="checkbox-item-config">
          <input
            v-model="comportamentoConfig.permitirPularSenhas"
            type="checkbox"
            @change="salvarComportamento"
          >
          <span>Permitir pular senhas (chamar senha específica)</span>
        </label>

        <label class="checkbox-item-config">
          <input
            v-model="comportamentoConfig.chamarProximaAutomatica"
            type="checkbox"
            @change="salvarComportamento"
          >
          <span>Chamar próxima senha automaticamente após finalizar</span>
        </label>
      </div>

      <div class="config-section">
        <h3>Timeouts e Alertas</h3>
        <div class="config-item">
          <label>Auto-finalizar atendimento após (minutos):</label>
          <input
            v-model.number="comportamentoConfig.autoFinalizarMinutos"
            type="number"
            min="0"
            max="120"
            class="config-input"
            placeholder="Desativado"
            @blur="salvarComportamento"
          >
          <p class="input-hint">
            0 ou vazio = desativado
          </p>
        </div>

        <div class="config-item">
          <label>Tempo máximo de espera (minutos):</label>
          <input
            v-model.number="comportamentoConfig.tempoEsperaMaximoMinutos"
            type="number"
            min="0"
            max="300"
            class="config-input"
            placeholder="Sem limite"
            @blur="salvarComportamento"
          >
        </div>

        <label class="checkbox-item-config">
          <input
            v-model="comportamentoConfig.alertarTempoEsperaExcedido"
            type="checkbox"
            @change="salvarComportamento"
          >
          <span>Alertar quando tempo máximo de espera for excedido</span>
        </label>
      </div>
    </div>

    <!-- Conteúdo Segurança -->
    <div
      v-if="activeSubTab === 'seguranca'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-shield-alt" /> Segurança</h2>
      <p class="hint">
        Configure opções de segurança e proteção do sistema.
      </p>

      <div class="config-section">
        <h3>Confirmações</h3>
        <label class="checkbox-item-config">
          <input
            v-model="segurancaConfig.exigirConfirmacaoExclusao"
            type="checkbox"
            @change="salvarSeguranca"
          >
          <span>Exigir confirmação para excluir senhas</span>
        </label>

        <label class="checkbox-item-config">
          <input
            v-model="segurancaConfig.exigirConfirmacaoReinicio"
            type="checkbox"
            @change="salvarSeguranca"
          >
          <span>Exigir confirmação para reiniciar sistema</span>
        </label>
      </div>

      <div class="config-section">
        <h3>Auditoria e Backup</h3>
        <label class="checkbox-item-config">
          <input
            v-model="segurancaConfig.logAuditoria"
            type="checkbox"
            @change="salvarSeguranca"
          >
          <span>Manter log de auditoria de operações</span>
        </label>

        <label class="checkbox-item-config">
          <input
            v-model="segurancaConfig.backupAutomatico"
            type="checkbox"
            @change="salvarSeguranca"
          >
          <span>Ativar backup automático</span>
        </label>

        <div
          v-if="segurancaConfig.backupAutomatico"
          class="config-subsection"
        >
          <div class="config-item">
            <label>Intervalo de backup (minutos):</label>
            <input
              v-model.number="segurancaConfig.intervaloBackupMinutos"
              type="number"
              min="5"
              max="1440"
              step="5"
              class="config-input"
              @blur="salvarSeguranca"
            >
          </div>
        </div>
      </div>

      <div class="warning-box">
        <i class="fas fa-exclamation-triangle" />
        <div>
          <strong>Nota de Segurança:</strong>
          <p>As configurações de segurança são importantes para proteger a integridade dos dados do sistema. Certifique-se de configurá-las adequadamente.</p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Interface -->
    <div
      v-if="activeSubTab === 'interface'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-palette" /> Configurações de Interface</h2>
      <p class="hint">
        Personalize a aparência e o comportamento visual do sistema.
      </p>

      <div class="config-section">
        <h3>Tema</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input
              v-model="interfaceConfig.tema"
              type="radio"
              value="claro"
              @change="salvarInterface"
            >
            <span><i class="fas fa-sun" /> Claro</span>
          </label>
          <label class="radio-item">
            <input
              v-model="interfaceConfig.tema"
              type="radio"
              value="escuro"
              @change="salvarInterface"
            >
            <span><i class="fas fa-moon" /> Escuro</span>
          </label>
          <label class="radio-item">
            <input
              v-model="interfaceConfig.tema"
              type="radio"
              value="auto"
              @change="salvarInterface"
            >
            <span><i class="fas fa-adjust" /> Automático</span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Tamanho da Fonte (Senhas)</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input
              v-model="interfaceConfig.tamanhoFonteSenhas"
              type="radio"
              value="pequeno"
              @change="salvarInterface"
            >
            <span>Pequeno</span>
          </label>
          <label class="radio-item">
            <input
              v-model="interfaceConfig.tamanhoFonteSenhas"
              type="radio"
              value="medio"
              @change="salvarInterface"
            >
            <span>Médio</span>
          </label>
          <label class="radio-item">
            <input
              v-model="interfaceConfig.tamanhoFonteSenhas"
              type="radio"
              value="grande"
              @change="salvarInterface"
            >
            <span>Grande</span>
          </label>
          <label class="radio-item">
            <input
              v-model="interfaceConfig.tamanhoFonteSenhas"
              type="radio"
              value="extra-grande"
              @change="salvarInterface"
            >
            <span>Extra Grande</span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Formato do Número da Senha</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input
              v-model="interfaceConfig.formatoNumeroSenha"
              type="radio"
              value="com-hifen"
              @change="salvarInterface"
            >
            <span>Com hífen (P-001)</span>
          </label>
          <label class="radio-item">
            <input
              v-model="interfaceConfig.formatoNumeroSenha"
              type="radio"
              value="sem-hifen"
              @change="salvarInterface"
            >
            <span>Sem hífen (P001)</span>
          </label>
          <label class="radio-item">
            <input
              v-model="interfaceConfig.formatoNumeroSenha"
              type="radio"
              value="apenas-numero"
              @change="salvarInterface"
            >
            <span>Apenas número (001)</span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Opções de Exibição</h3>
        <div class="checkbox-list">
          <label class="checkbox-item-config">
            <input
              v-model="interfaceConfig.mostrarDescricaoSenha"
              type="checkbox"
              @change="salvarInterface"
            >
            <span>Mostrar descrição das senhas</span>
          </label>
          <label class="checkbox-item-config">
            <input
              v-model="interfaceConfig.mostrarTempoEspera"
              type="checkbox"
              @change="salvarInterface"
            >
            <span>Mostrar tempo de espera</span>
          </label>
          <label class="checkbox-item-config">
            <input
              v-model="interfaceConfig.mostrarTempoAtendimento"
              type="checkbox"
              @change="salvarInterface"
            >
            <span>Mostrar tempo de atendimento</span>
          </label>
          <label class="checkbox-item-config">
            <input
              v-model="interfaceConfig.exibirIconesPrioridade"
              type="checkbox"
              @change="salvarInterface"
            >
            <span>Exibir ícones de prioridade</span>
          </label>
        </div>
      </div>

      <div class="info-box">
        <i class="fas fa-info-circle" />
        <div>
          <strong>Nota:</strong>
          <p>Algumas alterações podem exigir recarregar a página para serem totalmente aplicadas.</p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Design Tokens -->
    <div
      v-if="activeSubTab === 'design'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-palette" /> Design Tokens</h2>
      <p class="hint">
        Defina a paleta de cores, espaçamentos, raios e tamanhos de fonte para padronização visual.
      </p>

      <div class="config-section">
        <h3>Paleta de Cores</h3>
        <div class="config-grid-3">
          <div class="config-item"><label>Primária</label><input v-model="designTokens.colors.primary" type="color" class="config-input-color" @change="salvarDesignTokens"></div>
          <div class="config-item"><label>Secundária</label><input v-model="designTokens.colors.secondary" type="color" class="config-input-color" @change="salvarDesignTokens"></div>
          <div class="config-item"><label>Sucesso</label><input v-model="designTokens.colors.success" type="color" class="config-input-color" @change="salvarDesignTokens"></div>
          <div class="config-item"><label>Perigo</label><input v-model="designTokens.colors.danger" type="color" class="config-input-color" @change="salvarDesignTokens"></div>
          <div class="config-item"><label>Aviso</label><input v-model="designTokens.colors.warning" type="color" class="config-input-color" @change="salvarDesignTokens"></div>
          <div class="config-item"><label>Informação</label><input v-model="designTokens.colors.info" type="color" class="config-input-color" @change="salvarDesignTokens"></div>
          <div class="config-item"><label>Neutra</label><input v-model="designTokens.colors.neutral" type="color" class="config-input-color" @change="salvarDesignTokens"></div>
        </div>
      </div>

      <div class="config-section">
        <h3>Escala de Espaçamentos (px)</h3>
        <div class="config-grid-3">
          <div class="config-item"><label>xs</label><input v-model.number="designTokens.spacing.xs" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>sm</label><input v-model.number="designTokens.spacing.sm" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>md</label><input v-model.number="designTokens.spacing.md" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>lg</label><input v-model.number="designTokens.spacing.lg" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>xl</label><input v-model.number="designTokens.spacing.xl" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
        </div>
      </div>

      <div class="config-section">
        <h3>Raios de Borda (px)</h3>
        <div class="config-grid-3">
          <div class="config-item"><label>sm</label><input v-model.number="designTokens.radii.sm" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>md</label><input v-model.number="designTokens.radii.md" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>lg</label><input v-model.number="designTokens.radii.lg" type="number" min="0" class="config-input" @blur="salvarDesignTokens"></div>
        </div>
      </div>

      <div class="config-section">
        <h3>Tamanhos de Fonte (px)</h3>
        <div class="config-grid-3">
          <div class="config-item"><label>small</label><input v-model.number="designTokens.fontSizes.small" type="number" min="8" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>base</label><input v-model.number="designTokens.fontSizes.base" type="number" min="10" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>md</label><input v-model.number="designTokens.fontSizes.md" type="number" min="12" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>lg</label><input v-model.number="designTokens.fontSizes.lg" type="number" min="14" class="config-input" @blur="salvarDesignTokens"></div>
          <div class="config-item"><label>xl</label><input v-model.number="designTokens.fontSizes.xl" type="number" min="16" class="config-input" @blur="salvarDesignTokens"></div>
        </div>
      </div>

      <div class="info-box">
        <i class="fas fa-info-circle" />
        <div>
          <strong>Documentação leve:</strong>
          <p>Os tokens de design padronizam a aparência do sistema. Expanda gradualmente conforme surgirem novos componentes (ex.: sombras, z-index, transições).</p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Notificações -->
    <div
      v-if="activeSubTab === 'notificacoes'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-bell" /> Configurações de Notificações</h2>
      <p class="hint">
        Configure alertas sonoros e notificações do sistema.
      </p>

      <div class="config-section">
        <h3>Som</h3>
        <label class="checkbox-item-config large">
          <input
            v-model="notificacoesConfig.somAtivo"
            type="checkbox"
            @change="salvarNotificacoes"
          >
          <span><strong>Ativar som</strong></span>
        </label>

        <div
          v-if="notificacoesConfig.somAtivo"
          class="config-subsection"
        >
          <div class="slider-control">
            <label>
              Volume do Som: <strong>{{ notificacoesConfig.volumeSom }}%</strong>
            </label>
            <input
              v-model.number="notificacoesConfig.volumeSom"
              type="range"
              min="0"
              max="100"
              class="slider"
              @change="salvarNotificacoes"
            >
          </div>

          <div class="number-control">
            <label>Número de beeps na emissão:</label>
            <input
              v-model.number="notificacoesConfig.beepsEmissao"
              type="number"
              min="1"
              max="5"
              class="number-input"
              @change="salvarNotificacoes"
            >
          </div>

          <div class="number-control">
            <label>Número de beeps na chamada:</label>
            <input
              v-model.number="notificacoesConfig.beepsChamada"
              type="number"
              min="1"
              max="10"
              class="number-input"
              @change="salvarNotificacoes"
            >
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Alertas</h3>
        <label class="checkbox-item-config">
          <input
            v-model="notificacoesConfig.alertaFilaCheia"
            type="checkbox"
            @change="salvarNotificacoes"
          >
          <span>Alertar quando fila estiver cheia</span>
        </label>

        <div
          v-if="notificacoesConfig.alertaFilaCheia"
          class="config-subsection"
        >
          <div class="number-control">
            <label>Limite para fila cheia:</label>
            <input
              v-model.number="notificacoesConfig.limiteFilaCheia"
              type="number"
              min="10"
              max="500"
              step="10"
              class="number-input"
              @change="salvarNotificacoes"
            >
            <span class="input-hint">senhas</span>
          </div>
        </div>

        <label class="checkbox-item-config">
          <input
            v-model="notificacoesConfig.alertaGuicheInativo"
            type="checkbox"
            @change="salvarNotificacoes"
          >
          <span>Alertar quando guichê ficar inativo</span>
        </label>

        <div
          v-if="notificacoesConfig.alertaGuicheInativo"
          class="config-subsection"
        >
          <div class="number-control">
            <label>Tempo de inatividade:</label>
            <input
              v-model.number="notificacoesConfig.tempoInativoMinutos"
              type="number"
              min="1"
              max="60"
              class="number-input"
              @change="salvarNotificacoes"
            >
            <span class="input-hint">minutos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Correções -->
    <div
      v-if="activeSubTab === 'correcoes'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-tools" /> Sistema de Correção de Distorções (v3.2)</h2>
      <p class="hint">
        Configure o sistema automático de correção de distorções na fila, incluindo tempos limite e controle de ausências.
      </p>

      <div class="info-box">
        <i class="fas fa-info-circle" />
        <div>
          <strong>Sobre o Sistema de Correções:</strong>
          <p>
            Este sistema corrige automaticamente distorções causadas por algoritmos de proporção,
            priorizando senhas que excedem o tempo limite e controlando ausências de forma inteligente.
          </p>
        </div>
      </div>

      <!-- Tempo Limite -->
      <div class="config-section">
        <h3>⏱️ Correção por Tempo Limite</h3>
        <p class="section-hint">
          Prioriza automaticamente senhas que excedem o tempo máximo de espera definido.
        </p>

        <label class="checkbox-item-config large">
          <input
            v-model="correcoesConfig.tempoLimite.ativo"
            type="checkbox"
            @change="salvarCorrecoes"
          >
          <span><strong>Ativar correção por tempo limite</strong></span>
        </label>

        <div
          v-if="correcoesConfig.tempoLimite.ativo"
          class="config-subsection"
        >
          <h4>Tempos Limite por Tipo (minutos)</h4>
          <div class="config-grid-3">
            <div class="config-item">
              <label><i class="fas fa-file-contract" /> Contratual:</label>
              <input
                v-model.number="correcoesConfig.tempoLimite.temposPorTipo.contratual"
                type="number"
                min="1"
                max="120"
                class="config-input"
                @blur="salvarCorrecoes"
              >
              <span class="input-hint">minutos</span>
            </div>
            <div class="config-item">
              <label><i class="fas fa-wheelchair" /> Prioridade:</label>
              <input
                v-model.number="correcoesConfig.tempoLimite.temposPorTipo.prioridade"
                type="number"
                min="1"
                max="120"
                class="config-input"
                @blur="salvarCorrecoes"
              >
              <span class="input-hint">minutos</span>
            </div>
            <div class="config-item">
              <label><i class="fas fa-user" /> Normal:</label>
              <input
                v-model.number="correcoesConfig.tempoLimite.temposPorTipo.normal"
                type="number"
                min="1"
                max="120"
                class="config-input"
                @blur="salvarCorrecoes"
              >
              <span class="input-hint">minutos</span>
            </div>
          </div>

          <div
            class="config-item"
            style="margin-top: 20px;"
          >
            <label>Máximo de Reposicionamentos:</label>
            <input
              v-model.number="correcoesConfig.tempoLimite.maxReposicionamentos"
              type="number"
              min="0"
              max="10"
              class="config-input"
              style="max-width: 150px;"
              @blur="salvarCorrecoes"
            >
            <p class="input-hint">
              0 = ilimitado
            </p>
          </div>

          <div
            class="checkbox-list"
            style="margin-top: 20px;"
          >
            <label class="checkbox-item-config">
              <input
                v-model="correcoesConfig.tempoLimite.notificarDisplay"
                type="checkbox"
                @change="salvarCorrecoes"
              >
              <span>Notificar no display quando senha for reposicionada</span>
            </label>
            <label class="checkbox-item-config">
              <input
                v-model="correcoesConfig.tempoLimite.registrarLog"
                type="checkbox"
                @change="salvarCorrecoes"
              >
              <span>Registrar reposicionamentos no log</span>
            </label>
          </div>

          <div
            class="config-item"
            style="margin-top: 20px;"
          >
            <label>Mensagem de Reposicionamento:</label>
            <input
              v-model="correcoesConfig.tempoLimite.mensagemReposicionamento"
              type="text"
              class="config-input"
              placeholder="Senha reposicionada - tempo limite excedido"
              @blur="salvarCorrecoes"
            >
          </div>
        </div>
      </div>

      <!-- Ausências -->
      <div class="config-section">
        <h3>🚪 Controle de Ausências</h3>
        <p class="section-hint">
          Gerencia senhas chamadas cujo cliente não compareceu ao guichê.
        </p>

        <label class="checkbox-item-config large">
          <input
            v-model="correcoesConfig.ausencias.ativo"
            type="checkbox"
            @change="salvarCorrecoes"
          >
          <span><strong>Ativar controle de ausências</strong></span>
        </label>

        <div
          v-if="correcoesConfig.ausencias.ativo"
          class="config-subsection"
        >
          <div class="config-item">
            <label>Tentativas Permitidas (chamadas):</label>
            <input
              v-model.number="correcoesConfig.ausencias.tentativasPermitidas"
              type="number"
              min="1"
              max="5"
              class="config-input"
              style="max-width: 150px;"
              @blur="salvarCorrecoes"
            >
            <p class="input-hint">
              Após este número, a senha vai para histórico como "Não Compareceu"
            </p>
          </div>

          <div
            class="checkbox-list"
            style="margin-top: 20px;"
          >
            <label class="checkbox-item-config">
              <input
                v-model="correcoesConfig.ausencias.notificarDisplay"
                type="checkbox"
                @change="salvarCorrecoes"
              >
              <span>Notificar no display quando cliente não comparecer</span>
            </label>
            <label class="checkbox-item-config">
              <input
                v-model="correcoesConfig.ausencias.alertaSonoro"
                type="checkbox"
                @change="salvarCorrecoes"
              >
              <span>Emitir alerta sonoro em caso de ausência</span>
            </label>
          </div>

          <div
            class="config-item"
            style="margin-top: 20px;"
          >
            <label>Mensagem de Ausência:</label>
            <input
              v-model="correcoesConfig.ausencias.mensagemAusencia"
              type="text"
              class="config-input"
              placeholder="Cliente ausente - senha devolvida à fila"
              @blur="salvarCorrecoes"
            >
          </div>
        </div>
      </div>

      <!-- Configurações Gerais de Correção -->
      <div class="config-section">
        <h3>⚙️ Configurações Gerais</h3>

        <div
          class="config-item"
          style="margin-bottom: 20px;"
        >
          <label>Frequência de Verificação:</label>
          <select
            v-model="correcoesConfig.frequenciaVerificacao"
            class="config-select"
            @change="salvarCorrecoes"
          >
            <option value="tempo_real">
              Tempo Real (Verificação Contínua)
            </option>
            <option value="por_minuto">
              Por Minuto (Intervalo Fixo)
            </option>
            <option value="por_chamada">
              Por Chamada (Ao Chamar Senha)
            </option>
          </select>
          <p class="input-hint">
            <strong>Tempo Real:</strong> Verifica continuamente em intervalo configurado<br>
            <strong>Por Minuto:</strong> Verifica a cada X minutos<br>
            <strong>Por Chamada:</strong> Verifica apenas quando uma senha é chamada
          </p>
        </div>

        <div
          v-if="correcoesConfig.frequenciaVerificacao !== 'por_chamada'"
          class="config-item"
        >
          <label>Intervalo de Verificação:</label>
          <input
            v-model.number="correcoesConfig.intervaloVerificacaoMinutos"
            type="number"
            min="1"
            max="60"
            class="config-input"
            style="max-width: 150px;"
            @blur="salvarCorrecoes"
          >
          <span class="input-hint">minutos</span>
        </div>

        <div
          class="checkbox-list"
          style="margin-top: 20px;"
        >
          <label class="checkbox-item-config">
            <input
              v-model="correcoesConfig.limitarCorrecoesEmMassa"
              type="checkbox"
              @change="salvarCorrecoes"
            >
            <span>Limitar correções em massa (previne sobrecarga)</span>
          </label>

          <div
            v-if="correcoesConfig.limitarCorrecoesEmMassa"
            class="config-subsection"
            style="margin-top: 10px;"
          >
            <div class="config-item">
              <label>Máximo de Correções Simultâneas:</label>
              <input
                v-model.number="correcoesConfig.maxCorrecoesSimultaneas"
                type="number"
                min="1"
                max="100"
                class="config-input"
                style="max-width: 150px;"
                @blur="salvarCorrecoes"
              >
              <span class="input-hint">senhas por verificação</span>
            </div>
          </div>

          <label class="checkbox-item-config">
            <input
              v-model="correcoesConfig.destacarSenhasTempoLimite"
              type="checkbox"
              @change="salvarCorrecoes"
            >
            <span>Destacar senhas em tempo limite visualmente</span>
          </label>

          <label class="checkbox-item-config">
            <input
              v-model="correcoesConfig.mostrarHistoricoAusencias"
              type="checkbox"
              @change="salvarCorrecoes"
            >
            <span>Mostrar histórico de ausências na interface</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Conteúdo IA Dashboard -->
    <div
      v-if="activeSubTab === 'ia'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-brain" /> Dashboard de IA (JSED/Fairness/WRR)</h2>
      <p class="hint">
        Visualize o status da IA operacional, thresholds de aceitação de ML Hint e histórico de decisões.
      </p>

      <div class="info-box">
        <i class="fas fa-info-circle" />
        <div>
          <strong>Sobre o Sistema de IA:</strong>
          <p>
            O SGFila utiliza IA para sequenciamento inteligente de senhas, combinando JSED (Joint Shortest Expected Delay),
            Fairness (WRR) e ML Hints do cliente. A decisão final sempre vem do servidor e respeita validação top-3 JSED.
          </p>
        </div>
      </div>

      <!-- Status da IA -->
      <div class="config-section">
        <h3>📊 Status Atual</h3>
        <div class="ia-status-grid">
          <div class="ia-status-card">
            <div class="ia-status-label">Modelo ONNX</div>
            <div class="ia-status-value">
              <i class="fas fa-circle-notch fa-spin" /> Verificando...
            </div>
            <p class="ia-status-hint">Status do modelo de inferência no navegador</p>
          </div>
          <div class="ia-status-card">
            <div class="ia-status-label">Algoritmo Ativo</div>
            <div class="ia-status-value">
              {{ comportamentoConfig.algoritmo === 'jsed_fair_wrr' ? 'IA (JSED/Fair/WRR)' : comportamentoConfig.algoritmo.toUpperCase() }}
            </div>
            <p class="ia-status-hint">Configurado em Proporção & Comportamento</p>
          </div>
          <div class="ia-status-card">
            <div class="ia-status-label">Última Decisão</div>
            <div class="ia-status-value">—</div>
            <p class="ia-status-hint">Nenhuma decisão recente (ver StateManager)</p>
          </div>
        </div>
      </div>

      <!-- Thresholds -->
      <div class="config-section">
        <h3>⚙️ Thresholds de Aceitação (ML Hint)</h3>
        <p class="section-hint">
          Critérios para aceitar sugestões de ML do cliente. Apenas senhas no top-3 JSED e com score ≥ minScore são consideradas.
        </p>
        <div class="config-grid-2">
          <div class="config-item">
            <label>Score Mínimo (minScore):</label>
            <input
              type="number"
              value="0.65"
              min="0"
              max="1"
              step="0.05"
              class="config-input"
              disabled
            >
            <p class="input-hint">Configurado em /ml/thresholds.json</p>
          </div>
          <div class="config-item">
            <label>Latência Máxima (ms):</label>
            <input
              type="number"
              value="200"
              min="50"
              max="500"
              step="10"
              class="config-input"
              disabled
            >
            <p class="input-hint">Tempo máximo para inferência ML</p>
          </div>
          <div class="config-item">
            <label>Cooldown (chamadas):</label>
            <input
              type="number"
              value="20"
              min="5"
              max="50"
              class="config-input"
              disabled
            >
            <p class="input-hint">Chamadas entre ativações de WRR</p>
          </div>
          <div class="config-item">
            <label>Taxa Máxima Fallback:</label>
            <input
              type="number"
              value="0.30"
              min="0"
              max="1"
              step="0.05"
              class="config-input"
              disabled
            >
            <p class="input-hint">Máximo de fallbacks aceitável</p>
          </div>
        </div>
        <div class="warning-box" style="margin-top: 20px;">
          <i class="fas fa-lock" />
          <div>
            <strong>Thresholds Offline:</strong>
            <p>
              Os thresholds são carregados do arquivo <code>client/public/ml/thresholds.json</code> e não podem ser editados pela UI.
              Para alterá-los, edite o arquivo diretamente.
            </p>
          </div>
        </div>
      </div>

      <!-- Telemetria (placeholder) -->
      <div class="config-section">
        <h3>📈 Telemetria de Decisões</h3>
        <p class="section-hint">
          Histórico das últimas decisões da IA (fonte, confiança, top-3). Implementação futura conectará com <code>estado.iaTelemetria</code>.
        </p>
        <div class="ia-telemetria-placeholder">
          <i class="fas fa-chart-line" style="font-size: 3em; color: #868e96; margin-bottom: 15px;"></i>
          <p style="color: #868e96;">Telemetria será exibida aqui quando houver dados.</p>
          <p style="color: #868e96; font-size: 0.9em;">Conectar com <code>estado.iaTelemetria</code> e <code>estado.ultimaDecisaoIA</code>.</p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Reiniciar -->
    <div
      v-if="activeSubTab === 'reiniciar'"
      class="sub-tab-content"
    >
      <h2><i class="fas fa-redo" /> Reiniciar Sistema</h2>
      <p class="hint">
        Esta ação irá reiniciar completamente o sistema, zerando todos os contadores
        e removendo todas as senhas (em espera, em atendimento e histórico).
      </p>

      <div class="warning-box">
        <i class="fas fa-exclamation-triangle" />
        <div>
          <strong>⚠️ ATENÇÃO:</strong>
          <p>
            Esta ação é <strong>irreversível</strong> e irá apagar todos os dados do dia.
            Certifique-se de que deseja realmente reiniciar o sistema antes de confirmar.
          </p>
        </div>
      </div>

      <button
        class="btn btn-reset-danger"
        @click="confirmarReinicio"
      >
        <i class="fas fa-redo" /> Reiniciar Sistema Agora
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type {
  Guiche,
  ConfiguracaoInterface,
  ConfiguracaoNotificacoes,
  ConfiguracaoTipoSenha,
  ConfiguracaoMotivoRetorno,
  ConfiguracaoComportamentoFila,
  ConfiguracaoSeguranca,
  ConfiguracaoCorrecoes,
  ConfiguracoesGerais,
  ConfiguracaoDesignTokens
} from '../../../shared/types'

type SubTab = 'guiches' | 'proporcao' | 'tipos' | 'retornos' | 'comportamento' | 'interface' | 'design' | 'notificacoes' | 'seguranca' | 'correcoes' | 'ia' | 'reiniciar'

const props = withDefaults(defineProps<{
  guichesGlobais: Guiche[]
  proporcaoPrioridade: number
  proporcaoContratual: number
  configuracoes?: ConfiguracoesGerais
  initialTab?: SubTab
}>(), {
  initialTab: 'guiches'
})

const emit = defineEmits<{
  'atualizar-guiches-globais': [guiches: Guiche[]]
  'atualizar-proporcao-prioridade': [valor: number]
  'atualizar-proporcao-contratual': [valor: number]
  'atualizar-guiches-exibicao': [guiches: string[]]
  'atualizar-tipos': [tipos: ConfiguracaoTipoSenha[]]
  'atualizar-motivos': [motivos: ConfiguracaoMotivoRetorno[]]
  'atualizar-comportamento': [config: ConfiguracaoComportamentoFila]
  'atualizar-interface': [config: ConfiguracaoInterface]
  'atualizar-notificacoes': [config: ConfiguracaoNotificacoes]
  'atualizar-seguranca': [config: ConfiguracaoSeguranca]
  'atualizar-correcoes': [config: ConfiguracaoCorrecoes]
  'reiniciar-sistema': []
  'atualizar-design-tokens': [tokens: ConfiguracaoDesignTokens]
}>()

const activeSubTab = ref<SubTab>(props.initialTab)

// Mudar sub-aba
const changeSubTab = (tab: SubTab) => {
  const t0 = performance.now()
  activeSubTab.value = tab
  requestAnimationFrame(() => {
    const dt = performance.now() - t0
    console.log('[Perf] Troca de sub-aba', tab, Math.round(dt), 'ms')
  })
}

// Watch para atualizar quando a prop initialTab mudar
watch(() => props.initialTab, (newTab) => {
  activeSubTab.value = newTab
})

const guichesGlobaisLocal = ref<Guiche[]>([])
const proporcaoPrioridadeLocal = ref(2)
const proporcaoContratualLocal = ref(1)
const guichesExibicaoLocal = ref<string[]>([])

// Carregar configuração local do localStorage
onMounted(() => {
  const saved = localStorage.getItem('sgfila_guiches_exibicao')
  if (saved) {
    guichesExibicaoLocal.value = JSON.parse(saved)
  }
})

// Sincronizar com props
watch(() => props.guichesGlobais, (newVal) => {
  guichesGlobaisLocal.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

watch(() => props.proporcaoPrioridade, (newVal) => {
  proporcaoPrioridadeLocal.value = newVal
}, { immediate: true })

watch(() => props.proporcaoContratual, (newVal) => {
  proporcaoContratualLocal.value = newVal
}, { immediate: true })

const adicionarGuiche = () => {
  const numeroGuiche = guichesGlobaisLocal.value.length + 1
  // ID será gerado pelo servidor - enviar sem ID
  guichesGlobaisLocal.value.push({
    id: '', // Será preenchido pelo servidor
    nome: `Guichê ${numeroGuiche}`,
    ativo: true
  })
  salvarGuichesGlobais()
}

const removerGuiche = (id: string) => {
  const index = guichesGlobaisLocal.value.findIndex(g => g.id === id)
  if (index > -1) {
    guichesGlobaisLocal.value.splice(index, 1)
    salvarGuichesGlobais()
  }
}

const handleToggleAtivo = (guiche: Guiche) => {
  // Se desativar, remover dos guichês de exibição
  if (!guiche.ativo) {
    const index = guichesExibicaoLocal.value.indexOf(guiche.id)
    if (index > -1) {
      guichesExibicaoLocal.value.splice(index, 1)
      localStorage.setItem('sgfila_guiches_exibicao', JSON.stringify(guichesExibicaoLocal.value))
      emit('atualizar-guiches-exibicao', guichesExibicaoLocal.value)
    }
  }
  salvarGuichesGlobais()
}

const salvarGuichesGlobais = () => {
  emit('atualizar-guiches-globais', guichesGlobaisLocal.value)
}

const salvarProporcaoPrioridade = () => {
  emit('atualizar-proporcao-prioridade', proporcaoPrioridadeLocal.value)
}

const salvarProporcaoContratual = () => {
  emit('atualizar-proporcao-contratual', proporcaoContratualLocal.value)
}

const toggleGuicheExibicao = (id: string) => {
  const index = guichesExibicaoLocal.value.indexOf(id)
  if (index > -1) {
    guichesExibicaoLocal.value.splice(index, 1)
  } else {
    guichesExibicaoLocal.value.push(id)
  }
  // Salvar no localStorage
  localStorage.setItem('sgfila_guiches_exibicao', JSON.stringify(guichesExibicaoLocal.value))
  emit('atualizar-guiches-exibicao', guichesExibicaoLocal.value)
}

// Configurações de Tipos de Senha
const tiposConfig = ref<ConfiguracaoTipoSenha[]>([
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
])

const atualizarSubtipos = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const subtipos = input.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
  tiposConfig.value[index].subtipos = subtipos
  salvarTipos()
}

// Flag para saber se estamos carregando do servidor (evita loop)
let carregandoDoServidor = false

// Timeouts para debounce
let timeoutTipos: ReturnType<typeof setTimeout> | null = null
let timeoutMotivos: ReturnType<typeof setTimeout> | null = null
let timeoutComportamento: ReturnType<typeof setTimeout> | null = null
let timeoutInterface: ReturnType<typeof setTimeout> | null = null
let timeoutNotificacoes: ReturnType<typeof setTimeout> | null = null
let timeoutSeguranca: ReturnType<typeof setTimeout> | null = null

const salvarTipos = () => {
  if (carregandoDoServidor) return
  console.log('💾 [ConfigPanel] Salvando tipos de senha')
  emit('atualizar-tipos', tiposConfig.value)
}

// Watch com debounce para detectar mudanças nos tipos
watch(tiposConfig, () => {
  if (carregandoDoServidor) return

  // Debounce: aguarda 300ms sem mudanças antes de salvar
  if (timeoutTipos) clearTimeout(timeoutTipos)
  timeoutTipos = setTimeout(() => {
    console.log('🔄 [ConfigPanel] tiposConfig mudou, salvando')
    salvarTipos()
  }, 300)
}, { deep: true })

// Configurações de Motivos de Retorno
const motivosConfig = ref<ConfiguracaoMotivoRetorno[]>([
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
])

const salvarMotivos = () => {
  if (carregandoDoServidor) return
  console.log('💾 [ConfigPanel] Salvando motivos de retorno')
  emit('atualizar-motivos', motivosConfig.value)
}

watch(motivosConfig, () => {
  if (carregandoDoServidor) return
  if (timeoutMotivos) clearTimeout(timeoutMotivos)
  timeoutMotivos = setTimeout(() => {
    console.log('🔄 [ConfigPanel] motivosConfig mudou, salvando')
    salvarMotivos()
  }, 300)
}, { deep: true })

// Configurações de Comportamento da Fila
const comportamentoConfig = ref<ConfiguracaoComportamentoFila>({
  algoritmo: 'proporcao',
  permitirPularSenhas: true,
  autoFinalizarMinutos: null,
  chamarProximaAutomatica: false,
  tempoEsperaMaximoMinutos: null,
  alertarTempoEsperaExcedido: false
})

const salvarComportamento = () => {
  if (carregandoDoServidor) return
  console.log('💾 [ConfigPanel] Salvando comportamento da fila')
  emit('atualizar-comportamento', comportamentoConfig.value)
}

watch(comportamentoConfig, () => {
  if (carregandoDoServidor) return
  if (timeoutComportamento) clearTimeout(timeoutComportamento)
  timeoutComportamento = setTimeout(() => {
    console.log('🔄 [ConfigPanel] comportamentoConfig mudou, salvando')
    salvarComportamento()
  }, 300)
}, { deep: true })

// Configurações de Interface
const interfaceConfig = ref<ConfiguracaoInterface>({
  tema: 'claro',
  tamanhoFonteSenhas: 'grande',
  formatoNumeroSenha: 'com-hifen',
  mostrarDescricaoSenha: true,
  mostrarTempoEspera: true,
  mostrarTempoAtendimento: true,
  ordenacaoFilaPadrao: 'emissao',
  exibirIconesPrioridade: true
})

// Design Tokens
const designTokens = ref<ConfiguracaoDesignTokens>({
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
  fontSizes: { small: 12, base: 14, md: 16, lg: 18, xl: 20 }
})

const salvarDesignTokens = () => {
  if (carregandoDoServidor) return
  emit('atualizar-design-tokens', designTokens.value)
}

const salvarInterface = () => {
  if (carregandoDoServidor) return
  console.log('💾 [ConfigPanel] Salvando configuração de interface')
  emit('atualizar-interface', interfaceConfig.value)
}

watch(interfaceConfig, () => {
  if (carregandoDoServidor) return
  if (timeoutInterface) clearTimeout(timeoutInterface)
  timeoutInterface = setTimeout(() => {
    console.log('🔄 [ConfigPanel] interfaceConfig mudou, salvando')
    salvarInterface()
  }, 300)
}, { deep: true })

// Configurações de Notificações
const notificacoesConfig = ref<ConfiguracaoNotificacoes>({
  somAtivo: true,
  volumeSom: 80,
  beepsEmissao: 1,
  beepsChamada: 3,
  alertaFilaCheia: false,
  limiteFilaCheia: 100,
  alertaGuicheInativo: false,
  tempoInativoMinutos: 10
})

const salvarNotificacoes = () => {
  if (carregandoDoServidor) return
  console.log('💾 [ConfigPanel] Salvando notificações')
  emit('atualizar-notificacoes', notificacoesConfig.value)
}

watch(notificacoesConfig, () => {
  if (carregandoDoServidor) return
  if (timeoutNotificacoes) clearTimeout(timeoutNotificacoes)
  timeoutNotificacoes = setTimeout(() => {
    console.log('🔄 [ConfigPanel] notificacoesConfig mudou, salvando')
    salvarNotificacoes()
  }, 300)
}, { deep: true })

// Configurações de Segurança
const segurancaConfig = ref<ConfiguracaoSeguranca>({
  senhaAdmin: null,
  exigirConfirmacaoExclusao: true,
  exigirConfirmacaoReinicio: true,
  logAuditoria: false,
  backupAutomatico: false,
  intervaloBackupMinutos: 60
})

const salvarSeguranca = () => {
  if (carregandoDoServidor) return
  console.log('💾 [ConfigPanel] Salvando segurança')
  emit('atualizar-seguranca', segurancaConfig.value)
}

watch(segurancaConfig, () => {
  if (carregandoDoServidor) return
  if (timeoutSeguranca) clearTimeout(timeoutSeguranca)
  timeoutSeguranca = setTimeout(() => {
    console.log('🔄 [ConfigPanel] segurancaConfig mudou, salvando')
    salvarSeguranca()
  }, 300)
}, { deep: true })

// Configurações de Correções (v3.2)
const correcoesConfig = ref<ConfiguracaoCorrecoes>({
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
})

let timeoutCorrecoes: ReturnType<typeof setTimeout> | null = null

const salvarCorrecoes = () => {
  if (carregandoDoServidor) return
  console.log('💾 [ConfigPanel] Salvando configurações de correções')
  emit('atualizar-correcoes', correcoesConfig.value)
}

watch(correcoesConfig, () => {
  if (carregandoDoServidor) return
  if (timeoutCorrecoes) clearTimeout(timeoutCorrecoes)
  timeoutCorrecoes = setTimeout(() => {
    console.log('🔄 [ConfigPanel] correcoesConfig mudou, salvando')
    salvarCorrecoes()
  }, 300)
}, { deep: true })

const confirmarReinicio = () => {
  const confirmacao = confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema (senhas, histórico, contadores).\n\nTem certeza que deseja continuar?')
  if (confirmacao) {
    emit('reiniciar-sistema')
  }
}

// Watch para sincronizar configurações do servidor
watch(() => props.configuracoes, (novasConfiguracoes) => {
  console.log('📥 [ConfigPanel] Recebeu configurações do servidor')

  if (!novasConfiguracoes) {
    console.warn('⚠️ [ConfigPanel] Configurações são null/undefined')
    return
  }

  // Ativar flag para evitar loops
  carregandoDoServidor = true

  // Atualizar tipos de senha
  if (novasConfiguracoes.tiposSenha && novasConfiguracoes.tiposSenha.length > 0) {
    console.log('✅ [ConfigPanel] Carregando', novasConfiguracoes.tiposSenha.length, 'tipos de senha')
    tiposConfig.value = [...novasConfiguracoes.tiposSenha]
  }

  // Atualizar motivos de retorno
  if (novasConfiguracoes.motivosRetorno && novasConfiguracoes.motivosRetorno.length > 0) {
    console.log('✅ [ConfigPanel] Carregando', novasConfiguracoes.motivosRetorno.length, 'motivos de retorno')
    motivosConfig.value = [...novasConfiguracoes.motivosRetorno]
  }

  // Atualizar comportamento da fila
  if (novasConfiguracoes.comportamentoFila) {
    console.log('✅ [ConfigPanel] Carregando comportamento da fila:', novasConfiguracoes.comportamentoFila.algoritmo)
    comportamentoConfig.value = { ...novasConfiguracoes.comportamentoFila }
  }

  // Atualizar interface
  if (novasConfiguracoes.interface) {
    console.log('✅ [ConfigPanel] Carregando interface:', novasConfiguracoes.interface.tema)
    interfaceConfig.value = { ...novasConfiguracoes.interface }
  }

  // Atualizar design tokens
  if (novasConfiguracoes.designTokens) {
    console.log('✅ [ConfigPanel] Carregando design tokens')
    designTokens.value = { ...novasConfiguracoes.designTokens }
  }

  // Atualizar notificações
  if (novasConfiguracoes.notificacoes) {
    console.log('✅ [ConfigPanel] Carregando notificações: som =', novasConfiguracoes.notificacoes.somAtivo)
    notificacoesConfig.value = { ...novasConfiguracoes.notificacoes }
  }

  // Atualizar segurança
  if (novasConfiguracoes.seguranca) {
    console.log('✅ [ConfigPanel] Carregando segurança')
    segurancaConfig.value = { ...novasConfiguracoes.seguranca }
  }

  // Atualizar correções (v3.2)
  if (novasConfiguracoes.correcoes) {
    console.log('✅ [ConfigPanel] Carregando correções')
    correcoesConfig.value = { ...novasConfiguracoes.correcoes }
  }

  // Desativar flag após nextTick para garantir que watches já processaram
  setTimeout(() => {
    carregandoDoServidor = false
    console.log('✅ [ConfigPanel] Configurações carregadas, pronto para aceitar mudanças do usuário')
  }, 100)
}, { immediate: true })
</script>

<style scoped>
.configuration-panel {
  background: white;
}

.sub-tab-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 25px;
  overflow-x: auto;
}

.sub-tab-link {
  padding: 12px 20px;
  border: none;
  background: none;
  color: #868e96;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  font-size: 0.95em;
  white-space: nowrap;
  min-width: fit-content;
}

.sub-tab-link:hover {
  color: #495057;
  background: #f8f9fa;
}

.sub-tab-link.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.sub-tab-content h2,
.sub-tab-content h3 {
  color: #495057;
  margin-bottom: 15px;
}

.sub-tab-content h2 {
  font-size: 1.4em;
}

.sub-tab-content h3 {
  font-size: 1.2em;
}

.hint {
  color: #868e96;
  font-size: 0.9em;
  margin-bottom: 20px;
  line-height: 1.6;
}

.divider {
  margin: 35px 0;
  border: none;
  border-top: 2px solid #e9ecef;
}

.guiche-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.checkbox-item:hover {
  background: #e9ecef;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.badge-inactive {
  background: #ffc107;
  color: #856404;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 600;
  margin-left: auto;
}

.guiche-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.guiche-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.guiche-input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.guiche-input:focus {
  outline: none;
  border-color: #667eea;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 26px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #28a745;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.status-label {
  min-width: 60px;
  font-size: 0.9em;
  color: #868e96;
  font-weight: 600;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-delete {
  background: #ffe5e5;
  color: #dc3545;
}

.btn-delete:hover {
  background: #dc3545;
  color: white;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ratio-controls {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 30px;
}

.ratio-control {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.ratio-control label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 15px;
  font-size: 1.05em;
}

.ratio-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.ratio-input-group input {
  width: 100px;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.3em;
  font-weight: bold;
  text-align: center;
  transition: border-color 0.3s;
}

.ratio-input-group input:focus {
  outline: none;
  border-color: #667eea;
}

.ratio-separator {
  font-size: 1.5em;
  font-weight: bold;
  color: #495057;
}

.ratio-fixed {
  font-size: 1.3em;
  font-weight: bold;
  color: #667eea;
  min-width: 40px;
  text-align: center;
}

.ratio-explanation {
  margin: 0;
  color: #868e96;
  font-size: 0.9em;
  line-height: 1.6;
}

.info-box {
  background: #e7f3ff;
  border-left: 4px solid #007bff;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
}

.info-box i {
  color: #007bff;
  font-size: 1.5em;
}

.info-box strong {
  display: block;
  margin-bottom: 8px;
  color: #495057;
}

.info-box p {
  margin: 0;
  color: #495057;
  line-height: 1.6;
}

.warning-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.warning-box i {
  color: #856404;
  font-size: 1.5em;
}

.warning-box strong {
  display: block;
  margin-bottom: 8px;
  color: #856404;
}

.warning-box p {
  margin: 0;
  color: #856404;
  line-height: 1.6;
}

.btn-reset-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 15px 30px;
  font-size: 1.1em;
}

.btn-reset-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.config-section {
  margin-bottom: 35px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
}

.config-section h3 {
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.1em;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.radio-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.radio-item input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-item span {
  color: #495057;
  font-weight: 500;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-item-config {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.checkbox-item-config:hover {
  background: #f8f9ff;
}

.checkbox-item-config.large {
  padding: 20px;
  border: 2px solid #e9ecef;
}

.checkbox-item-config input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-item-config span {
  color: #495057;
}

.config-subsection {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.slider-control {
  margin-bottom: 20px;
}

.slider-control label {
  display: block;
  margin-bottom: 10px;
  color: #495057;
  font-weight: 600;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
}

.number-control {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.number-control:last-child {
  margin-bottom: 0;
}

.number-control label {
  flex: 1;
  color: #495057;
  font-weight: 500;
}

.number-input {
  width: 100px;
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  text-align: center;
  transition: border-color 0.3s;
}

.number-input:focus {
  outline: none;
  border-color: #667eea;
}

.input-hint {
  color: #868e96;
  font-size: 0.9em;
}

/* Tipos de Senha */
.tipo-senha-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.tipo-senha-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.tipo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f8f9fa;
}

.tipo-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.05em;
}

.tipo-badge i {
  font-size: 1.2em;
}

.tipo-config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-item label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9em;
}

.config-input {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.config-input:focus {
  outline: none;
  border-color: #667eea;
}

.config-input.small {
  width: 80px;
}

.config-input-color {
  width: 60px;
  height: 42px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.config-input-color:hover {
  border-color: #667eea;
}

/* Motivos de Retorno */
.motivo-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.motivo-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.motivo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f8f9fa;
}

.motivo-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05em;
}

.motivo-title i {
  font-size: 1.3em;
}

.motivo-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.config-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.config-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

.section-hint {
  color: #868e96;
  font-size: 0.9em;
  margin-bottom: 15px;
  line-height: 1.6;
}

.config-select {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.config-select:focus {
  outline: none;
  border-color: #667eea;
}

.config-select:hover {
  border-color: #adb5bd;
}

/* IA Dashboard */
.ia-status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.ia-status-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.ia-status-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.ia-status-label {
  font-size: 0.85em;
  color: #868e96;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.ia-status-value {
  font-size: 1.3em;
  font-weight: 700;
  color: #495057;
  margin-bottom: 8px;
}

.ia-status-hint {
  font-size: 0.8em;
  color: #adb5bd;
  margin: 0;
}

.ia-telemetria-placeholder {
  background: white;
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  padding: 50px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.warning-box code,
.ia-telemetria-placeholder code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .tipo-config-grid {
    grid-template-columns: 1fr 1fr;
  }

  .ia-status-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tipo-config-grid,
  .config-grid-2,
  .config-grid-3 {
    grid-template-columns: 1fr;
  }

  .sub-tab-link {
    padding: 10px 12px;
    font-size: 0.85em;
  }

  .sub-tab-link i {
    display: block;
    margin-bottom: 4px;
  }

  .ia-status-grid {
    grid-template-columns: 1fr;
  }
}
</style>
