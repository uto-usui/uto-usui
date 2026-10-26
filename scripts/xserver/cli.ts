/**
 * エックスサーバーとの同期。使い方は docs/xserver.md、Claude Code からの流れは .claude/skills/xserver-sync/SKILL.md。
 *
 *   pnpm xserver:pull                 サーバー → .snapshot/server/public_html（サーバーは変えない）
 *   pnpm xserver:diff [--json]        dist/ とサーバーの差（dry-run）と、公開してよいかの判定
 *   pnpm xserver:deploy [--yes] [--no-build]
 *                                     ビルド → 差 → 確認 → サーバー側に控え → rsync --delete → 公開後の確認
 *   pnpm xserver:rollback [<控えの名前>] [--yes]
 *                                     控えの一覧。名前を渡すと、その控えに戻す
 *   pnpm xserver:check                公開後の確認（主な URL の応答とエラーログ）
 *
 * SSH の鍵は XSERVER_SSH_KEY（既定は ~/.ssh/<鍵のファイル>）。API キーは使わない。
 * エラーログだけ、グローバルのスキル xserver の xs-api.sh を通す。
 */
import { spawnSync, type SpawnSyncOptions } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { createInterface } from 'node:readline/promises'

type Config = {
  servername: string
  domain: string
  deploy_path: string
  deploy_source: string
}

// サーバーにだけ置いてあり、同期で消してはいけないもの。ここに書いたものは --delete でも消えない。
// サーバーにだけ置くものが増えたら、ここに足す
export const EXCLUDES = [
  '.git',
  'node_modules',
  '.env',
  '.DS_Store',
  '.xserver.json',
  // 2020 年の動画。.htaccess で CORS を許していて、ほかのサイトから読まれている可能性がある
  '/8180/',
  // サブドメイン test.uto-usui.com の公開ディレクトリ（設定だけあって、今はディレクトリがない）
  '/test/',
  // サーバーの初期ページの画像
  '/default_page.png',
]

const BACKUP_KEEP = 3
const SSH_PORT = '<SSH のポート>'

function loadConfig(): Config {
  if (!existsSync('.xserver.json')) {
    fail('.xserver.json がありません（docs/xserver.md の「最初の準備」）')
  }
  return JSON.parse(readFileSync('.xserver.json', 'utf8'))
}

function fail(message: string): never {
  console.error(`✖ ${message}`)
  process.exit(1)
}

function run(
  cmd: string,
  args: string[],
  opts: Omit<SpawnSyncOptions, 'encoding'> = {},
) {
  const r = spawnSync(cmd, args, { ...opts, encoding: 'utf8' })
  if (r.error) fail(`${cmd} を実行できません: ${r.error.message}`)
  return r
}

const sshKey = () =>
  process.env.XSERVER_SSH_KEY ??
  join(homedir(), '.ssh', '<鍵のファイル>')

function remote(c: Config) {
  const user = c.servername.split('.')[0]
  const sshArgs = [
    '-i',
    sshKey(),
    '-p',
    SSH_PORT,
    '-o',
    'StrictHostKeyChecking=accept-new',
  ]
  return {
    target: `${user}@${c.servername}`,
    rsh: `ssh ${sshArgs.join(' ')}`,
    ssh: (command: string, opts: Omit<SpawnSyncOptions, 'encoding'> = {}) =>
      run('ssh', [...sshArgs, `${user}@${c.servername}`, command], opts),
  }
}

const excludeArgs = () => EXCLUDES.flatMap((e) => ['--exclude', e])

// --- diff ---

export type Change = { kind: 'add' | 'update' | 'delete'; path: string }

export function parseItemize(out: string): Change[] {
  const changes: Change[] = []
  for (const line of out.split('\n')) {
    const m = line.match(/^(\*deleting|[<>ch.][fdLDS][^ ]*)\s+(.+)$/)
    if (!m) continue
    const [, code, path] = m
    if (code === '*deleting') changes.push({ kind: 'delete', path })
    else if (code[1] === 'f')
      changes.push({ kind: code.includes('+++') ? 'add' : 'update', path })
  }
  return changes
}

export type Verdict = { proceed: boolean; reasons: string[] }

// .claude/skills/xserver-sync/SKILL.md の判断の表と同じ。確認なしで進めてよいのは、
// ビルドが作るファイルの追加・更新と、前のビルドのハッシュ付きファイル（_astro/*）の削除だけ
export function judge(changes: Change[], remoteFileCount: number): Verdict {
  const reasons: string[] = []
  const deletes = changes.filter(
    (c) => c.kind === 'delete' && !c.path.endsWith('/'),
  )
  const otherDeletes = deletes.filter((c) => !c.path.startsWith('_astro/'))
  if (otherDeletes.length) {
    reasons.push(
      `ビルドのハッシュ付きファイル以外の削除が ${otherDeletes.length} 件（例: ${otherDeletes
        .slice(0, 5)
        .map((c) => c.path)
        .join(', ')}）`,
    )
  }
  if (changes.some((c) => c.path === '.htaccess'))
    reasons.push('.htaccess が変わる')
  if (changes.some((c) => c.kind === 'delete' && c.path === 'index.html'))
    reasons.push('index.html が消える')
  const adds = changes.filter((c) => c.kind === 'add').length
  const after = remoteFileCount + adds - deletes.length
  if (remoteFileCount > 0 && after < remoteFileCount * 0.7) {
    reasons.push(`ファイル数が大きく減る（${remoteFileCount} → ${after}）`)
  }
  return { proceed: reasons.length === 0, reasons }
}

function diff(c: Config) {
  if (!existsSync(join(c.deploy_source, 'index.html'))) {
    fail(
      `${c.deploy_source}/index.html がありません。先に pnpm build してください`,
    )
  }
  const r = remote(c)
  const res = run('rsync', [
    '-rlcz',
    '-n',
    '--itemize-changes',
    '--delete',
    '-e',
    r.rsh,
    ...excludeArgs(),
    `${c.deploy_source}/`,
    `${r.target}:${c.deploy_path}/`,
  ])
  if (res.status !== 0) fail(`rsync の dry-run に失敗しました\n${res.stderr}`)
  const changes = parseItemize(res.stdout)
  // 判定の「ファイル数が大きく減る」のために、除外したものを除いたサーバーのファイル数を数える
  const count = r.ssh(
    `cd ${c.deploy_path} && find . -type f ${EXCLUDES.filter((e) =>
      e.startsWith('/'),
    )
      .map(
        (e) =>
          `-not -path './${e.replace(/^\/|\/$/g, '')}${e.endsWith('/') ? '/*' : ''}'`,
      )
      .join(' ')} | wc -l`,
  )
  const remoteFileCount = Number(count.stdout.trim()) || 0
  return { changes, remoteFileCount, verdict: judge(changes, remoteFileCount) }
}

function printDiff({
  changes,
  remoteFileCount,
  verdict,
}: ReturnType<typeof diff>) {
  const by = (k: Change['kind']) => changes.filter((x) => x.kind === k)
  const show = (label: string, list: Change[]) => {
    console.log(`\n${label} ${list.length} 件`)
    const astro = list.filter((x) => x.path.startsWith('_astro/'))
    for (const x of list.filter((x) => !x.path.startsWith('_astro/')))
      console.log(`  ${x.path}`)
    if (astro.length)
      console.log(`  _astro/ のハッシュ付きファイル ${astro.length} 件`)
  }
  console.log(`サーバーのファイル数（除外したものを除く）: ${remoteFileCount}`)
  show('追加', by('add'))
  show('更新', by('update'))
  show('削除', by('delete'))
  console.log(
    verdict.proceed
      ? '\n判定: 確認なしで進めてよい差分です'
      : `\n判定: 確認が要る差分です\n${verdict.reasons.map((r) => `  - ${r}`).join('\n')}`,
  )
}

// --- deploy / rollback ---

const stamp = () =>
  new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .replace('T', '-')

function backupDir(c: Config) {
  return `~/backup/${c.domain}`
}

function backup(c: Config) {
  const r = remote(c)
  const dir = `${backupDir(c)}/${stamp()}`
  // 同期の対象と同じ範囲（除外したものを除く）を控える。古い控えは新しい順に BACKUP_KEEP 個を残して消す
  const excludes = EXCLUDES.map((e) => `--exclude '${e}'`).join(' ')
  const res = r.ssh(
    `set -e; mkdir -p ${dir}; rsync -a ${excludes} ${c.deploy_path}/ ${dir}/; ` +
      `ls -1d ${backupDir(c)}/*/ | sort -r | tail -n +${BACKUP_KEEP + 1} | xargs -r rm -rf; echo ${dir}`,
  )
  if (res.status !== 0) fail(`サーバー側の控えに失敗しました\n${res.stderr}`)
  return res.stdout.trim()
}

async function confirm(question: string) {
  if (!process.stdin.isTTY)
    fail(
      '確認に答えられない環境です。差分を読んで判断したうえで --yes を付けてください',
    )
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(`${question} [y/N] `)
  rl.close()
  return /^y(es)?$/i.test(answer.trim())
}

async function deploy(c: Config, args: string[]) {
  const yes = args.includes('--yes')
  if (!args.includes('--no-build')) {
    if (!process.env.PUBLIC_GA4_ID && !readEnvFile().PUBLIC_GA4_ID) {
      fail(
        'PUBLIC_GA4_ID がありません。.env に入れてからビルドしてください（.env.example）',
      )
    }
    const b = run('pnpm', ['build'], { stdio: 'inherit' })
    if (b.status !== 0) fail('ビルドに失敗しました')
  }
  const d = diff(c)
  printDiff(d)
  if (!d.changes.length) {
    console.log('\n差分がないので、反映しません')
    return
  }
  if (!yes && !(await confirm('\nこの差分をサーバーに反映しますか')))
    fail('取りやめました')

  const saved = backup(c)
  console.log(`\nサーバー側に控えを取りました: ${saved}`)

  const r = remote(c)
  const res = run(
    'rsync',
    [
      '-rlcz',
      '--delete',
      '-e',
      r.rsh,
      ...excludeArgs(),
      `${c.deploy_source}/`,
      `${r.target}:${c.deploy_path}/`,
    ],
    { stdio: 'inherit' },
  )
  if (res.status !== 0)
    fail(
      `rsync に失敗しました。pnpm xserver:rollback ${saved.split('/').pop()} で戻せます`,
    )
  console.log('\n反映しました')
  check(c)
}

function listBackups(c: Config) {
  const res = remote(c).ssh(`ls -1 ${backupDir(c)} 2>/dev/null | sort -r`)
  return res.stdout.split('\n').filter(Boolean)
}

async function rollback(c: Config, args: string[]) {
  const name = args.find((a) => !a.startsWith('--'))
  const backups = listBackups(c)
  if (!name) {
    console.log(
      backups.length
        ? `控え（新しい順）:\n${backups.map((b) => `  ${b}`).join('\n')}`
        : '控えはまだありません',
    )
    return
  }
  if (!backups.includes(name)) fail(`控え ${name} はありません`)
  if (!args.includes('--yes') && !(await confirm(`${name} の状態に戻しますか`)))
    fail('取りやめました')
  const excludes = EXCLUDES.map((e) => `--exclude '${e}'`).join(' ')
  const res = remote(c).ssh(
    `rsync -a --delete ${excludes} ${backupDir(c)}/${name}/ ${c.deploy_path}/`,
  )
  if (res.status !== 0) fail(`戻せませんでした\n${res.stderr}`)
  console.log(`${name} に戻しました`)
  check(c)
}

// --- pull ---

function pull(c: Config) {
  const r = remote(c)
  const dest = '.snapshot/server/public_html/'
  mkdirSync(dest, { recursive: true })
  // 手元の写しを、サーバーと同じにする（消えるのは手元の写しの中だけ）
  const res = run(
    'rsync',
    ['-az', '--delete', '-e', r.rsh, `${r.target}:${c.deploy_path}/`, dest],
    { stdio: 'inherit' },
  )
  if (res.status !== 0) fail('取得に失敗しました')
  console.log(`${dest} に取りました`)
}

// --- check ---

type Probe = {
  url: string
  status: number
  location?: RegExp
  header?: [string, RegExp]
  body?: RegExp
}

function check(c: Config) {
  const site = `https://${c.domain}`
  const probes: Probe[] = [
    { url: `${site}/`, status: 200, body: /<title>uto usui/ },
    { url: `${site}/sitemap-index.xml`, status: 200 },
    { url: `${site}/robots.txt`, status: 200, body: /Sitemap:/ },
    { url: `${site}/og.jpg`, status: 200 },
    { url: `${site}/sw.js`, status: 200, body: /unregister/ },
    { url: `${site}/no-such-page/`, status: 404, body: /uto usui/ },
    {
      url: `http://${c.domain}/`,
      status: 301,
      location: new RegExp(`^${site}/$`),
    },
    {
      url: `https://www.${c.domain}/`,
      status: 301,
      location: new RegExp(`^${site}/$`),
    },
    {
      url: `${site}/index.html`,
      status: 301,
      location: new RegExp(`^${site}/$`),
    },
    {
      url: `${site}/`,
      status: 200,
      header: ['x-content-type-options', /nosniff/],
    },
    {
      url: `${site}/8180/202005.mp4`,
      status: 200,
      header: ['access-control-allow-origin', /\*/],
    },
  ]
  let ok = true
  for (const p of probes) {
    // 本文を見ないもの（動画など）は捨てる。全部を読むと spawnSync のバッファがあふれる
    const res = run('curl', [
      '-s',
      '-o',
      p.body ? '-' : '/dev/null',
      '-D',
      '/dev/stderr',
      '--max-time',
      '20',
      p.url,
    ])
    const headers = res.stderr
    const status = Number(headers.match(/^HTTP\/[\d.]+ (\d+)/m)?.[1] ?? 0)
    const location = headers.match(/^location: (.+)$/im)?.[1]?.trim()
    const problems: string[] = []
    if (status !== p.status)
      problems.push(`status ${status}（期待 ${p.status}）`)
    if (p.location && !p.location.test(location ?? ''))
      problems.push(`location ${location}`)
    if (p.header) {
      const v = headers.match(new RegExp(`^${p.header[0]}: (.+)$`, 'im'))?.[1]
      if (!v || !p.header[1].test(v))
        problems.push(`${p.header[0]}: ${v ?? 'なし'}`)
    }
    if (p.body && !p.body.test(res.stdout))
      problems.push('本文に期待した文字がない')
    console.log(
      `${problems.length ? '✖' : '✓'} ${p.url}${p.header ? ` (${p.header[0]})` : ''}${problems.length ? `  ${problems.join(' / ')}` : ''}`,
    )
    if (problems.length) ok = false
  }

  const api = join(homedir(), '<エラーログを取るコマンド>')
  if (existsSync(api)) {
    const log = run(api, [
      'GET',
      `/v1/server/${c.servername}/error-log?domain=${c.domain}&lines=20`,
    ])
    console.log(
      log.status === 0
        ? `\nエラーログ（直近 20 行）:\n${log.stdout}`
        : `\nエラーログを取れませんでした: ${log.stderr.trim()}`,
    )
  }
  if (!ok) {
    console.error('\n公開後の確認で問題がありました')
    process.exitCode = 1
  }
}

function readEnvFile(): Record<string, string> {
  if (!existsSync('.env')) return {}
  return Object.fromEntries(
    readFileSync('.env', 'utf8')
      .split('\n')
      .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
      .filter((m): m is RegExpMatchArray => !!m)
      .map((m) => [m[1], m[2]]),
  )
}

async function main() {
  const [command, ...args] = process.argv.slice(2)
  const c = loadConfig()
  switch (command) {
    case 'pull':
      return pull(c)
    case 'diff': {
      const d = diff(c)
      if (args.includes('--json')) console.log(JSON.stringify(d, null, 2))
      else printDiff(d)
      return
    }
    case 'deploy':
      return deploy(c, args)
    case 'rollback':
      return rollback(c, args)
    case 'check':
      return check(c)
    default:
      fail('pull / diff / deploy / rollback / check のどれかを指定してください')
  }
}

if (import.meta.main) await main()
