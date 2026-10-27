# エックスサーバーの操作ガイド

uto-usui.com はエックスサーバーに置いています。公開は CI ではなく手元の Mac から行います。ふだんは、master にマージすると手元の launchd が 5 分以内に出します（下の「自動デプロイ」）。手で出すときは CLI を使うか、Claude Code に「デプロイして」と頼めば、スキル `xserver-sync`（`.claude/skills/xserver-sync/SKILL.md`）が同じ手順で進めます。

## 最初の準備

1 回だけやります。サーバー名・鍵・ポートなどの手元の値はリポジトリに書かず、`.xserver.json` にだけ置きます。

1. エックスサーバーで SSH を有効にして、公開鍵を登録する。
2. リポジトリの直下に `.xserver.json` を作る（`.gitignore` に入っているので、コミットされません）。`<…>` は手元の値に置き換えます。

   ```json
   {
     "servername": "<サーバー ID>.xsrv.jp",
     "domain": "uto-usui.com",
     "deploy_path": "/home/<サーバー ID>/uto-usui.com/public_html",
     "deploy_source": "./dist",
     "ssh_key": "~/.ssh/<鍵のファイル>",
     "ssh_port": "<SSH のポート>",
     "error_log_command": ["<エラーログを出すコマンド>", "<引数>"]
   }
   ```

   `error_log_command` は任意です。直近のエラーログを標準出力に出すコマンドを書くと、公開後の確認のあとに出します。鍵は環境変数 `XSERVER_SSH_KEY` でも渡せます。

3. つながるかを `pnpm xserver:diff` で確かめる（サーバーは変わりません）。

4. `.env.example` を `.env` に写す。GA4 の ID（`PUBLIC_GA4_ID`）が入ります。`.env` がないと `xserver:deploy` は止まります。

## 毎回の公開

```bash
git switch master && git pull --ff-only
pnpm xserver:deploy
```

`xserver:deploy` は次の順に進みます。

1. `pnpm build`
2. `dist/` とサーバーの差を出す（追加・更新・削除の一覧と、確認が要る差分かどうかの判定）
3. 反映してよいかを聞く（`--yes` を付けると聞きません）
4. サーバー側で `public_html` を控える（新しい 3 つを残します）
5. `rsync --delete` で反映する
6. 公開後の確認（下の `xserver:check`）

ビルドだけ先に済ませたときは `--no-build` を付けます。差だけを見たいときは `pnpm build && pnpm xserver:diff` です（サーバーは変わりません）。

### 消えないもの

`public_html` には、このサイトのビルドではないものも置いてあります。`scripts/xserver/cli.ts` の `EXCLUDES` に書いたものは、同期の対象から外れているので、`--delete` でも消えません。

| パス | 中身 |
| --- | --- |
| `8180/` | 2020 年の動画。CORS を許していて、ほかのサイトから読まれている可能性があります |
| `test/` | サブドメイン `test.uto-usui.com` の公開ディレクトリ（今はありません） |
| `default_page.png` | サーバーの初期ページの画像 |

サーバーにだけ置くものを増やしたら、`EXCLUDES` に足してください。

`public_html/.htaccess` はリポジトリの `public/.htaccess` から反映されます。サーバーで直接書き換えると、次の公開で上書きされます。

## 自動デプロイ

手元の Mac の launchd（`com.uto-usui.auto-deploy`）が 5 分ごとに `scripts/xserver/auto-deploy.sh` を動かします。サーバーが SSH の接続元を絞っているので、GitHub Actions からは出せません。

```bash
pnpm xserver:auto:install     # 入れる・入れ直す（auto-deploy.sh を直したときも）
pnpm xserver:auto:uninstall   # 止める
```

出すのは、次の 2 つを満たす `origin/master` の先頭だけです。

1. その sha の push の CI が success。docs・README・`.claude/` だけの変更は CI が走らないので、何もせずに処理済みにします
2. `xserver:deploy --only-if-safe` の判定が「確認なしで進めてよい」。「確認が要る」差分なら、サーバーに触れずに止めて通知します

結果（公開した・止めた・失敗した）は `~/.local/state/uto-usui-auto-deploy/notify` に実行ファイルを置くと、件名と本文を引数で受け取れます。通知の送り先や token はリポジトリに置きません。止めたり失敗したりした sha は、次の回からやり直しません。fetch や `gh api` が一時的に失敗したときと、`pnpm install` に失敗したときだけ、次の回にやり直します。公開後の確認に ✖ が出ても自動では戻さないので、通知にある控えの名前で `pnpm xserver:rollback` します。

| 場所 | 中身 |
| --- | --- |
| `~/.local/state/uto-usui-auto-deploy/repo` | デプロイ用のクローン（HTTPS、読むだけ）。作業用のリポジトリには触れません |
| `~/.local/state/uto-usui-auto-deploy/last-sha` | 最後に処理した sha |
| `~/.local/state/uto-usui-auto-deploy/auto-deploy.sh` | 動いているスクリプト。install のときに写します |
| `~/Library/Logs/uto-usui/auto-deploy.log` | ログ |

反映せずに試すときは `bash ~/.local/state/uto-usui-auto-deploy/auto-deploy.sh --dry-run` です。Mac がスリープ中や電源が切れているときは動かず、起きたときに追いつきます。自動ではエラーログを取りません（取るコマンドが認証を求めることがあるため）。

## 戻し方

```bash
pnpm xserver:rollback                    # 控えの一覧（新しい順）
pnpm xserver:rollback 20261025-120000    # その控えに戻す（確認が出ます）
```

戻したあとに公開後の確認が走ります。

## そのほかのコマンド

| コマンド | すること |
| --- | --- |
| `pnpm xserver:pull` | サーバーの `public_html` を `.snapshot/server/public_html/` に取ってくる。サーバーは変わりません |
| `pnpm xserver:diff` | `dist/` とサーバーの差と判定。`--json` で機械向けの出力 |
| `pnpm xserver:check` | 主な URL（`/`、sitemap、robots.txt、`og.jpg`、`sw.js`、404、`http://`・`www.`・`/index.html` からの転送、応答ヘッダー、`8180/` の CORS）を確かめ、エラーログの直近 20 行を出す |

エラーログは、`.xserver.json` の `error_log_command` を書いたときだけ取ります。

## よくあるエラー

| 出力 | 原因と直し方 |
| --- | --- |
| `Permission denied (publickey)` | SSH が無効か、鍵が登録されていません。エックスサーバーの設定を確かめます。鍵の場所が違うときは `.xserver.json` の `ssh_key` か `XSERVER_SSH_KEY` で渡します |
| `Connection closed` / `Connection timed out` | サーバーが SSH の接続元を絞っているので、許していない回線からはつながりません。いつもの回線から実行します |
| `エラーログを取れませんでした` | `error_log_command` が失敗しました。公開そのものは SSH だけで済むので、ここで止まっても反映は終わっています |
| `PUBLIC_GA4_ID がありません` | `.env` を作ります（最初の準備の 4） |
| `確認に答えられない環境です` | 端末でない所から `xserver:deploy` を呼んでいます。差分を読んで判断したうえで `--yes` を付けます |
| `robots.txt` など名前の変わらないファイルが古いまま | X アクセラレータが `.htaccess` の Expires の期間だけ覚えています。サーバーキャッシュは off なので、API の削除（`DELETE /server-cache/...`）は効きません。`robots.txt` と sitemap は 1 時間にしてあるので待ちます。HTML と `sw.js` は `no-cache` なので起きません |
| 公開後の確認に ✖ が出る | どの URL で何が違うかが出ます。`.htaccess` の変更が原因のことが多いので、`public/.htaccess` を見直します。急ぐときは `pnpm xserver:rollback` で戻します |
