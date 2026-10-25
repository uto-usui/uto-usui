/**
 * 見た目の基準を撮る。旧サイト（Nuxt 2）と新サイト（Astro）を同じ条件で撮って、compare.ts で比べる。
 *
 * 実行（Node 26 は .ts をそのまま実行できる）:
 *   pnpm visual:capture --base http://127.0.0.1:4400 --out .snapshot/baseline/old --styles
 *
 * オプション:
 *   --base <url>      撮る対象（旧サイトは .snapshot/server/public_html を静的に配信したもの）
 *   --out <dir>       保存先
 *   --widths 375,768  幅（既定は WIDTHS）
 *   --only <文字列>   ファイル名にこの文字列を含むものだけ撮る（カンマ区切り）
 *   --styles          登場後の先頭の状態で、要素ごとの computed style を書き出す
 *
 * 条件をそろえるために決めていること:
 *   - 時計は Playwright の clock で止め、runFor で進める。GSAP、setTimeout、rAF はこの時計で動く。
 *   - Math.random は種付きにする。図形の動きと文字の入れ替わりが毎回同じになる。
 *   - base の host と Google Fonts 以外への通信は止める（GA4、KARTE、polyfill.io、YouTube）。
 *   - Service Worker は使わせない。
 *   - 図形（.of__shapes）は登場後の画像では隠す。乱数の呼び出し順で位置が変わり、新旧で同じにならないため。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium, type Page, type Route } from 'playwright'

// 375 / 768 / 1200 / 1440 / 1920 は CSS の境（_breakpoint.scss）。1023 / 1024 は locomotive-scroll v4 が
// 慣性スクロールと視差を始める境（innerWidth < 1024 は native のスクロールで視差なし）
const WIDTHS = [375, 768, 1023, 1024, 1199, 1200, 1440, 1920]
const HEIGHTS: Record<number, number> = {
  375: 812,
  768: 1024,
  1023: 768,
  1024: 768,
  1199: 800,
  1200: 800,
  1440: 900,
  1920: 1080,
}

// 読み込みから登場の動きが終わるまで。本文の文字が 1 字ずつ入ってくる動きが 30 秒ほど続く
const INTRO_END_MS = 45_000

type Args = {
  base: string
  out: string
  widths: number[]
  only: string[]
  styles: boolean
}

function parseArgs(argv: string[]): Args {
  const get = (name: string) => {
    const i = argv.indexOf(`--${name}`)
    return i >= 0 ? argv[i + 1] : undefined
  }
  return {
    base: (get('base') ?? 'http://127.0.0.1:4400').replace(/\/$/, ''),
    out: get('out') ?? '.snapshot/baseline/old',
    widths: get('widths')?.split(',').map(Number) ?? WIDTHS,
    only: get('only')?.split(',') ?? [],
    styles: argv.includes('--styles'),
  }
}

const SEED_SCRIPT = `(() => {
  let a = 42
  Math.random = () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
})()`

const STYLE_PROPS = [
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'zIndex',
  'width',
  'height',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderTopWidth',
  'borderTopStyle',
  'borderTopColor',
  'borderBottomWidth',
  'borderBottomStyle',
  'borderBottomColor',
  'borderLeftWidth',
  'borderLeftColor',
  'borderRightWidth',
  'borderRightColor',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'textShadow',
  'color',
  'backgroundColor',
  'backgroundImage',
  'opacity',
  'visibility',
  'transform',
  'mixBlendMode',
  'whiteSpace',
  'fontFeatureSettings',
  'overflowX',
  'overflowY',
  'objectFit',
  'perspective',
  'mixBlendMode',
]

// 要素ごとに「タグ.class:何番目」をつないだパスをキーにして computed style を集める
async function dumpStyles(page: Page) {
  return page.evaluate((props: string[]) => {
    const key = (el: Element): string => {
      const parts: string[] = []
      for (
        let e: Element | null = el;
        e && e !== document.body;
        e = e.parentElement
      ) {
        const cls = [...e.classList]
          .filter((c) => !c.startsWith('astro-') && !/^is-/.test(c))
          .sort()
          .join('.')
        const same = e.parentElement
          ? [...e.parentElement.children].filter(
              (c) => c.tagName === e!.tagName,
            )
          : [e]
        parts.unshift(
          `${e.tagName.toLowerCase()}${cls ? '.' + cls : ''}:${same.indexOf(e) + 1}`,
        )
      }
      return parts.join('>')
    }
    const pick = (cs: CSSStyleDeclaration) =>
      Object.fromEntries(
        props.map((p) => [p, (cs as unknown as Record<string, string>)[p]]),
      )
    const out: Record<string, unknown> = {}
    for (const el of document.body.querySelectorAll('*')) {
      if (
        [
          'SCRIPT',
          'STYLE',
          'NOSCRIPT',
          'svg',
          'path',
          'symbol',
          'use',
          'polygon',
          'rect',
          'circle',
          'polyline',
          'g',
        ].includes(el.tagName)
      )
        continue
      const k = key(el)
      out[k] = pick(getComputedStyle(el))
      for (const pseudo of ['::before', '::after']) {
        const cs = getComputedStyle(el, pseudo)
        if (cs.content && cs.content !== 'none' && cs.content !== 'normal')
          out[k + pseudo] = { content: cs.content, ...pick(cs) }
      }
    }
    return out
  }, STYLE_PROPS)
}

// 旧サイト（Nuxt 2 + locomotive-scroll v4）の window から使うもの
type LegacyWindow = Window & {
  $nuxt?: {
    $store?: {
      getters: Record<
        string,
        | {
            value?: {
              scroll: {
                setScroll(x: number, y: number): void
                checkScroll(forced: boolean): void
                instance: { limit: { y: number } }
              }
            }
          }
        | undefined
      >
    }
  }
}

// 旧サイトの慣性スクロール（locomotive-scroll v4）は setScroll + checkScroll で、新サイトと native のスクロールは
// window.scrollTo で動かす。どちらも視差の位置は測り直さない（手でスクロールしたときと同じ）
async function scrollToY(page: Page, y: number) {
  await page.evaluate((y: number) => {
    const w = window as LegacyWindow
    const ls = w.$nuxt?.$store?.getters['ls/getLs']?.value
    if (
      ls &&
      document.documentElement.classList.contains('has-scroll-smooth')
    ) {
      ls.scroll.setScroll(0, y)
      ls.scroll.checkScroll(true)
    } else {
      window.scrollTo(0, y)
    }
  }, y)
  await page.clock.runFor(1000)
}

async function scrollLimit(page: Page): Promise<number> {
  return page.evaluate(() => {
    const w = window as LegacyWindow
    const ls = w.$nuxt?.$store?.getters['ls/getLs']?.value
    if (ls && document.documentElement.classList.contains('has-scroll-smooth'))
      return ls.scroll.instance.limit.y
    return document.documentElement.scrollHeight - window.innerHeight
  })
}

// 画面に入っている画像の読み込みを、実時間で待つ（時計は止まっているので Node 側で待つ）
async function waitVisibleImages(page: Page) {
  for (let i = 0; i < 150; i++) {
    const pending = await page.evaluate(
      () =>
        [...document.images].filter((img) => {
          const r = img.getBoundingClientRect()
          const inView =
            r.bottom > 0 &&
            r.top < innerHeight &&
            r.right > 0 &&
            r.left < innerWidth
          return inView && !(img.complete && img.naturalWidth > 0)
        }).length,
    )
    if (!pending) return
    await new Promise((r) => setTimeout(r, 100))
  }
  console.log('  画像の読み込みを待ちきれませんでした')
}

async function hideShapes(page: Page, hide: boolean) {
  await page.evaluate((hide: boolean) => {
    const el = document.querySelector<HTMLElement>('.of__shapes')
    if (el) el.style.visibility = hide ? 'hidden' : ''
  }, hide)
}

async function shot(page: Page, path: string) {
  await page.screenshot({ path, animations: 'disabled', caret: 'hide' })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  mkdirSync(args.out, { recursive: true })
  const allowHosts = new Set([
    new URL(args.base).host,
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ])
  const browser = await chromium.launch()
  const want = (file: string) =>
    !args.only.length || args.only.some((o) => file.includes(o))
  const manifest: Record<string, unknown>[] = []

  for (const width of args.widths) {
    const height = HEIGHTS[width] ?? 900
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      serviceWorkers: 'block',
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
    })
    await context.addInitScript(SEED_SCRIPT)
    await context.route('**/*', (route: Route) => {
      const host = new URL(route.request().url()).host
      return allowHosts.has(host) ? route.continue() : route.abort()
    })
    const page = await context.newPage()
    const t0 = new Date('2026-10-25T00:00:00+09:00').getTime()
    await page.clock.install({ time: t0 })
    await page.clock.pauseAt(t0 + 1000)
    await page.goto(args.base + '/', { waitUntil: 'load' })
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready.then(() => undefined))

    // 読み込み中: 名前が横から入ってくる途中で、ローダーが回っている
    await page.clock.runFor(1200)
    const file = (name: string) => `${name}-${width}.png`
    if (want(file('loader'))) await shot(page, join(args.out, file('loader')))

    await page.clock.runFor(INTRO_END_MS - 1200)
    await waitVisibleImages(page)
    if (want(file('intro-end')))
      await shot(page, join(args.out, file('intro-end')))

    await hideShapes(page, true)
    if (want(file('y00000'))) await shot(page, join(args.out, file('y00000')))
    if (args.styles)
      writeFileSync(
        join(args.out, `styles-${width}.json`),
        JSON.stringify(await dumpStyles(page)),
      )

    // 上から 1 画面ずつ下げて、最後に一番下
    const limit = await scrollLimit(page)
    const stops: number[] = []
    for (let y = height; y < limit; y += height) stops.push(y)
    stops.push(Math.round(limit))
    for (const y of stops) {
      const name = file(`y${String(y).padStart(5, '0')}`)
      if (!want(name)) continue
      await scrollToY(page, y)
      await waitVisibleImages(page)
      await page.clock.runFor(200)
      await shot(page, join(args.out, name))
    }

    // マウスを乗せた状態と、サウンドのボタンを押した状態は先頭で撮る
    await scrollToY(page, 0)
    await waitVisibleImages(page)
    if (want(file('hover-nav'))) {
      await page.hover('.mn__item:nth-child(2) .mn__target')
      await page.clock.runFor(200)
      await shot(page, join(args.out, file('hover-nav')))
      await page.mouse.move(1, height - 1)
      await page.clock.runFor(1000)
    }
    if (want(file('hover-link'))) {
      await page.hover('.oo__main a[data-color]')
      await page.clock.runFor(1000)
      await shot(page, join(args.out, file('hover-link')))
      await page.mouse.move(1, height - 1)
      await page.clock.runFor(1000)
    }
    if (want(file('sound'))) {
      await page.click('#js-sound')
      await page.clock.runFor(1000)
      await shot(page, join(args.out, file('sound')))
    }

    manifest.push({ width, height, limit, stops })
    console.log('ok', width, 'limit', limit, 'stops', stops.length)
    await context.close()
  }

  writeFileSync(
    join(args.out, 'manifest.json'),
    JSON.stringify(
      {
        base: args.base,
        takenAt: new Date().toISOString(),
        browser: `chromium ${browser.version()}`,
        playwright: JSON.parse(
          readFileSync(
            new URL(import.meta.resolve('playwright/package.json')),
            'utf8',
          ),
        ).version,
        pages: manifest,
      },
      null,
      2,
    ),
  )
  await browser.close()
}

await main()
