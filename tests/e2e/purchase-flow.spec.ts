import { expect, test } from '@playwright/test'

test('confirma uma compra somente depois que o pedido é aceito pela API', async ({ page }) => {
  const hasNoHorizontalOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)

  await page.goto('/confirmation')
  await expect(page).toHaveURL(/\/cart$/)

  await page.goto('/')
  const nft = page.locator('a.nft-card').first()
  await expect(nft).toBeAttached()
  expect(await hasNoHorizontalOverflow()).toBe(true)
  await nft.click()
  const addToCart = page.locator('.buy-btn')
  await expect(addToCart).toBeAttached()

  await addToCart.click()
  await expect(page.getByLabel('Carrinho').locator('i')).toHaveText('1')
  expect(await hasNoHorizontalOverflow()).toBe(true)
  await page.getByLabel('Carrinho').click()
  await expect(page.locator('.cart-item')).toHaveCount(1)
  expect(await hasNoHorizontalOverflow()).toBe(true)

  await page.getByRole('button', { name: 'Conectar e finalizar' }).click()
  await expect(page.getByRole('heading', { name: 'Carteira e rede' })).toBeAttached()
  expect(await hasNoHorizontalOverflow()).toBe(true)

  const orderResponse = page.waitForResponse((response) => response.url().includes('/api/orders') && response.request().method() === 'POST')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).not.toHaveURL(/\/confirmation$/)
  expect((await orderResponse).status()).toBe(201)
  await expect(page).toHaveURL(/\/confirmation$/)
  await expect(page.getByText('Seus NFTs agora estão na sua carteira')).toBeAttached()
  await expect(page.locator('.confirmation-item')).toHaveCount(1)
  expect(await hasNoHorizontalOverflow()).toBe(true)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('kurio-cart'))).toContain('"items":[]')
})
