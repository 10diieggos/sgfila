import { test, expect } from '@playwright/test'

test('app loads and socket handshake', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('#app')
  const resp = await page.waitForResponse(r => r.url().includes('/socket.io'), { timeout: 5000 })
  expect(resp.ok()).toBeTruthy()
})

test('ui loads main app container', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/SGFILA v3\.0/i)
})
