/**
 * capture.ts で撮った旧サイトと新サイトを比べる。
 *
 *   pnpm visual:compare --old .snapshot/baseline/old-1 --new .snapshot/baseline/new-1 [--out <dir>] [--only y00000]
 *
 * - 画像: 同じ名前の png を pixelmatch で比べ、差のある画素の数と割合を出す。差の画像は --out に保存する。
 *   threshold は 0.1（文字のにじみ程度の差は数えない）。
 * - computed style: styles-<幅>.json を要素のパスごとに比べ、違う値を出す。
 *   旧サイトの #__nuxt と #__layout、新サイトの <picture> と読み上げ用の span は、パスから外して突き合わせる。
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const argv = process.argv.slice(2)
const get = (name: string) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : undefined
}
const oldDir = get('old') ?? '.snapshot/baseline/old-1'
const newDir = get('new') ?? '.snapshot/baseline/new-1'
const outDir = get('out') ?? join(newDir, 'diff')
const only = get('only')?.split(',') ?? []
mkdirSync(outDir, { recursive: true })

// --- 画像 ---
const pngs = readdirSync(oldDir)
  .filter((f) => f.endsWith('.png'))
  .filter((f) => !only.length || only.some((o) => f.includes(o)))
  .sort()
const rows: { file: string; diff: number; ratio: number; note?: string }[] = []
for (const file of pngs) {
  if (!existsSync(join(newDir, file))) {
    rows.push({ file, diff: -1, ratio: 1, note: '新サイトにない' })
    continue
  }
  const a = PNG.sync.read(readFileSync(join(oldDir, file)))
  const b = PNG.sync.read(readFileSync(join(newDir, file)))
  if (a.width !== b.width || a.height !== b.height) {
    rows.push({
      file,
      diff: -1,
      ratio: 1,
      note: `大きさが違う ${a.width}x${a.height} / ${b.width}x${b.height}`,
    })
    continue
  }
  const d = new PNG({ width: a.width, height: a.height })
  const diff = pixelmatch(a.data, b.data, d.data, a.width, a.height, {
    threshold: 0.1,
  })
  if (diff) writeFileSync(join(outDir, file), PNG.sync.write(d))
  rows.push({ file, diff, ratio: diff / (a.width * a.height) })
}
for (const r of rows) {
  console.log(
    `${r.file.padEnd(28)} ${r.note ?? `${String(r.diff).padStart(8)} px  ${(r.ratio * 100).toFixed(3)}%`}`,
  )
}

// --- computed style ---
type Styles = Record<string, Record<string, string>>
const normalizeOld = (k: string) =>
  k
    .replace(/^div:1>div:1>/, '')
    .replace(
      /^(div.layout-default:1>)div.organism-fixed:1/,
      '$1header.organism-fixed:1',
    )
const normalizeNew = (k: string) =>
  k
    .replace(/>picture:1>/g, '>')
    .replace(/>span\.is-sr-only:1/g, '>span.is-sr-only')
    // 読み上げ用の span が先頭に入るので、.st__inner は 2 番目の span になる
    .replace(/>span\.st__inner:2/g, '>span.st__inner:1')

const styleFiles = readdirSync(oldDir).filter((f) =>
  /^styles-\d+\.json$/.test(f),
)
const report: Record<string, unknown> = {}
for (const file of styleFiles) {
  if (!existsSync(join(newDir, file))) continue
  const a: Styles = JSON.parse(readFileSync(join(oldDir, file), 'utf8'))
  const b: Styles = JSON.parse(readFileSync(join(newDir, file), 'utf8'))
  const A = new Map(Object.entries(a).map(([k, v]) => [normalizeOld(k), v]))
  const B = new Map(Object.entries(b).map(([k, v]) => [normalizeNew(k), v]))
  const onlyOld = [...A.keys()].filter((k) => !B.has(k))
  const onlyNew = [...B.keys()].filter((k) => !A.has(k))
  const byProp: Record<string, { count: number; samples: string[] }> = {}
  for (const [k, va] of A) {
    const vb = B.get(k)
    if (!vb) continue
    for (const p of Object.keys(va)) {
      if (va[p] === vb[p]) continue
      const na = Number.parseFloat(va[p])
      const nb = Number.parseFloat(vb[p])
      // 小数の丸めだけの差は数えない
      if (
        !Number.isNaN(na) &&
        !Number.isNaN(nb) &&
        Math.abs(na - nb) < 0.02 &&
        va[p].replace(/[\d.-]/g, '') === vb[p].replace(/[\d.-]/g, '')
      )
        continue
      const e = (byProp[p] ??= { count: 0, samples: [] })
      e.count++
      if (e.samples.length < 6)
        e.samples.push(
          `${k.split('>').slice(-3).join('>')}: ${va[p]} → ${vb[p]}`,
        )
    }
  }
  report[file] = {
    onlyOld: onlyOld.length,
    onlyNew: onlyNew.length,
    onlyOldSamples: onlyOld.slice(0, 10),
    onlyNewSamples: onlyNew.slice(0, 10),
    byProp,
  }
  console.log(`\n${file}: 旧だけ ${onlyOld.length} / 新だけ ${onlyNew.length}`)
  for (const [p, e] of Object.entries(byProp).sort(
    (x, y) => y[1].count - x[1].count,
  )) {
    console.log(`  ${p} ${e.count}`)
    for (const s of e.samples.slice(0, 3)) console.log(`    ${s}`)
  }
}
writeFileSync(
  join(outDir, 'report.json'),
  JSON.stringify({ images: rows, styles: report }, null, 2),
)
