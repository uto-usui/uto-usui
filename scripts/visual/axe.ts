/**
 * 登場の動きが終わったあとのページを axe で調べ、違反を JSON に書く。旧サイトと新サイトで比べるためのもの。
 *
 *   node scripts/visual/axe.ts --base http://127.0.0.1:4400 --out .snapshot/baseline/axe-old.json
 */
import { writeFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

const argv = process.argv.slice(2)
const get = (name: string) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : undefined
}
const base = get('base') ?? 'http://127.0.0.1:4321'
const out = get('out') ?? 'axe.json'

const browser = await chromium.launch()
const result: Record<string, unknown> = {}
for (const width of [375, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    serviceWorkers: 'block',
  })
  const host = new URL(base).host
  await context.route('**/*', (route) =>
    new URL(route.request().url()).host === host
      ? route.continue()
      : route.abort(),
  )
  const page = await context.newPage()
  await page.goto(base + '/', { waitUntil: 'load' })
  await page.waitForTimeout(12_000)
  const r = await new AxeBuilder({ page }).analyze()
  result[width] = r.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.length,
    targets: v.nodes.slice(0, 8).map((n) => n.target.join(' ')),
  }))
  await context.close()
}
await browser.close()
writeFileSync(out, JSON.stringify(result, null, 2))
for (const [w, list] of Object.entries(result)) {
  console.log(w)
  for (const v of list as { id: string; impact: string; nodes: number }[])
    console.log(`  ${v.impact} ${v.id} (${v.nodes})`)
}
