import { describe, expect, it } from 'vitest'
import { judge, parseItemize } from '../../scripts/xserver/cli'

describe('parseItemize', () => {
  it('openrsync の --itemize-changes を読む', () => {
    const out = [
      '*deleting _nuxt/img/a.jpg',
      '*deleting _nuxt/img/',
      '<f+++++++ _astro/index.abc.js',
      '<fcsT.... index.html',
      'cd+++++++ _astro/',
      '',
    ].join('\n')
    expect(parseItemize(out)).toEqual([
      { kind: 'delete', path: '_nuxt/img/a.jpg' },
      { kind: 'delete', path: '_nuxt/img/' },
      { kind: 'add', path: '_astro/index.abc.js' },
      { kind: 'update', path: 'index.html' },
    ])
  })
})

describe('judge', () => {
  it('追加・更新と、前のビルドの _astro/ の削除だけなら進める', () => {
    expect(
      judge(
        [
          { kind: 'add', path: '_astro/index.new.js' },
          { kind: 'update', path: 'index.html' },
          { kind: 'delete', path: '_astro/index.old.js' },
        ],
        100,
      ),
    ).toEqual({ proceed: true, reasons: [] })
  })

  it('ビルドが作らないファイルの削除、.htaccess の変更、index.html の削除は止める', () => {
    const v = judge(
      [
        { kind: 'delete', path: '200.html' },
        { kind: 'update', path: '.htaccess' },
        { kind: 'delete', path: 'index.html' },
      ],
      100,
    )
    expect(v.proceed).toBe(false)
    expect(v.reasons).toHaveLength(3)
  })

  it('ファイル数が 3 割より多く減るなら止める', () => {
    const changes = Array.from({ length: 40 }, (_, i) => ({
      kind: 'delete' as const,
      path: `_astro/${i}.js`,
    }))
    expect(judge(changes, 100).proceed).toBe(false)
  })
})
