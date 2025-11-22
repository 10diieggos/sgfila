import { IAManager } from '../IAManager';
import { StateManager } from '../StateManager';
import { EstadoSistema, Senha, TipoSenha } from '../../../../shared/types';

/**
 * Testes unitários para IAManager
 *
 * Cobertura:
 * - Gate de ML Hint (score, latency, top-3)
 * - Cálculo JSED (peso base, aging, fast track)
 * - WRR (detecção de desbalanceamento, escolha)
 * - Tempo limite absoluto
 * - Telemetria de decisões
 */

describe('IAManager', () => {
  let iaManager: IAManager;
  let mockStateManager: jest.Mocked<StateManager>;
  let estado: EstadoSistema;

  beforeEach(() => {
    // Mock do StateManager
    mockStateManager = {
      getEstado: jest.fn(),
      registrarDecisaoIA: jest.fn(),
      salvarEstado: jest.fn(),
      atualizarRoteamento: jest.fn()
    } as any;

    // Estado padrão para testes
    estado = createEstadoBase();
    mockStateManager.getEstado.mockReturnValue(estado);

    iaManager = new IAManager(mockStateManager);
  });

  // ============================================================================
  // HELPERS
  // ============================================================================

  function createEstadoBase(): EstadoSistema {
    return {
      senhas: [],
      guiches: [],
      totalChamadasRecente: 0,
      chamadasPorTipoRecente: {
        prioridade: 0,
        contratual: 0,
        normal: 0
      },
      wrrAtivo: false,
      ultimaDecisaoIA: null,
      iaTelemetria: [],
      configuracoes: {
        roteamento: {
          algoritmo: 'jsed_fair_wrr',
          jsedWeights: {
            prioridade: 2.0,
            contratual: 3.0,
            normal: 1.0
          },
          wfq: {
            alphaAging: 0.5,
            agingWindowMin: 10,
            slowdownMax: 2.0
          },
          fast: {
            msLimit: 120000, // 2 min
            boost: 1.5
          },
          wrr: {
            weights: {
              prioridade: 3,
              contratual: 2,
              normal: 1
            },
            enableThreshold: 0.15,
            windowCalls: 20
          },
          mlHintThresholds: {
            minScore: 0.65,
            maxLatencyMs: 200,
            enabled: true
          }
        }
      }
    } as any;
  }

  function createSenha(
    numero: string,
    tipo: TipoSenha,
    timestampOffset: number = 0,
    tempoLimiteAtingido: boolean = false
  ): Senha {
    return {
      numero,
      tipo,
      timestamp: Date.now() - timestampOffset,
      status: 'aguardando',
      servicoDoCliente: 'Serviço Padrão',
      tempoLimiteAtingido,
      timestampTempoLimite: tempoLimiteAtingido ? Date.now() - timestampOffset : undefined
    } as Senha;
  }

  // ============================================================================
  // TESTES: GATE DE ML HINT
  // ============================================================================

  describe('Gate de ML Hint', () => {

    test('deve aceitar ML Hint se top-3 JSED, score >= 0.65 e latency <= 200ms', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000), // 5 min espera
        createSenha('C002', 'contratual', 240000), // 4 min espera
        createSenha('N003', 'normal', 180000)      // 3 min espera
      ];

      const mlHint = {
        numeroPrevisto: 'P001',
        score: 0.75,
        latencyMs: 150,
        source: 'onnx' as const
      };

      const resultado = iaManager.chamarProximaSenha(estado, senhas, mlHint);

      expect(resultado?.numero).toBe('P001');
      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          numero: 'P001',
          source: 'mlHint-desempate',
          confianca: 0.75
        })
      );
    });

    test('deve rejeitar ML Hint se score < 0.65', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 240000),
        createSenha('N003', 'normal', 180000)
      ];

      const mlHint = {
        numeroPrevisto: 'P001',
        score: 0.55, // Abaixo do threshold
        latencyMs: 150,
        source: 'onnx' as const
      };

      const resultado = iaManager.chamarProximaSenha(estado, senhas, mlHint);

      // Deve escolher por JSED, não ML Hint
      expect(resultado?.numero).not.toBe(undefined);

      // Deve registrar rejeição
      const calls = mockStateManager.registrarDecisaoIA.mock.calls;
      const rejeitouMLHint = calls.some(call =>
        call[0].source === 'jsed_fair_wrr' &&
        JSON.stringify(call).includes('rejeitado')
      );
      expect(rejeitouMLHint).toBe(true);
    });

    test('deve rejeitar ML Hint se latency > 200ms', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 240000),
        createSenha('N003', 'normal', 180000)
      ];

      const mlHint = {
        numeroPrevisto: 'P001',
        score: 0.75,
        latencyMs: 250, // Acima do threshold
        source: 'onnx' as const
      };

      const resultado = iaManager.chamarProximaSenha(estado, senhas, mlHint);

      expect(resultado?.numero).not.toBe(undefined);

      const calls = mockStateManager.registrarDecisaoIA.mock.calls;
      const rejeitouMLHint = calls.some(call =>
        call[0].source === 'jsed_fair_wrr' &&
        JSON.stringify(call).includes('latência alta')
      );
      expect(rejeitouMLHint).toBe(true);
    });

    test('deve rejeitar ML Hint se não estiver no top-3 JSED', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 600000), // 10 min - maior SED
        createSenha('C002', 'contratual', 300000), // 5 min
        createSenha('N003', 'normal', 240000),     // 4 min
        createSenha('N004', 'normal', 180000)      // 3 min
      ];

      const mlHint = {
        numeroPrevisto: 'P001', // Não estará no top-3 devido ao alto tempo de espera + peso
        score: 0.95,
        latencyMs: 50,
        source: 'onnx' as const
      };

      const resultado = iaManager.chamarProximaSenha(estado, senhas, mlHint);

      // Não deve aceitar ML Hint (não está no top-3)
      // A decisão será por JSED
      const calls = mockStateManager.registrarDecisaoIA.mock.calls;
      const aceitouMLHint = calls.some(call => call[0].source === 'mlHint-desempate');
      expect(aceitouMLHint).toBe(false);
    });

    test('deve aceitar qualquer ML Hint no top-3 se enabled=false', () => {
      // Desabilitar validação de thresholds
      estado.configuracoes.roteamento.mlHintThresholds.enabled = false;

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 240000),
        createSenha('N003', 'normal', 180000)
      ];

      const mlHint = {
        numeroPrevisto: 'P001',
        score: 0.30, // Score muito baixo
        latencyMs: 500, // Latência muito alta
        source: 'fallback' as const
      };

      const resultado = iaManager.chamarProximaSenha(estado, senhas, mlHint);

      // Deve aceitar mesmo com score/latency ruins (validação desabilitada)
      expect(resultado?.numero).toBe('P001');
      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'mlHint-desempate'
        })
      );
    });

    test('deve aceitar ML Hint sem latencyMs (undefined) se outros critérios OK', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 240000),
        createSenha('N003', 'normal', 180000)
      ];

      const mlHint = {
        numeroPrevisto: 'P001',
        score: 0.80,
        // latencyMs ausente (undefined)
        source: 'onnx' as const
      };

      const resultado = iaManager.chamarProximaSenha(estado, senhas, mlHint);

      expect(resultado?.numero).toBe('P001');
      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'mlHint-desempate'
        })
      );
    });

  });

  // ============================================================================
  // TESTES: CÁLCULO JSED
  // ============================================================================

  describe('Cálculo JSED', () => {

    test('deve priorizar senha contratual por peso base (W_base = 3.0)', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),  // W_base = 2.0
        createSenha('C002', 'contratual', 300000),  // W_base = 3.0
        createSenha('N003', 'normal', 300000)       // W_base = 1.0
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // Contratual tem maior peso, logo menor SED
      expect(resultado?.numero).toBe('C002');
    });

    test('deve aplicar aging (W_aging) para senhas com maior tempo de espera', () => {
      const senhas: Senha[] = [
        createSenha('N001', 'normal', 600000), // 10 min espera - alto aging
        createSenha('N002', 'normal', 180000)  // 3 min espera - baixo aging
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // N001 tem aging maior, logo menor SED (apesar de mais tempo de espera)
      // Nota: depende dos parâmetros de aging (alphaAging, agingWindowMin)
      expect(resultado?.numero).toBe('N001');
    });

    test('deve aplicar fast track (W_fast) para serviços rápidos', () => {
      // Nota: estimativaServicoMs é fixo em 5 min atualmente
      // Este teste valida a estrutura, mas não terá efeito sem implementação real

      const senhas: Senha[] = [
        createSenha('N001', 'normal', 300000),
        createSenha('N002', 'normal', 300000)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      expect(resultado).not.toBeNull();
      // Como estimativa é fixa, fast track não se aplica
    });

  });

  // ============================================================================
  // TESTES: TEMPO LIMITE ABSOLUTO
  // ============================================================================

  describe('Tempo Limite Absoluto', () => {

    test('deve priorizar senhas com tempoLimiteAtingido', () => {
      const senhas: Senha[] = [
        createSenha('N001', 'normal', 180000, false),          // Sem tempo limite
        createSenha('P002', 'prioridade', 1200000, true),      // Com tempo limite (20 min)
        createSenha('C003', 'contratual', 240000, false)       // Sem tempo limite
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // P002 deve ser escolhida por tempo limite absoluto
      expect(resultado?.numero).toBe('P002');
    });

    test('deve considerar apenas senhas com tempo limite quando existirem', () => {
      const senhas: Senha[] = [
        createSenha('N001', 'normal', 180000, false),
        createSenha('P002', 'prioridade', 1200000, true),
        createSenha('P003', 'prioridade', 1500000, true),
        createSenha('C004', 'contratual', 240000, false)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // Deve escolher entre P002 e P003 (ambos com tempo limite)
      // P002 foi marcado primeiro (menor timestampTempoLimite)
      expect(['P002', 'P003']).toContain(resultado?.numero);
    });

    test('deve ordenar senhas com tempo limite por timestampTempoLimite', () => {
      const agora = Date.now();
      const senhas: Senha[] = [
        {
          ...createSenha('P001', 'prioridade', 0, true),
          timestampTempoLimite: agora - 300000 // 5 min atrás
        },
        {
          ...createSenha('P002', 'prioridade', 0, true),
          timestampTempoLimite: agora - 600000 // 10 min atrás (mais antigo)
        },
        {
          ...createSenha('P003', 'prioridade', 0, true),
          timestampTempoLimite: agora - 120000 // 2 min atrás
        }
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // P002 é o mais antigo em tempo limite
      expect(resultado?.numero).toBe('P002');
    });

  });

  // ============================================================================
  // TESTES: WRR (Weighted Round Robin)
  // ============================================================================

  describe('WRR - Weighted Round Robin', () => {

    test('deve ativar WRR quando desbalanceamento > threshold', () => {
      // Simular 30 chamadas: 20 normais, 5 contratuais, 5 prioridade
      estado.totalChamadasRecente = 30;
      estado.chamadasPorTipoRecente = {
        prioridade: 5,  // Real: 16.7%, Esperado: 50% (peso 3/6)
        contratual: 5,  // Real: 16.7%, Esperado: 33.3% (peso 2/6)
        normal: 20      // Real: 66.7%, Esperado: 16.7% (peso 1/6)
      };

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 300000),
        createSenha('N003', 'normal', 300000)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // WRR deve escolher o tipo mais sub-atendido (prioridade ou contratual)
      expect(['P001', 'C002']).toContain(resultado?.numero);

      // Estado deve indicar WRR ativo
      expect(estado.wrrAtivo).toBe(true);

      // Deve registrar decisão WRR
      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'wrr'
        })
      );
    });

    test('não deve ativar WRR se totalChamadasRecente < windowCalls', () => {
      estado.totalChamadasRecente = 10; // Abaixo de windowCalls (20)
      estado.chamadasPorTipoRecente = {
        prioridade: 1,
        contratual: 1,
        normal: 8
      };

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('N002', 'normal', 300000)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // WRR não deve ser ativado
      expect(estado.wrrAtivo).toBe(false);
    });

    test('não deve ativar WRR se desbalanceamento <= threshold', () => {
      // Simular proporções quase perfeitas
      estado.totalChamadasRecente = 60;
      estado.chamadasPorTipoRecente = {
        prioridade: 30,  // Esperado: 50%, Real: 50%
        contratual: 20,  // Esperado: 33.3%, Real: 33.3%
        normal: 10       // Esperado: 16.7%, Real: 16.7%
      };

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 300000),
        createSenha('N003', 'normal', 300000)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // WRR não deve ser ativado (sem desbalanceamento)
      expect(estado.wrrAtivo).toBe(false);
    });

    test('deve escolher o tipo mais sub-atendido no WRR', () => {
      estado.totalChamadasRecente = 30;
      estado.chamadasPorTipoRecente = {
        prioridade: 2,   // Muito sub-atendido
        contratual: 8,
        normal: 20
      };

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 300000),
        createSenha('N003', 'normal', 300000)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // Prioridade é o mais sub-atendido
      expect(resultado?.numero).toBe('P001');
    });

  });

  // ============================================================================
  // TESTES: TELEMETRIA
  // ============================================================================

  describe('Telemetria de Decisões', () => {

    test('deve registrar decisão JSED em ultimaDecisaoIA', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000)
      ];

      iaManager.chamarProximaSenha(estado, senhas);

      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          numero: 'P001',
          source: expect.stringContaining('jsed'),
          timestamp: expect.any(Number)
        })
      );
    });

    test('deve registrar decisão ML Hint com confiança do score', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 240000),
        createSenha('N003', 'normal', 180000)
      ];

      const mlHint = {
        numeroPrevisto: 'P001',
        score: 0.92,
        latencyMs: 100,
        source: 'onnx' as const
      };

      iaManager.chamarProximaSenha(estado, senhas, mlHint);

      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          numero: 'P001',
          source: 'mlHint-desempate',
          confianca: 0.92
        })
      );
    });

    test('deve incluir top-3 JSED na telemetria', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 240000),
        createSenha('N003', 'normal', 180000),
        createSenha('N004', 'normal', 120000)
      ];

      iaManager.chamarProximaSenha(estado, senhas);

      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          top3: expect.arrayContaining([expect.any(String)])
        })
      );

      // Verificar que top3 tem até 3 elementos
      const call = mockStateManager.registrarDecisaoIA.mock.calls[0][0];
      expect(call.top3?.length).toBeLessThanOrEqual(3);
    });

    test('deve indicar wrrAtivo quando WRR escolher senha', () => {
      estado.totalChamadasRecente = 30;
      estado.chamadasPorTipoRecente = {
        prioridade: 2,
        contratual: 5,
        normal: 23
      };

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000)
      ];

      iaManager.chamarProximaSenha(estado, senhas);

      expect(mockStateManager.registrarDecisaoIA).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'wrr',
          wrrAtivo: true
        })
      );
    });

  });

  // ============================================================================
  // TESTES: PREVIEW JSED
  // ============================================================================

  describe('ordenarFilaPorJSED (Preview)', () => {

    test('deve ordenar fila por SED crescente', () => {
      const senhas: Senha[] = [
        createSenha('N001', 'normal', 600000),     // Alto tempo de espera
        createSenha('C002', 'contratual', 300000), // Peso alto
        createSenha('P003', 'prioridade', 240000)
      ];

      const preview = iaManager.ordenarFilaPorJSED(estado, senhas);

      expect(preview).toHaveLength(3);
      // C002 deve ter SED menor (peso contratual 3.0)
      expect(preview[0]).toBe('C002');
    });

    test('deve separar senhas com tempo limite no início', () => {
      const senhas: Senha[] = [
        createSenha('N001', 'normal', 180000, false),
        createSenha('P002', 'prioridade', 1200000, true),
        createSenha('C003', 'contratual', 240000, false),
        createSenha('N004', 'normal', 600000, true)
      ];

      const preview = iaManager.ordenarFilaPorJSED(estado, senhas);

      // Primeiras posições devem ser senhas com tempo limite
      expect(preview.slice(0, 2)).toEqual(expect.arrayContaining(['P002', 'N004']));
    });

    test('deve retornar array vazio se não houver senhas', () => {
      const preview = iaManager.ordenarFilaPorJSED(estado, []);

      expect(preview).toEqual([]);
    });

  });

  // ============================================================================
  // TESTES: EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {

    test('deve retornar null se não houver senhas elegíveis', () => {
      const resultado = iaManager.chamarProximaSenha(estado, []);

      expect(resultado).toBeNull();
    });

    test('deve lidar com uma única senha', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      expect(resultado?.numero).toBe('P001');
    });

    test('deve resetar wrrAtivo no início de cada decisão', () => {
      estado.wrrAtivo = true; // Estado anterior

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000)
      ];

      iaManager.chamarProximaSenha(estado, senhas);

      // Se WRR não for ativado, wrrAtivo deve ser false
      // (neste caso, sem desbalanceamento, não ativa WRR)
      expect(estado.wrrAtivo).toBe(false);
    });

    test('deve lidar com ML Hint de senha inexistente', () => {
      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000)
      ];

      const mlHint = {
        numeroPrevisto: 'INEXISTENTE',
        score: 0.95,
        latencyMs: 50,
        source: 'onnx' as const
      };

      const resultado = iaManager.chamarProximaSenha(estado, senhas, mlHint);

      // Deve escolher por JSED, ignorando ML Hint
      expect(resultado?.numero).toBe('P001');
    });

    test('deve lidar com todos os pesos WRR = 0', () => {
      estado.configuracoes.roteamento.wrr.weights = {
        prioridade: 0,
        contratual: 0,
        normal: 0
      };
      estado.totalChamadasRecente = 30;
      estado.chamadasPorTipoRecente = {
        prioridade: 10,
        contratual: 10,
        normal: 10
      };

      const senhas: Senha[] = [
        createSenha('P001', 'prioridade', 300000),
        createSenha('C002', 'contratual', 300000)
      ];

      const resultado = iaManager.chamarProximaSenha(estado, senhas);

      // Deve retornar primeira senha elegível (fallback)
      expect(resultado).not.toBeNull();
    });

  });

});
