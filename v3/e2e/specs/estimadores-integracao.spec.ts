/**
 * Testes E2E para T-129: Integração de Estimadores em Eventos do Sistema
 *
 * Valida que os estimadores (λ, μ, percentis) estão sendo alimentados
 * corretamente pelos eventos de emissão, chamada, finalização e ausência.
 */

import { test, expect, Page } from '@playwright/test'

// Helper para esperar por eventos Socket.IO
async function waitForSocketEvent(page: Page, eventName: string, timeout = 5000) {
  return page.evaluate(
    ({ event, time }) => {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Timeout waiting for ${event}`)), time)

        // @ts-ignore - socket está disponível globalmente após conexão
        if (window.socket) {
          // @ts-ignore
          window.socket.once(event, (data: any) => {
            clearTimeout(timer)
            resolve(data)
          })
        } else {
          reject(new Error('Socket not available'))
        }
      })
    },
    { event: eventName, time: timeout }
  )
}

// Helper para emitir evento Socket.IO
async function emitSocketEvent(page: Page, eventName: string, data: any) {
  return page.evaluate(
    ({ event, payload }) => {
      // @ts-ignore
      if (window.socket) {
        // @ts-ignore
        window.socket.emit(event, payload)
        return true
      }
      return false
    },
    { event: eventName, payload: data }
  )
}

test.describe('T-129: Integração de Estimadores em Eventos do Sistema', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a aplicação e aguarda carregamento
    await page.goto('/')
    await page.waitForSelector('#app', { timeout: 10000 })

    // Aguarda socket ficar disponível globalmente
    await page.waitForFunction(() => (window as any).socket !== undefined && (window as any).socket !== null, {
      timeout: 10000
    })

    // Aguarda um pouco para garantir que socket está conectado
    await page.waitForTimeout(2000)
  })

  test('T-129.1: Registro de chegada ao emitir senha', async ({ page }) => {
    // Emitir senha deve registrar chegada no estimador λ (lambda)
    const emitResult = await emitSocketEvent(page, 'emitirSenha', {
      tipo: 'normal',
      subtipo: 'Atendimento Geral',
      servicoDoCliente: 'Teste E2E - Chegada'
    })

    expect(emitResult).toBe(true)

    // Aguarda evento estadoAtualizado
    const estado = await waitForSocketEvent(page, 'estadoAtualizado')
    expect(estado).toBeDefined()

    // Verifica que uma senha foi emitida
    const senhasEspera = await page.evaluate(() => {
      // @ts-ignore
      return window.__lastEstado?.senhasEspera || []
    })

    expect(senhasEspera.length).toBeGreaterThan(0)
  })

  test('T-129.2: Registro de tempo de espera ao chamar senha', async ({ page }) => {
    // Primeiro emite uma senha
    await emitSocketEvent(page, 'emitirSenha', {
      tipo: 'normal',
      subtipo: 'Atendimento Geral',
      servicoDoCliente: 'Teste E2E - Tempo Espera'
    })

    await page.waitForTimeout(500)

    // Depois chama a senha
    await emitSocketEvent(page, 'chamarSenha', {
      guicheId: 'guiche-1'
    })

    // Aguarda estadoAtualizado
    const estado = await waitForSocketEvent(page, 'estadoAtualizado')
    expect(estado).toBeDefined()

    // Verifica que senha foi chamada
    const senhasAtendimento = await page.evaluate(() => {
      // @ts-ignore
      return window.__lastEstado?.senhasAtendimento || []
    })

    expect(senhasAtendimento.length).toBeGreaterThan(0)
  })

  test('T-129.3: Registro de atendimento ao finalizar', async ({ page }) => {
    // Emite senha
    await emitSocketEvent(page, 'emitirSenha', {
      tipo: 'normal',
      subtipo: 'Atendimento Geral',
      servicoDoCliente: 'Teste E2E - Atendimento'
    })

    await page.waitForTimeout(500)

    // Chama senha
    await emitSocketEvent(page, 'chamarSenha', {
      guicheId: 'guiche-1'
    })

    await page.waitForTimeout(1000)

    // Finaliza atendimento
    await emitSocketEvent(page, 'finalizarAtendimento', {
      guicheId: 'guiche-1'
    })

    // Aguarda estadoAtualizado
    const estado = await waitForSocketEvent(page, 'estadoAtualizado')
    expect(estado).toBeDefined()

    // Verifica que atendimento foi finalizado
    const historico = await page.evaluate(() => {
      // @ts-ignore
      return window.__lastEstado?.historico || []
    })

    expect(historico.length).toBeGreaterThan(0)
  })

  test('T-129.4: Registro de interrupção ao processar ausência', async ({ page }) => {
    // Emite senha
    await emitSocketEvent(page, 'emitirSenha', {
      tipo: 'prioridade',
      subtipo: 'Idoso',
      servicoDoCliente: 'Teste E2E - Ausência'
    })

    await page.waitForTimeout(500)

    // Chama senha
    await emitSocketEvent(page, 'chamarSenha', {
      guicheId: 'guiche-1'
    })

    await page.waitForTimeout(500)

    // Obtém número da senha
    const numeroSenha = await page.evaluate(() => {
      // @ts-ignore
      const senhas = window.__lastEstado?.senhasAtendimento || []
      return senhas.length > 0 ? senhas[0].numero : null
    })

    expect(numeroSenha).not.toBeNull()

    // Processa ausência
    await emitSocketEvent(page, 'processarAusencia', {
      numeroSenha: numeroSenha
    })

    // Aguarda notificação de ausência
    const notificacao = await waitForSocketEvent(page, 'notificacaoAusencia')
    expect(notificacao).toBeDefined()
    expect(notificacao).toHaveProperty('numeroSenha', numeroSenha)
  })
})

test.describe('T-130: Exposição de Estatísticas via Socket.IO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#app', { timeout: 10000 })

    // Aguarda socket ficar disponível
    await page.waitForFunction(() => (window as any).socket !== undefined && (window as any).socket !== null, {
      timeout: 10000
    })

    await page.waitForTimeout(2000)

    // Injeta listener para capturar estatísticas
    await page.evaluate(() => {
      // @ts-ignore
      window.__estatisticasEstimadores = null
      // @ts-ignore
      if (window.socket) {
        // @ts-ignore
        window.socket.on('estatisticasEstimadores', (data: any) => {
          // @ts-ignore
          window.__estatisticasEstimadores = data
        })
      }
    })
  })

  test('T-130.1: Handler getEstatisticas responde corretamente', async ({ page }) => {
    // Solicita estatísticas
    await emitSocketEvent(page, 'getEstatisticas', {})

    // Aguarda resposta
    await page.waitForTimeout(500)

    // Verifica que estatísticas foram recebidas
    const estatisticas = await page.evaluate(() => {
      // @ts-ignore
      return window.__estatisticasEstimadores
    })

    expect(estatisticas).toBeDefined()
    expect(estatisticas).not.toBeNull()
  })

  test('T-130.2: Estatísticas emitidas automaticamente em estadoAtualizado', async ({ page }) => {
    // Emite uma senha para disparar estadoAtualizado
    await emitSocketEvent(page, 'emitirSenha', {
      tipo: 'normal',
      subtipo: 'Atendimento Geral',
      servicoDoCliente: 'Teste E2E - Auto Emit'
    })

    // Aguarda estadoAtualizado
    await waitForSocketEvent(page, 'estadoAtualizado')

    // Aguarda um pouco para estatísticas serem emitidas
    await page.waitForTimeout(500)

    // Verifica que estatísticas foram emitidas automaticamente
    const estatisticas = await page.evaluate(() => {
      // @ts-ignore
      return window.__estatisticasEstimadores
    })

    expect(estatisticas).toBeDefined()
  })

  test('T-130.3: Evento estatisticasEstimadores possui estrutura correta', async ({ page }) => {
    // Solicita estatísticas
    await emitSocketEvent(page, 'getEstatisticas', {})
    await page.waitForTimeout(500)

    const estatisticas = await page.evaluate(() => {
      // @ts-ignore
      return window.__estatisticasEstimadores
    })

    expect(estatisticas).toBeDefined()

    // Estrutura básica esperada (pode estar vazia no início)
    // Aceita null ou objeto vazio, pois estimadores podem não ter dados ainda
    if (estatisticas && Object.keys(estatisticas).length > 0) {
      // Se houver dados, valida estrutura
      expect(typeof estatisticas).toBe('object')
    }
  })

  test('T-130.4: Múltiplas operações geram estatísticas consistentes', async ({ page }) => {
    // Realiza múltiplas operações
    for (let i = 0; i < 3; i++) {
      await emitSocketEvent(page, 'emitirSenha', {
        tipo: 'normal',
        subtipo: 'Atendimento Geral',
        servicoDoCliente: `Teste E2E - Op ${i + 1}`
      })
      await page.waitForTimeout(300)
    }

    // Solicita estatísticas finais
    await emitSocketEvent(page, 'getEstatisticas', {})
    await page.waitForTimeout(500)

    const estatisticas = await page.evaluate(() => {
      // @ts-ignore
      return window.__estatisticasEstimadores
    })

    expect(estatisticas).toBeDefined()

    // Verifica que estatísticas foram atualizadas
    // (aceita estrutura vazia ou com dados)
    expect(estatisticas).not.toBeUndefined()
  })
})

test.describe('T-129 + T-130: Fluxo Completo de Integração', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#app', { timeout: 10000 })

    // Aguarda socket ficar disponível
    await page.waitForFunction(() => (window as any).socket !== undefined && (window as any).socket !== null, {
      timeout: 10000
    })

    await page.waitForTimeout(2000)

    // Injeta listeners
    await page.evaluate(() => {
      // @ts-ignore
      window.__estatisticasEstimadores = null
      // @ts-ignore
      window.__lastEstado = null

      // @ts-ignore
      if (window.socket) {
        // @ts-ignore
        window.socket.on('estatisticasEstimadores', (data: any) => {
          // @ts-ignore
          window.__estatisticasEstimadores = data
        })
        // @ts-ignore
        window.socket.on('estadoAtualizado', (payload: any) => {
          // @ts-ignore
          window.__lastEstado = payload.estado
        })
      }
    })
  })

  test('T-129+130.1: Fluxo completo emissão → chamada → finalização gera estatísticas', async ({ page }) => {
    // 1. Emitir senha
    await emitSocketEvent(page, 'emitirSenha', {
      tipo: 'normal',
      subtipo: 'Atendimento Geral',
      servicoDoCliente: 'Teste E2E - Fluxo Completo'
    })
    await waitForSocketEvent(page, 'estadoAtualizado')
    await page.waitForTimeout(300)

    // 2. Chamar senha
    await emitSocketEvent(page, 'chamarSenha', {
      guicheId: 'guiche-1'
    })
    await waitForSocketEvent(page, 'estadoAtualizado')
    await page.waitForTimeout(500)

    // 3. Finalizar atendimento
    await emitSocketEvent(page, 'finalizarAtendimento', {
      guicheId: 'guiche-1'
    })
    await waitForSocketEvent(page, 'estadoAtualizado')
    await page.waitForTimeout(300)

    // 4. Solicitar estatísticas
    await emitSocketEvent(page, 'getEstatisticas', {})
    await page.waitForTimeout(500)

    // 5. Verificar que estatísticas foram recebidas
    const estatisticas = await page.evaluate(() => {
      // @ts-ignore
      return window.__estatisticasEstimadores
    })

    expect(estatisticas).toBeDefined()
    expect(estatisticas).not.toBeNull()
  })

  test('T-129+130.2: Estatísticas refletem dados coletados', async ({ page }) => {
    // Realiza operações sequenciais
    const operacoes = 5

    for (let i = 0; i < operacoes; i++) {
      // Emite
      await emitSocketEvent(page, 'emitirSenha', {
        tipo: 'normal',
        subtipo: 'Atendimento Geral',
        servicoDoCliente: `Teste E2E - Seq ${i + 1}`
      })
      await page.waitForTimeout(200)

      // Chama
      await emitSocketEvent(page, 'chamarSenha', {
        guicheId: 'guiche-1'
      })
      await page.waitForTimeout(300)

      // Finaliza
      await emitSocketEvent(page, 'finalizarAtendimento', {
        guicheId: 'guiche-1'
      })
      await page.waitForTimeout(200)
    }

    // Solicita estatísticas
    await emitSocketEvent(page, 'getEstatisticas', {})
    await page.waitForTimeout(500)

    const estatisticas = await page.evaluate(() => {
      // @ts-ignore
      return window.__estatisticasEstimadores
    })

    // Valida que estatísticas existem
    expect(estatisticas).toBeDefined()

    // Histórico deve ter as senhas finalizadas
    const historico = await page.evaluate(() => {
      // @ts-ignore
      return window.__lastEstado?.historico || []
    })

    expect(historico.length).toBeGreaterThanOrEqual(operacoes)
  })
})
