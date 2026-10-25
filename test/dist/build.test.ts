// pnpm build のあとに、dist/ の中身を確かめる
import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const read = (p: string) => readFileSync(`dist/${p}`, 'utf8')
const { document } = parseHTML(read('index.html'))
const meta = (sel: string) =>
  document.querySelector(sel)?.getAttribute('content')

describe('index.html', () => {
  it('lang と title', () => {
    expect(document.documentElement.getAttribute('lang')).toBe('en')
    expect(document.title).toBe('uto usui | branding engineer')
  })

  it('canonical と OGP は絶対 URL', () => {
    expect(
      document.querySelector('link[rel=canonical]')?.getAttribute('href'),
    ).toBe('https://uto-usui.com/')
    expect(meta('meta[property="og:url"]')).toBe('https://uto-usui.com/')
    expect(meta('meta[property="og:image"]')).toBe(
      'https://uto-usui.com/og.jpg',
    )
    expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image')
  })

  it('人物の構造化データがある', () => {
    const ld = JSON.parse(
      document.querySelector('script[type="application/ld+json"]')
        ?.textContent ?? '{}',
    )
    expect(ld['@type']).toBe('Person')
    expect(ld.url).toBe('https://uto-usui.com/')
    expect(ld.sameAs).toContain('https://github.com/uto-usui/uto-usui')
  })

  it('外部の script は GA4 だけ。polyfill.io と KARTE は読まない', () => {
    const srcs = [...document.querySelectorAll('script[src]')]
      .map((s) => s.getAttribute('src') ?? '')
      .filter((s) => /^https?:/.test(s))
    for (const src of srcs)
      expect(src).toMatch(
        /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-/,
      )
    const html = read('index.html')
    expect(html).not.toContain('polyfill.io')
    expect(html).not.toContain('karte.io')
  })

  it('本文の区画と nav の行き先がある', () => {
    for (const id of ['OVERVIEW', 'WORKS', 'ABOUT', 'OTHER', 'FOOTER']) {
      expect(document.getElementById(id)).not.toBeNull()
    }
    const hrefs = [...document.querySelectorAll('.mn__target')].map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toEqual(['#OVERVIEW', '#WORKS', '#ABOUT', '#OTHER'])
  })

  it('YouTube は押されるまで iframe を置かない', () => {
    expect(document.querySelector('iframe')).toBeNull()
    expect(document.querySelector('[data-youtube-id]')).not.toBeNull()
  })
})

describe('404.html', () => {
  it('検索に出さない', () => {
    const { document } = parseHTML(read('404.html'))
    expect(
      document.querySelector('meta[name=robots]')?.getAttribute('content'),
    ).toBe('noindex')
  })
})

describe('公開ディレクトリに置くもの', () => {
  it('sitemap に / だけが入り、404 は入らない', () => {
    const xml = read('sitemap-0.xml')
    expect(xml).toContain('<loc>https://uto-usui.com/</loc>')
    expect(xml).not.toContain('404')
  })

  it('robots.txt から sitemap を指す', () => {
    expect(read('robots.txt')).toContain(
      'Sitemap: https://uto-usui.com/sitemap-index.xml',
    )
  })

  it('旧 PWA の Service Worker を解除する sw.js を置く', () => {
    expect(read('sw.js')).toContain('registration.unregister()')
  })

  it('.htaccess に転送・404・応答ヘッダー・CORS がある', () => {
    const h = read('.htaccess')
    expect(h).toContain('ErrorDocument 404 /404.html')
    expect(h).toContain('RewriteRule ^(.*)$ https://uto-usui.com/$1 [R=301,L]')
    expect(h).toContain('X-Content-Type-Options "nosniff"')
    expect(h).toContain('Access-Control-Allow-Origin "*"')
    expect(h).toContain('max-age=31536000, immutable')
  })

  it('旧サイトのファイルを持ってこない', () => {
    for (const p of ['200.html', '.nojekyll', 'icon.png', '_nuxt']) {
      expect(existsSync(`dist/${p}`)).toBe(false)
    }
  })
})
