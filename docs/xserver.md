# エックスサーバーの操作ガイド

uto-usui.com はエックスサーバー（サーバー `<サーバー ID>.xsrv.jp`）に置いています。公開は CI ではなく、手元から CLI で行います。Claude Code に頼むときは「デプロイして」と言えば、スキル `xserver-sync`（`.claude/skills/xserver-sync/SKILL.md`）が同じ手順で進めます。

## 最初の準備

1 回だけやります。2026-10-25 の時点で 1 と 2 は済んでいます。

1. SSH を有効にして、公開鍵を登録する。鍵は `~/.ssh/<鍵のファイル>` です（別の鍵を使うときは `XSERVER_SSH_KEY` で渡します）。API での登録の手順は、グローバルのスキル `xserver` にあります。
2. つながるかを確かめる。

   ```bash
   ssh -i ~/.ssh/<鍵のファイル> -p <SSH のポート> <サーバー ID>@<サーバー ID>.xsrv.jp 'ls ~/uto-usui.com/public_html'
   ```

3. リポジトリの直下に `.xserver.json` を作る（`.gitignore` に入っているので、コミットされません）。

   ```json
   {
     "servername": "<サーバー ID>.xsrv.jp",
     "domain": "uto-usui.com",
     "deploy_path": "/home/<サーバー ID>/uto-usui.com/public_html",
     "deploy_source": "./dist"
   }
   ```

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
4. サーバー側で `public_html` を `~/backup/uto-usui.com/<日時>/` に控える（新しい 3 つを残します）
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

エラーログはエックスサーバーの API で取ります。API キーは パスワード管理アプリ からグローバルのスキル `xserver` の `xs-api.sh` が読みます。

## よくあるエラー

| 出力 | 原因と直し方 |
| --- | --- |
| `Permission denied (publickey)` | SSH が無効か、鍵が登録されていません。グローバルのスキル `xserver` で `GET /v1/server/<サーバー ID>.xsrv.jp/ssh` を見て、有効にするか鍵を登録します。鍵のファイル名が違うときは `XSERVER_SSH_KEY` で渡します |
| `Connection closed` / `Connection timed out` | SSH の接続元の制限が on なので、許していない回線からはつながりません。いつもの回線から実行します |
| `missing:password-manager(...)` | エラーログを取るときに API キーを読めませんでした。パスワード管理アプリ のロックを解除するか、item（`<パスワード管理アプリの項目>`）があるかを確かめます。公開そのものは SSH だけで済むので、ここで止まっても反映は終わっています |
| `PUBLIC_GA4_ID がありません` | `.env` を作ります（最初の準備の 4） |
| `確認に答えられない環境です` | 端末でない所から `xserver:deploy` を呼んでいます。差分を読んで判断したうえで `--yes` を付けます |
| `robots.txt` など名前の変わらないファイルが古いまま | X アクセラレータが `.htaccess` の Expires の期間だけ覚えています。サーバーキャッシュは off なので、API の削除（`DELETE /server-cache/...`）は効きません。`robots.txt` と sitemap は 1 時間にしてあるので待ちます。HTML と `sw.js` は `no-cache` なので起きません |
| 公開後の確認に ✖ が出る | どの URL で何が違うかが出ます。`.htaccess` の変更が原因のことが多いので、`public/.htaccess` を見直します。急ぐときは `pnpm xserver:rollback` で戻します |
