import { test, expect } from '@playwright/test'

test('serviço selecionado deve ser resetado após emissão de senha', async ({ page }) => {
  // Navegar para a aplicação
  await page.goto('/')
  await page.waitForSelector('#app')
  
  // Aguardar carregamento completo da aplicação
  await page.waitForTimeout(1000)
  
  // Preencher o campo de serviço
  const servicoInput = page.locator('.input-servico')
  await servicoInput.fill('Atendimento ao Cliente')
  
  // Verificar que o serviço foi preenchido
  await expect(servicoInput).toHaveValue('Atendimento ao Cliente')
  
  // Clicar no botão para emitir senha normal
  const btnNormal = page.locator('.btn-normal.btn-emit')
  await btnNormal.click()
  
  // Fechar o modal da senha emitida para poder prosseguir
  await page.waitForSelector('.modal-overlay')
  await page.keyboard.press('Escape')
  await page.waitForSelector('.modal-overlay', { state: 'hidden' })
  
  // Verificar que o serviço foi resetado após a emissão
  await expect(servicoInput).toHaveValue('')
  
  // Testar com serviço prioritário
  await servicoInput.fill('Consulta Médica')
  await expect(servicoInput).toHaveValue('Consulta Médica')
  
  const btnPrioridade = page.locator('.btn-priority.btn-emit')
  await btnPrioridade.click()

  // Fechar o modal da senha emitida
  await page.waitForSelector('.modal-overlay')
  await page.keyboard.press('Escape')
  await page.waitForSelector('.modal-overlay', { state: 'hidden' })
  
  await expect(servicoInput).toHaveValue('')
  
  // Testar com serviço contratual
  await servicoInput.fill('Renovação de Contrato')
  await expect(servicoInput).toHaveValue('Renovação de Contrato')
  
  const btnContratual = page.locator('.btn-contract.btn-emit')
  await btnContratual.click()

  // Fechar o modal da senha emitida
  await page.waitForSelector('.modal-overlay')
  await page.keyboard.press('Escape')
  await page.waitForSelector('.modal-overlay', { state: 'hidden' })
  
  await expect(servicoInput).toHaveValue('')
})

test('serviços sugeridos devem funcionar corretamente', async ({ page }) => {
  // Navegar para a aplicação
  await page.goto('/')
  await page.waitForSelector('#app')
  
  // Aguardar carregamento completo da aplicação
  await page.waitForTimeout(1000)
  
  // Verificar se existem serviços sugeridos
  const servicosSugeridos = page.locator('.servico-check')
  const count = await servicosSugeridos.count()
  
  if (count > 0) {
    // Clicar no primeiro serviço sugerido
    await servicosSugeridos.first().click()
    
    // Verificar que o serviço foi selecionado
    const servicoInput = page.locator('.input-servico')
    const servicoValue = await servicoInput.inputValue()
    expect(servicoValue).toBeTruthy()
    
    // Emitir senha
    const btnNormal = page.locator('.btn-normal.btn-emit')
    await btnNormal.click()

    // Fechar o modal da senha emitida
    await page.waitForSelector('.modal-overlay')
    await page.keyboard.press('Escape')
    await page.waitForSelector('.modal-overlay', { state: 'hidden' })
    
    // Verificar que o serviço foi resetado
    await expect(servicoInput).toHaveValue('')
  }
})