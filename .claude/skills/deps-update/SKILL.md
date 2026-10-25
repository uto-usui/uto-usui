---
name: deps-update
description: uto-usui の依存を手元で更新する。脆弱性の直し（security）と、ふだんの版上げ（routine）の両方を扱い、調べる・上げる・直す・確かめるまでやって 1 本の PR にし、チェックが通ればマージする。Dependabot alerts のメールが来たとき、CI の audit が落ちたとき、「依存を更新して」「セキュリティアップデートして」「脆弱性を直して」「パッケージを上げて」と言われたときに使う。
---

# deps-update

このリポジトリは Dependabot に PR を作らせない（alerts だけを受ける）。依存の更新はこのスキルで、手元で考えて直しながら 1 本の PR にする。気づくきっかけは、Dependabot alerts のメールと、CI の `pnpm audit`。webmanab の同じ名前のスキルと同じ手順にしてある。

## どちらをやるか

- **security**: 脆弱性を直す。alert のメールや audit の失敗がきっかけ。手順 2 で対象を出す。
- **routine**: ふだんの版上げ。月に 1 回くらい、または頼まれたとき。手順 2 の代わりに「routine の対象の選び方」で対象を決める。

頼まれ方から決められなければ、security を先にやり、続けて routine をやるかを聞く。

## 手順

1. 最新の master から作業用のブランチを切る。

   ```sh
   git switch master && git pull --ff-only
   git switch -c deps-update/$(date +%Y-%m-%d)
   pnpm install --frozen-lockfile
   ```

2. （security）直す対象を出す。何も出なければ、手順 8 だけをやって終わる。

   ```sh
   node scripts/security-update.mjs
   ```

   修正版のない脆弱性と、`pnpm-workspace.yaml` の `auditConfig.ignoreGhsas` で受け入れたものは出ない。

3. 上げる。

   - security: 依存の範囲の中で上げる。`pnpm update --depth Infinity <名前>`。範囲の中で直らなければ、親のパッケージを上げて直るかを先に試す。だめなら `pnpm-workspace.yaml` の `overrides` で上げる。
   - routine: `pnpm add <名前>@<版>`（devDependencies は `-D`）。版はこのリポジトリでは固定で書く（`^` を付けない）。
   - どちらも、上げる前に変更履歴（リリースノート、CHANGELOG）を読み、壊れそうな変更を拾っておく。
   - 直す手がないもの（修正版がない、上げると壊れて直せない）は無理に上げず、報告に回す。受け入れると決めたものだけ、理由のコメントを付けて `ignoreGhsas` に入れる。

4. チェックを全部回し、落ちたところを直す。

   ```sh
   E2E_PORT=4399 pnpm verify
   pnpm audit --audit-level high
   ```

   `gsap`、`lenis`、`splitting`、`shuffle-text` を上げたときは、見た目の比べ方（`docs/renewal/README.md` の 3 章）で旧サイトの基準と比べ直す。

   - 落ちたら、変更履歴と照らして原因を調べ、コードを直す。直し方に迷うもの、見た目やふるまいが変わるものは、進める前にユーザーに見せる。
   - 上げた版が原因で直せないときは、その 1 つだけ版を戻して報告する。
   - `astro preview` はエージェントの環境だと裏に回ってすぐ終わる。手で立てるときは `--ignore-lock` を付ける。

5. `/contextual-commit` でコミットし、push して PR を作る。PR は 1 本だけにする。コミットは「版を上げたもの」と「それに合わせてコードを直したもの」を分ける。

   ```sh
   git push -u origin HEAD
   gh pr create --base master --title "build(deps): update dependencies $(date +%Y-%m-%d)" --body "<上げたもの（前 → 後）、直したコード、残したもの、チェックの結果>"
   ```

   `.github/workflows/` を変えたときは、gh のトークンに `workflow` の権限がないので HTTPS の push が断られる。`git push git@github.com:uto-usui/uto-usui.git HEAD` で push する。

6. CI を待ち、通ったらマージする。見た目やふるまいが変わる更新は、マージの前にユーザーに確かめる。

   ```sh
   gh pr checks --watch
   gh pr merge --squash --delete-branch
   ```

7. 公開する。マージしただけでは本番は変わらない。スキル `xserver-sync` の流れで公開し、公開後の確認まで済ませる。

8. 残りを確かめる。

   ```sh
   gh api 'repos/uto-usui/uto-usui/dependabot/alerts?state=open' --jq '.[] | .security_advisory.ghsa_id + " " + .dependency.package.name'
   ```

   開いたままの alert が残っていれば報告に書く。

## routine の対象の選び方

```sh
pnpm outdated
```

- 公開から 14 日たっていない版は、まだ上げない（公開直後の版に紛れ込む悪意のあるコードを避けるため）。`npm view <名前> time --json` で公開日を見る。
- 固定している理由があるものは上げない。
  - `typescript`（6.0 系）: `@astrojs/check` と `typescript-eslint` の peer が 7 に対応したら上げる
  - `@playwright/test`（1.64.1）: 基準スクリーンショットと同じ Chromium で比べるため。上げるときは基準の画像を撮り直す
- major を上げるものは 1 つずつ別のコミットにし、変更履歴を読んでから進める。
- GitHub Actions（`actions/checkout` など）も、ここで `.github/workflows/` の版を見て上げる。

## 衝突したとき

途中で master が進んで PR が衝突したら、作業用のブランチに master を取り込む。`pnpm-lock.yaml` は手で直さず、master 側を元にして作り直す。

```sh
git merge master
git checkout --theirs pnpm-lock.yaml   # master 側を採る
pnpm install
pnpm audit                             # 直した版が残っているか確かめる
```

`package.json` が衝突したら、両方の変更を残す。そのあと手順 4 からやり直す。

## 報告

最後に次をまとめて伝える。

- 上げたパッケージと版（前 → 後）、直った advisory の ID
- それに合わせて直したコード
- 上げずに残したものと、その理由
- 走らせたチェックの結果、PR とマージのコミット、公開と公開後の確認
