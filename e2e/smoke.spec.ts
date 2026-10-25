import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// 外への通信（GA4、YouTube）は止める
test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort())
})

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error' && !/net::ERR_FAILED/.test(m.text()))
      errors.push(m.text())
  })
  return errors
}

test('登場の動きが終わり、本文が見える', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('/')
  await expect(page.locator('#js-main')).toHaveCSS('opacity', '1', {
    timeout: 15_000,
  })
  await expect(page.locator('#js-loader')).toHaveCSS('opacity', '0')
  await expect(page.locator('html')).toHaveClass(/has-scroll-smooth/)
  expect(errors).toEqual([])
})

test('nav から区画へ動く', async ({ page }) => {
  await page.goto('/')
  await page.locator('.mn__target', { hasText: 'ABOUT' }).click()
  await expect
    .poll(
      () =>
        page.evaluate(
          () => document.getElementById('ABOUT')!.getBoundingClientRect().top,
        ),
      { timeout: 5_000 },
    )
    .toBeLessThan(2)
  // URL は変えない
  expect(new URL(page.url()).hash).toBe('')
})

test('視差の要素に transform が付く', async ({ page }) => {
  await page.goto('/')
  await page.mouse.wheel(0, 3000)
  await expect
    .poll(() =>
      page
        .locator('.ow__texts')
        .first()
        .evaluate((el) => el.style.transform),
    )
    .toMatch(/^matrix3d\(/)
})

test('YouTube は押すと iframe になる', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.locator('.my__button').click()
  await expect(
    page.locator(
      'iframe[src^="https://www.youtube-nocookie.com/embed/Mgl-EP-9RLg"]',
    ),
  ).toHaveCount(1)
})

test('サウンドのボタンで状態が切り替わる', async ({ page }) => {
  await page.goto('/')
  const button = page.locator('#js-sound')
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await button.click()
  const pressed = await button.getAttribute('aria-pressed')
  await button.click()
  await expect(button).not.toHaveAttribute('aria-pressed', pressed!)
})

test('狭い幅では native のスクロールで、視差を付けない', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/has-scroll-init/)
  await expect(page.locator('html')).not.toHaveClass(/has-scroll-smooth/)
  await page.mouse.wheel(0, 3000)
  await page.waitForTimeout(500)
  expect(
    await page
      .locator('.ow__texts')
      .first()
      .evaluate((el) => el.style.transform),
  ).toBe('')
})

test('動きを減らす設定では、待たずに本文を出す', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('#js-main')).toHaveCSS('opacity', '1', {
    timeout: 1_000,
  })
  await expect(page.locator('html')).not.toHaveClass(/has-scroll-smooth/)
})

test('404 ページ', async ({ page }) => {
  await page.goto('/404.html')
  await expect(page.locator('.atom-title')).toHaveText('_404')
  await expect(page.locator('a[href="/"]')).toBeVisible({ timeout: 15_000 })
})

test('axe: 重大な違反がない', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#js-main')).toHaveCSS('opacity', '1', {
    timeout: 15_000,
  })
  // 文字の色は旧サイトのデザインのまま（旧サイトも同じ 14 件）。見た目を変えないため、ここでは数えない
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()
  const serious = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  )
  expect(serious.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([])
})
