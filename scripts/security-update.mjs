// pnpm audit の結果から、修正版があるパッケージの名前を 1 行ずつ出す（.claude/skills/deps-update が使う）
import { execFileSync } from 'node:child_process'

let out
try {
  out = execFileSync('pnpm', ['audit', '--json'], { encoding: 'utf8' })
} catch (error) {
  // 脆弱性があると終了コードが 0 以外になるので、標準出力だけを使う
  out = error.stdout
}

const { advisories = {} } = JSON.parse(out)
const names = new Set()
for (const advisory of Object.values(advisories)) {
  // 修正版がまだないものは "<0.0.0" と出る。上げても直らないので対象にしない
  if (advisory.patched_versions === '<0.0.0') continue
  names.add(advisory.module_name)
}
for (const name of [...names].sort()) console.log(name)
