import { expect, test } from '@playwright/test'

test('confirma uma compra somente depois que o pedido é aceito pela API', async ({ page }) => {
  test.skip(test.info().project.use.isMobile, 'O fluxo de compra atual tem referência visual apenas para desktop.')

  await page.goto('/confirmation')
  await expect(page).toHaveURL(/\/cart$/)

  await page.goto('/')
  const nft = page.locator('a.nft-card').first()
  await expect(nft).toBeAttached()
  await nft.click()
  const addToCart = page.locator('.buy-btn')
  await expect(addToCart).toBeAttached()

  await addToCart.click()
  await expect(page.getByLabel('Carrinho').locator('i')).toHaveText('1')
  await page.getByLabel('Carrinho').click()
  await expect(page.getByRole('heading', { name: 'Resumo da carteira' })).toBeAttached()

  await page.getByRole('button', { name: 'Conectar e finalizar' }).click()
  await expect(page.getByRole('heading', { name: 'Seus NFTs' })).toBeAttached()

  const orderResponse = page.waitForResponse((response) => response.url().includes('/api/orders') && response.request().method() === 'POST')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).not.toHaveURL(/\/confirmation$/)
  expect((await orderResponse).status()).toBe(201)
  await expect(page).toHaveURL(/\/confirmation$/)
  await expect(page.getByText('Seus NFTs agora estão na sua carteira')).toBeAttached()
  await expect(page.locator('.confirmation-item')).toHaveCount(1)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('kurio-cart'))).toContain('"items":[]')
})
