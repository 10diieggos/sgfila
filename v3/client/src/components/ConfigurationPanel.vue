<template>
  <div class="configuration-panel">
    <!-- Sub-tabs -->
    <div class="sub-tab-nav">
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'guiches' }]"
        @click="changeSubTab('guiches')"
      >
        <i class="fas fa-desktop"></i> Guichês
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'proporcao' }]"
        @click="changeSubTab('proporcao')"
      >
        <i class="fas fa-balance-scale-right"></i> Proporção
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'tipos' }]"
        @click="changeSubTab('tipos')"
      >
        <i class="fas fa-ticket-alt"></i> Tipos
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'retornos' }]"
        @click="changeSubTab('retornos')"
      >
        <i class="fas fa-undo"></i> Retornos
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'comportamento' }]"
        @click="changeSubTab('comportamento')"
      >
        <i class="fas fa-cogs"></i> Comportamento
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'interface' }]"
        @click="changeSubTab('interface')"
      >
        <i class="fas fa-palette"></i> Interface
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'notificacoes' }]"
        @click="changeSubTab('notificacoes')"
      >
        <i class="fas fa-bell"></i> Notificações
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'seguranca' }]"
        @click="changeSubTab('seguranca')"
      >
        <i class="fas fa-shield-alt"></i> Segurança
      </button>
      <button
        :class="['sub-tab-link', { active: activeSubTab === 'reiniciar' }]"
        @click="changeSubTab('reiniciar')"
      >
        <i class="fas fa-redo"></i> Reiniciar
      </button>
    </div>

    <!-- Conteúdo Guichês -->
    <div v-if="activeSubTab === 'guiches'" class="sub-tab-content">
      <!-- Exibição Local -->
      <h3><i class="fas fa-desktop-alt"></i> Exibição (Este Navegador)</h3>
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
          />
          <span>{{ guiche.nome }}</span>
          <span v-if="!guiche.ativo" class="badge-inactive">Inativo</span>
        </label>
      </div>

      <hr class="divider" />

      <!-- Guichês Globais -->
      <h3><i class="fas fa-users-cog"></i> Guichês (Global)</h3>
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
            type="text"
            v-model="guiche.nome"
            placeholder="Nome do guichê"
            class="guiche-input"
            @input="salvarGuichesGlobais"
            @blur="salvarGuichesGlobais"
          />
          <label class="toggle-switch">
            <input
              type="checkbox"
              v-model="guiche.ativo"
              @change="handleToggleAtivo(guiche)"
            />
            <span class="toggle-slider"></span>
          </label>
          <span class="status-label">{{ guiche.ativo ? 'Ativo' : 'Inativo' }}</span>
          <button
            class="btn-icon btn-delete"
            @click="removerGuiche(guiche.id)"
            title="Remover guichê"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <button class="btn btn-add" @click="adicionarGuiche">
        <i class="fas fa-plus"></i> Adicionar Guichê
      </button>
    </div>

    <!-- Conteúdo Proporção -->
    <div v-if="activeSubTab === 'proporcao'" class="sub-tab-content">
      <h2><i class="fas fa-balance-scale-right"></i> Configurações de Proporção</h2>
      <p class="hint">
        Defina a proporção de atendimento entre tipos de senha.
        Exemplo: P:N = 2:1 significa que a cada 2 senhas prioritárias, 1 normal é chamada.
      </p>

      <div class="ratio-controls">
        <div class="ratio-control">
          <label for="input-ratio">
            <i class="fas fa-wheelchair"></i> Proporção Prioritária : Normal (P:N):
          </label>
          <div class="ratio-input-group">
            <input
              type="number"
              id="input-ratio"
              v-model.number="proporcaoPrioridadeLocal"
              min="1"
              max="20"
              @blur="salvarProporcaoPrioridade"
            />
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
            <i class="fas fa-file-contract"></i> Proporção Contratual : Normal (C:N):
          </label>
          <div class="ratio-input-group">
            <input
              type="number"
              id="input-ratio-contratual"
              v-model.number="proporcaoContratualLocal"
              min="1"
              max="20"
              @blur="salvarProporcaoContratual"
            />
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
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Como funciona a lógica de proporção:</strong>
          <p>
            O sistema alterna entre prioridades e contratos conforme as proporções definidas,
            sempre respeitando a ordem de chegada dentro de cada tipo.
            Senhas prioritárias têm precedência sobre contratuais.
          </p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Tipos de Senha -->
    <div v-if="activeSubTab === 'tipos'" class="sub-tab-content">
      <h2><i class="fas fa-ticket-alt"></i> Tipos de Senha</h2>
      <p class="hint">
        Configure os tipos de senha disponíveis no sistema, incluindo cores, prefixos e subtipos.
      </p>

      <div class="info-box">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Importante:</strong>
          <p>Alterações nos tipos de senha afetam todo o sistema. Tipos desativados não estarão disponíveis para emissão.</p>
        </div>
      </div>

      <div v-for="(tipo, index) in tiposConfig" :key="tipo.id" class="tipo-senha-card">
        <div class="tipo-header">
          <div class="tipo-badge" :style="{ background: tipo.corFundo, color: tipo.cor }">
            <i :class="'fas fa-' + tipo.icone"></i> {{ tipo.nome }}
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="tipo.ativo" @change="salvarTipos" />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="tipo-config-grid">
          <div class="config-item">
            <label>Nome Completo:</label>
            <input type="text" v-model="tipo.nomeCompleto" @blur="salvarTipos" class="config-input" />
          </div>

          <div class="config-item">
            <label>Prefixo:</label>
            <input type="text" v-model="tipo.prefixo" maxlength="3" @blur="salvarTipos" class="config-input small" />
          </div>

          <div class="config-item">
            <label>Cor do Texto:</label>
            <input type="color" v-model="tipo.cor" @change="salvarTipos" class="config-input-color" />
          </div>

          <div class="config-item">
            <label>Cor de Fundo:</label>
            <input type="color" v-model="tipo.corFundo" @change="salvarTipos" class="config-input-color" />
          </div>
        </div>

        <div class="config-item">
          <label>Subtipos (separados por vírgula):</label>
          <input
            type="text"
            :value="tipo.subtipos.join(', ')"
            @blur="atualizarSubtipos(index, $event)"
            class="config-input"
            placeholder="Ex: Idoso, Gestante, Deficiente"
          />
        </div>
      </div>
    </div>

    <!-- Conteúdo Motivos de Retorno -->
    <div v-if="activeSubTab === 'retornos'" class="sub-tab-content">
      <h2><i class="fas fa-undo"></i> Motivos de Retorno</h2>
      <p class="hint">
        Configure os motivos disponíveis para devolução de senhas à fila.
      </p>

      <div v-for="motivo in motivosConfig" :key="motivo.id" class="motivo-card">
        <div class="motivo-header">
          <div class="motivo-title">
            <i :class="'fas fa-' + motivo.icone" :style="{ color: motivo.cor }"></i>
            <strong>{{ motivo.nome }}</strong>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="motivo.ativo" @change="salvarMotivos" />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="motivo-body">
          <div class="config-item">
            <label>Descrição:</label>
            <input type="text" v-model="motivo.descricao" @blur="salvarMotivos" class="config-input" />
          </div>

          <div class="config-grid-2">
            <div class="config-item">
              <label>Prazo (minutos):</label>
              <input
                type="number"
                v-model.number="motivo.prazoMinutos"
                min="0"
                max="120"
                @blur="salvarMotivos"
                class="config-input"
                placeholder="Sem prazo"
              />
            </div>

            <div class="config-item">
              <label>Posição na Fila:</label>
              <select v-model="motivo.posicionamentoFila" @change="salvarMotivos" class="config-select">
                <option value="inicio">Início</option>
                <option value="meio">Meio</option>
                <option value="fim">Fim</option>
                <option value="original">Posição Original</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Comportamento da Fila -->
    <div v-if="activeSubTab === 'comportamento'" class="sub-tab-content">
      <h2><i class="fas fa-cogs"></i> Comportamento da Fila</h2>
      <p class="hint">
        Configure como o sistema gerencia a fila de atendimento.
      </p>

      <div class="config-section">
        <h3>Algoritmo de Chamada</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" value="proporcao" v-model="comportamentoConfig.algoritmo" @change="salvarComportamento" />
            <span>
              <strong>Proporção</strong> - Respeita proporção entre tipos
            </span>
          </label>
          <label class="radio-item">
            <input type="radio" value="round_robin" v-model="comportamentoConfig.algoritmo" @change="salvarComportamento" />
            <span>
              <strong>Round Robin</strong> - Alterna entre tipos igualmente
            </span>
          </label>
          <label class="radio-item">
            <input type="radio" value="fifo" v-model="comportamentoConfig.algoritmo" @change="salvarComportamento" />
            <span>
              <strong>FIFO</strong> - Primeiro a entrar, primeiro a sair
            </span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Opções de Chamada</h3>
        <label class="checkbox-item-config">
          <input type="checkbox" v-model="comportamentoConfig.permitirPularSenhas" @change="salvarComportamento" />
          <span>Permitir pular senhas (chamar senha específica)</span>
        </label>

        <label class="checkbox-item-config">
          <input type="checkbox" v-model="comportamentoConfig.chamarProximaAutomatica" @change="salvarComportamento" />
          <span>Chamar próxima senha automaticamente após finalizar</span>
        </label>
      </div>

      <div class="config-section">
        <h3>Timeouts e Alertas</h3>
        <div class="config-item">
          <label>Auto-finalizar atendimento após (minutos):</label>
          <input
            type="number"
            v-model.number="comportamentoConfig.autoFinalizarMinutos"
            min="0"
            max="120"
            @blur="salvarComportamento"
            class="config-input"
            placeholder="Desativado"
          />
          <p class="input-hint">0 ou vazio = desativado</p>
        </div>

        <div class="config-item">
          <label>Tempo máximo de espera (minutos):</label>
          <input
            type="number"
            v-model.number="comportamentoConfig.tempoEsperaMaximoMinutos"
            min="0"
            max="300"
            @blur="salvarComportamento"
            class="config-input"
            placeholder="Sem limite"
          />
        </div>

        <label class="checkbox-item-config">
          <input type="checkbox" v-model="comportamentoConfig.alertarTempoEsperaExcedido" @change="salvarComportamento" />
          <span>Alertar quando tempo máximo de espera for excedido</span>
        </label>
      </div>
    </div>

    <!-- Conteúdo Segurança -->
    <div v-if="activeSubTab === 'seguranca'" class="sub-tab-content">
      <h2><i class="fas fa-shield-alt"></i> Segurança</h2>
      <p class="hint">
        Configure opções de segurança e proteção do sistema.
      </p>

      <div class="config-section">
        <h3>Confirmações</h3>
        <label class="checkbox-item-config">
          <input type="checkbox" v-model="segurancaConfig.exigirConfirmacaoExclusao" @change="salvarSeguranca" />
          <span>Exigir confirmação para excluir senhas</span>
        </label>

        <label class="checkbox-item-config">
          <input type="checkbox" v-model="segurancaConfig.exigirConfirmacaoReinicio" @change="salvarSeguranca" />
          <span>Exigir confirmação para reiniciar sistema</span>
        </label>
      </div>

      <div class="config-section">
        <h3>Auditoria e Backup</h3>
        <label class="checkbox-item-config">
          <input type="checkbox" v-model="segurancaConfig.logAuditoria" @change="salvarSeguranca" />
          <span>Manter log de auditoria de operações</span>
        </label>

        <label class="checkbox-item-config">
          <input type="checkbox" v-model="segurancaConfig.backupAutomatico" @change="salvarSeguranca" />
          <span>Ativar backup automático</span>
        </label>

        <div v-if="segurancaConfig.backupAutomatico" class="config-subsection">
          <div class="config-item">
            <label>Intervalo de backup (minutos):</label>
            <input
              type="number"
              v-model.number="segurancaConfig.intervaloBackupMinutos"
              min="5"
              max="1440"
              step="5"
              @blur="salvarSeguranca"
              class="config-input"
            />
          </div>
        </div>
      </div>

      <div class="warning-box">
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <strong>Nota de Segurança:</strong>
          <p>As configurações de segurança são importantes para proteger a integridade dos dados do sistema. Certifique-se de configurá-las adequadamente.</p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Interface -->
    <div v-if="activeSubTab === 'interface'" class="sub-tab-content">
      <h2><i class="fas fa-palette"></i> Configurações de Interface</h2>
      <p class="hint">
        Personalize a aparência e o comportamento visual do sistema.
      </p>

      <div class="config-section">
        <h3>Tema</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" value="claro" v-model="interfaceConfig.tema" @change="salvarInterface" />
            <span><i class="fas fa-sun"></i> Claro</span>
          </label>
          <label class="radio-item">
            <input type="radio" value="escuro" v-model="interfaceConfig.tema" @change="salvarInterface" />
            <span><i class="fas fa-moon"></i> Escuro</span>
          </label>
          <label class="radio-item">
            <input type="radio" value="auto" v-model="interfaceConfig.tema" @change="salvarInterface" />
            <span><i class="fas fa-adjust"></i> Automático</span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Tamanho da Fonte (Senhas)</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" value="pequeno" v-model="interfaceConfig.tamanhoFonteSenhas" @change="salvarInterface" />
            <span>Pequeno</span>
          </label>
          <label class="radio-item">
            <input type="radio" value="medio" v-model="interfaceConfig.tamanhoFonteSenhas" @change="salvarInterface" />
            <span>Médio</span>
          </label>
          <label class="radio-item">
            <input type="radio" value="grande" v-model="interfaceConfig.tamanhoFonteSenhas" @change="salvarInterface" />
            <span>Grande</span>
          </label>
          <label class="radio-item">
            <input type="radio" value="extra-grande" v-model="interfaceConfig.tamanhoFonteSenhas" @change="salvarInterface" />
            <span>Extra Grande</span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Formato do Número da Senha</h3>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" value="com-hifen" v-model="interfaceConfig.formatoNumeroSenha" @change="salvarInterface" />
            <span>Com hífen (P-001)</span>
          </label>
          <label class="radio-item">
            <input type="radio" value="sem-hifen" v-model="interfaceConfig.formatoNumeroSenha" @change="salvarInterface" />
            <span>Sem hífen (P001)</span>
          </label>
          <label class="radio-item">
            <input type="radio" value="apenas-numero" v-model="interfaceConfig.formatoNumeroSenha" @change="salvarInterface" />
            <span>Apenas número (001)</span>
          </label>
        </div>
      </div>

      <div class="config-section">
        <h3>Opções de Exibição</h3>
        <div class="checkbox-list">
          <label class="checkbox-item-config">
            <input type="checkbox" v-model="interfaceConfig.mostrarDescricaoSenha" @change="salvarInterface" />
            <span>Mostrar descrição das senhas</span>
          </label>
          <label class="checkbox-item-config">
            <input type="checkbox" v-model="interfaceConfig.mostrarTempoEspera" @change="salvarInterface" />
            <span>Mostrar tempo de espera</span>
          </label>
          <label class="checkbox-item-config">
            <input type="checkbox" v-model="interfaceConfig.mostrarTempoAtendimento" @change="salvarInterface" />
            <span>Mostrar tempo de atendimento</span>
          </label>
          <label class="checkbox-item-config">
            <input type="checkbox" v-model="interfaceConfig.exibirIconesPrioridade" @change="salvarInterface" />
            <span>Exibir ícones de prioridade</span>
          </label>
        </div>
      </div>

      <div class="info-box">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Nota:</strong>
          <p>Algumas alterações podem exigir recarregar a página para serem totalmente aplicadas.</p>
        </div>
      </div>
    </div>

    <!-- Conteúdo Notificações -->
    <div v-if="activeSubTab === 'notificacoes'" class="sub-tab-content">
      <h2><i class="fas fa-bell"></i> Configurações de Notificações</h2>
      <p class="hint">
        Configure alertas sonoros e notificações do sistema.
      </p>

      <div class="config-section">
        <h3>Som</h3>
        <label class="checkbox-item-config large">
          <input type="checkbox" v-model="notificacoesConfig.somAtivo" @change="salvarNotificacoes" />
          <span><strong>Ativar som</strong></span>
        </label>

        <div v-if="notificacoesConfig.somAtivo" class="config-subsection">
          <div class="slider-control">
            <label>
              Volume do Som: <strong>{{ notificacoesConfig.volumeSom }}%</strong>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              v-model.number="notificacoesConfig.volumeSom"
              @change="salvarNotificacoes"
              class="slider"
            />
          </div>

          <div class="number-control">
            <label>Número de beeps na emissão:</label>
            <input
              type="number"
              min="1"
              max="5"
              v-model.number="notificacoesConfig.beepsEmissao"
              @change="salvarNotificacoes"
              class="number-input"
            />
          </div>

          <div class="number-control">
            <label>Número de beeps na chamada:</label>
            <input
              type="number"
              min="1"
              max="10"
              v-model.number="notificacoesConfig.beepsChamada"
              @change="salvarNotificacoes"
              class="number-input"
            />
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Alertas</h3>
        <label class="checkbox-item-config">
          <input type="checkbox" v-model="notificacoesConfig.alertaFilaCheia" @change="salvarNotificacoes" />
          <span>Alertar quando fila estiver cheia</span>
        </label>

        <div v-if="notificacoesConfig.alertaFilaCheia" class="config-subsection">
          <div class="number-control">
            <label>Limite para fila cheia:</label>
            <input
              type="number"
              min="10"
              max="500"
              step="10"
              v-model.number="notificacoesConfig.limiteFilaCheia"
              @change="salvarNotificacoes"
              class="number-input"
            />
            <span class="input-hint">senhas</span>
          </div>
        </div>

        <label class="checkbox-item-config">
          <input type="checkbox" v-model="notificacoesConfig.alertaGuicheInativo" @change="salvarNotificacoes" />
          <span>Alertar quando guichê ficar inativo</span>
        </label>

        <div v-if="notificacoesConfig.alertaGuicheInativo" class="config-subsection">
          <div class="number-control">
            <label>Tempo de inatividade:</label>
            <input
              type="number"
              min="1"
              max="60"
              v-model.number="notificacoesConfig.tempoInativoMinutos"
              @change="salvarNotificacoes"
              class="number-input"
            />
            <span class="input-hint">minutos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Reiniciar -->
    <div v-if="activeSubTab === 'reiniciar'" class="sub-tab-content">
      <h2><i class="fas fa-redo"></i> Reiniciar Sistema</h2>
      <p class="hint">
        Esta ação irá reiniciar completamente o sistema, zerando todos os contadores
        e removendo todas as senhas (em espera, em atendimento e histórico).
      </p>

      <div class="warning-box">
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <strong>⚠️ ATENÇÃO:</strong>
          <p>
            Esta ação é <strong>irreversível</strong> e irá apagar todos os dados do dia.
            Certifique-se de que deseja realmente reiniciar o sistema antes de confirmar.
          </p>
        </div>
      </div>

      <button class="btn btn-reset-danger" @click="confirmarReinicio">
        <i class="fas fa-redo"></i> Reiniciar Sistema Agora
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
  ConfiguracaoSeguranca
} from '../../../shared/types'

type SubTab = 'guiches' | 'proporcao' | 'tipos' | 'retornos' | 'comportamento' | 'interface' | 'notificacoes' | 'seguranca' | 'reiniciar'

const props = withDefaults(defineProps<{
  guichesGlobais: Guiche[]
  proporcaoPrioridade: number
  proporcaoContratual: number
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
  'reiniciar-sistema': []
}>()

const activeSubTab = ref<SubTab>(props.initialTab)

// Mudar sub-aba
const changeSubTab = (tab: SubTab) => {
  activeSubTab.value = tab
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

const salvarTipos = () => {
  emit('atualizar-tipos', tiposConfig.value)
}

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
  emit('atualizar-motivos', motivosConfig.value)
}

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
  emit('atualizar-comportamento', comportamentoConfig.value)
}

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

const salvarInterface = () => {
  emit('atualizar-interface', interfaceConfig.value)
}

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
  emit('atualizar-notificacoes', notificacoesConfig.value)
}

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
  emit('atualizar-seguranca', segurancaConfig.value)
}

const confirmarReinicio = () => {
  const confirmacao = confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema (senhas, histórico, contadores).\n\nTem certeza que deseja continuar?')
  if (confirmacao) {
    emit('reiniciar-sistema')
  }
}
</script>

<style scoped>
.configuration-panel {
  background: white;
}

.sub-tab-nav {
  display: flex;
  gap: 5px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 25px;
}

.sub-tab-link {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: none;
  color: #868e96;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  font-size: 0.95em;
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

/* Responsive adjustments */
@media (max-width: 1200px) {
  .tipo-config-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .tipo-config-grid,
  .config-grid-2 {
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
}
</style>
