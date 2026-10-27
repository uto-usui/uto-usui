# uto-usui.com リニューアル計画

Nuxt 2 で作ったポートフォリオ（1 ページ）を、最新のフレームワークに載せ替える計画です。見た目は変えません。ホスティングはエックスサーバーのままで、手元の CLI からサーバーと同期できるようにします。

進め方は webmanab のリニューアルにそろえます。webmanab は記事が 1030 本あったので文書を 10 本に分けましたが、こちらは 1 ページなので、この文書 1 本にまとめます。

## 1. 前提になった事実（2026-10-25 に確認）

### 1.1 今のコード

- Nuxt 2.15（`target: 'static'`）、Vue 2 + `@vue/composition-api`、Vuex、TypeScript、Node 12（`.nvmrc` は v12.14.1）、yarn。
- ページは `pages/index.vue` の 1 枚だけです。OVERVIEW / WORKS / ABOUT / OTHER / FOOTER の 5 区画を、Atomic Design の部品（atoms 13、molecules 4、organisms 6）で組んでいます。`.vue` と `.ts` は合わせて約 3000 行です。
- 文言と作品のデータは `data/view.ts` にあります。画像は `assets/images/` の jpg 74 枚です。
- 動きに使っているもの:
  - locomotive-scroll v4 で慣性スクロールと視差を出しています（`data-scroll-speed` が 11 か所、`data-scroll-call` でスクロールに合わせて背景の色相を変えています）。
  - GSAP 3（`SlowMo` を使用）で、読み込み後の登場の動きを出しています。
  - splitting で文字を 1 字ずつ分け、shuffle-text でリンクの文字を入れ替えています。
  - 図形（`MoleculeShapes`）、ローダー、BGM（`static/music/bgm.mp3`、2.1MB、初期状態はミュート）、YouTube の埋め込み（vue-youtube）、画像の遅延読み込み（vue-lazyload）があります。
- 使っていないもの: three.js の文字の演出（`assets/js/typo/`、`AtomCanvas`）はどこからも呼ばれていません。nuxt-user-agent が付ける `is-mobile` / `is-<browser>` などの class は、CSS からも JS からも参照されていません。
- 本番の JS に `console.log` が残っています（`terser` の `drop_console: false`、`🐈 resize` など）。

### 1.2 今の本番（`https://uto-usui.com/`）

- エックスサーバーの追加ドメインです。ネームサーバーもエックスサーバーです。
- `http://` と `www.` は `https://uto-usui.com/` へ 301 で転送されています。転送は `public_html/.htaccess` の `mod_rewrite` でやっています（`/index.html` を `/` へ寄せる転送も同じ場所です）。
- `public_html/.htaccess`（2021-03-01 更新）には、ほかに次の設定があります。新しい `.htaccess` に持っていくものと、書き換えるものを 4 章で決めます。
  - `mod_expires` のキャッシュ期間（HTML は 1 秒、画像は 30 日など）と `mod_deflate` の圧縮。
  - `8180/` の動画（`mp4` / `webm`）に `Access-Control-Allow-Origin: *` を付ける設定。ほかのサイトから読まれている可能性があります。
  - サーバーキャッシュ用の `Ngx_Cache_*` の環境変数。WordPress と SiteGuard の空の目印（中身はありません）。
- `public_html` には、Nuxt のビルドではないものも置いてあります。**これらは同期で消してはいけません。**

  | パス | 中身 | 扱い |
  | --- | --- | --- |
  | `note.uto-usui.com/` | サブドメイン用に作られたディレクトリ。DNS は note のサーバーを向いていて、ここからは配っていない | 公開のあと消した |
  | `8180/` | 2020-05 の動画 5 本（17MB） | 残す。同期の対象から外す |
  | `assets/` | 2018 年ごろの旧サイトの CSS / JS / 画像 / BGM（97 ファイル、13MB） | 公開のあと消した |
  | `default_page.png`、`.nojekyll`、`200.html` | サーバーの初期ページの画像、GitHub Pages の目印、Nuxt の SPA 用の予備ページ | 新しいビルドに要らないので、公開のときに消える。`default_page.png` だけは残す |

  サブドメイン `test.uto-usui.com` の公開ディレクトリ（`public_html/test`）は、設定だけあってディレクトリはありません。`robots.txt` の `Disallow: /test/` はこれに当たります。
- HTML の `Last-Modified` は 2021-09-17 です。リポジトリの最後のコミット（`98408b3` を除く）は 2021-03-24 なので、**本番を作ったコードはリポジトリに全部は入っていません**。実際に次の違いがあります。

  | 項目 | 本番 | リポジトリ |
  | --- | --- | --- |
  | `<html lang>` | `en` | `ja` |
  | KARTE のタグ（`cdn-blocks.karte.io/.../builder.js`） | ある | ない |
  | ブログのリンク | `https://webmanab-html.com/`（期限切れでパーキング中） | `https://webmanab.com/`（`98408b3` で更新済み） |

  このため、**見た目の正本はリポジトリではなく本番**とします。
- `<head>` で読んでいる外部の script:
  - `cdn.polyfill.io/v2/polyfill.js`: 今は DNS が引けません。2024 年に乗っ取られて悪性のコードを配った CDN です。
  - KARTE: 今も 200 で返ってきます。
  - GA4（`G-EFFLZF7XMD`）。
- PWA の `sw.js`（workbox 5、`skipWaiting`、`/?standalone=true` を precache）と manifest を配っています。`robots.txt` は `Disallow: /test/` だけです。`sitemap.xml` と 404 ページはありません（404 はサーバーの既定のページです）。
- 応答のヘッダーは `cache-control: max-age=1` です。サーバー側のブラウザキャッシュ設定とサーバーキャッシュはどちらも off で、X アクセラレータは v1 です。

### 1.3 エックスサーバーの状態

- SSH は鍵で入ります。サーバーは SSH の接続元を絞っているので、GitHub Actions からは rsync できません（7.4）。
- 同じサーバーにはほかのサイトもあります。同期はこのサイトの公開ディレクトリの中に閉じ、ほかのディレクトリには触りません。

### 1.4 退避済みのもの

- 本番から HTTP で取れるファイル 157 個（HTML、遅延読み込みのものを含む JS 53 本、画像、アイコン、BGM、`sw.js`、manifest）を `.snapshot/live/` に保存しました（コミットしません）。`.snapshot/live/` を静的に配信すれば、旧サイトを手元で動かせます。
- SSH で `public_html` をまるごと（264 ファイル、39MB、`.htaccess` を含む）`.snapshot/server/public_html/` に取りました。HTTP で取ったものと、重なるファイルの中身は一致しました。

## 2. 技術の構成

| 項目 | 採用するもの | 根拠 |
| --- | --- | --- |
| フレームワーク | **Astro 7.4.2**（今の最新）。静的出力で、Vue は使いません | 下の 2.1 |
| Node | 26 系（`.nvmrc` に `26`） | webmanab と同じ。10/28 に LTS になります |
| pnpm | 10.34.6（`packageManager` で固定） | webmanab と同じ。Dependabot が pnpm 10 までしか対応していないためです |
| TypeScript | **6.0 系**（最新の 7.0.2 は使いません） | `@astrojs/check` 0.9.12 の peer が `^5 \|\| ^6`、typescript-eslint 8.72.0 の peer が `<6.1.0` です（2026-10-25 に確認）。対応したら上げます |
| スタイル | 今の SCSS を Dart Sass 1.106 に移します。`@import` は `@use` に書き換えます。`@nuxtjs/style-resources` で全体に差し込んでいた変数・関数・mixin は、Vite の `additionalData` で差し込みます | 見た目を変えないため、CSS はできるだけそのまま持っていきます |
| 部品 | `.vue` を `.astro` に書き直します。Atomic Design の分け方と class 名はそのまま残します | class 名を残すと、CSS と見た目の比較がそのまま使えます |
| ブラウザ側の動き | 素の TypeScript の `<script>`。Vuex の状態（スクロール量、画面の大きさ、ページの準備ができたか）は、小さなモジュールに置き換えます | ほとんどが DOM を直接動かす処理なので、Vue の反応性は要りません |
| 慣性スクロール | **Lenis 1.3.27** の上に、旧サイトの locomotive-scroll v4.1.4 の視差の式を移しました（`src/scripts/scroll.ts`）。v4 と同じく、幅 1024px 未満とタッチ端末では native のスクロールにして視差を止めます。慣性スクロールのときは native のスクロールバーを隠し、v4 と同じ見た目の細いバー（`.c-scrollbar`）を出します | locomotive-scroll v5 は、要素ごとに横へ動かす `data-scroll-direction="horizontal"` を持っていません。このサイトは横の視差を作品の画像、写真の列、メールの帯で使っているので、v5 では見た目を保てません。v4 は 2022 年から更新がなく、ページ全体を transform で動かすので、ページ内検索やキーボード、支援技術と相性がよくありません。Lenis は native のスクロールを保ったまま慣性だけを足します。native のバーを隠すのは、Windows ではバーが幅を取り、rem の基準（vw）がずれるためです |
| ほかの演出 | GSAP 3.15、shuffle-text 0.6.0。splitting 1.1.0 は CSS だけを使い、文字の分け方はビルドのときに同じ HTML を作ります（`src/lib/splitting.ts`） | どれも今の最新です。旧サイトはブラウザで splitting を動かしていましたが、ビルドのときに分ければ JavaScript なしでも本文が HTML に入ります |
| 画像 | `astro:assets` の `<Picture>` で AVIF / WebP を作り、`loading="lazy"` で遅延読み込みします | nuxt-optimized-images、lqip / sqip / webp の loader、vue-lazyload、`plugins/image-env.ts` の WebP 判定をまとめて置き換えます。読み込み中の見え方は旧サイトと比べて合わせます |
| YouTube | `youtube-nocookie.com` の iframe を、押されてから読み込みます | vue-youtube の置き換えです。最初に読む外部の script が減ります |
| フォント | Playfair Display を `@fontsource/playfair-display` で自分のサーバーから配ります（latin の 400 / 700、立体と斜体）。和文は今と同じく OS のフォントです | nuxt-webfontloader と Google Fonts の置き換えです |
| 旧 PWA | 自分を解除してキャッシュを消す `sw.js` を同じパスに置きます。manifest はやめます | 置かないと、前に来た人に旧サイトが残り続けます。webmanab と同じやり方です |
| 開発ツール | ESLint（flat config）、Prettier、Stylelint、Vitest 5、Playwright 1.64.1、`@axe-core/playwright` | webmanab の設定を持ってきます |
| CI | GitHub Actions で lint / check / test / build / E2E を回します。デプロイはしません | 7.4 |
| 依存の更新 | webmanab と同じく、Dependabot は alerts だけにして、更新は手元でスキル `deps-update` を使います | webmanab の `.claude/skills/deps-update/` を持ってきます |

### 2.1 Astro にする理由

このサイトはほとんどが JS で動く演出なので、「JS を送らない」という Astro のいちばんの利点はあまり効きません。それでも Astro にするのは次の理由です。

- **webmanab と道具を共用できる。** 見た目の比較の仕組み（`capture.ts` と compare 一式）、`pnpm verify` の流れ、lint の設定、`deps-update` スキルをそのまま使えます。2 つのサイトを同じ手順で保守できます。
- **Nuxt 4 にしても書き直す量は変わらない。** Vue 2 + composition-api + Vuex から Vue 3 + Nuxt 4 へは、部品、状態、プラグイン、設定を全部書き直すことになります。同じ Vue だから楽になる、ということはありません。
- **1 ページで、画面の切り替えがない。** ルーターや hydration の仕組みが要りません。Vue の実行環境を送らない分だけ、ページは軽くなります。

Nuxt 4.6.2 も比べましたが、上の理由で選びませんでした。

## 3. 見た目を変えないための基準

### 3.1 基準の撮り方

webmanab の `.snapshot/baseline/capture.ts` をもとに、このサイト用の撮影スクリプト `scripts/visual/capture.ts` を作りました。比べるのは `scripts/visual/compare.ts`、a11y は `scripts/visual/axe.ts` です。旧サイトは本番ではなく、手元の `.snapshot/live/`（7.2 の `pull` 以降はサーバーから取った完全な写し）を配信して撮ります。こうすると、本番を入れ替えたあとでも撮り直せます。

- 幅: 375 / 768 / 1023 / 1024 / 1199 / 1200 / 1440 / 1920。768、1200、1440、1920 は CSS の境（`_breakpoint.scss`）で、1023 と 1024 は locomotive-scroll v4 が慣性スクロールと視差を始める境（`innerWidth < 1024` は native のスクロール）です。最初の案の 1279 / 1280（`nuxt-mq` の境）は、CSS からも JavaScript からも使われていなかったのでやめました。
- 状態: 読み込み中（1.2 秒）、登場の動きが終わったあと（45 秒）、そこから 1 画面ずつ下へスクロールしたところ（最後は一番下）、nav とリンクにマウスを乗せたところ、サウンドのボタンを押したところ。
- スクロールは、旧サイトは locomotive-scroll の `setScroll` と `checkScroll`、新サイトは `window.scrollTo` で動かします。どちらも視差の基準の位置は測り直しません（手でスクロールしたときと同じです）。
- 図形（`.of__shapes`）は、登場後の画像では隠します。乱数の呼び出し順は旧サイトにそろえましたが、図形はずっと動き続けるので、止めた時刻の位置を比べる意味が薄いためです。
- 動きを止める: Playwright の clock で時間を固定し、`Math.random` を種付きにして、図形の位置と文字の入れ替わりを毎回同じにします。それでも 2 回撮って差が出る場所は、3.2 の一覧に入れます。
- 画像のほかに、要素ごとの computed style も保存して比べます（webmanab と同じです）。

### 3.2 変わってよい場所

| 場所 | 変わり方 | 理由 |
| --- | --- | --- |
| 作品・写真・音楽の画像 | 細かい画素が変わる（位置と大きさは同じ） | `astro:assets` で AVIF / WebP / 幅違いの JPEG に作り直すため |
| 図形（`.of__shapes`） | 位置と線の色が変わる | 乱数の呼び出し順は旧サイトにそろえたが、旧サイトは図形が動き出す前に乱数を 2 つ多く使っていて、1 つずつずれる（どこで使っているかは突き止めていない）。時間で動き続ける演出なので、登場後の画像では隠して比べる |
| 慣性スクロールのときの区画（`[data-scroll-section]`） | computed style の `transform` と `opacity` が変わる | v4 は区画ごと transform で動かし、画面から遠い区画を `opacity: 0` にしていた。新サイトは native のスクロールなので、区画は動かさない。見えている画面は同じ |
| スクロールバー（`.c-scrollbar`） | `position` が `absolute` から `fixed` になる | native のスクロールでも画面の右に留めるため。見た目は同じ |
| YouTube の枠 | 押す前は、サムネイルと再生ボタンだけを出す | 押されてから `youtube-nocookie.com` の iframe を読む（4 章）。旧サイトは最初から YouTube のプレイヤーを読んでいた |
| サウンドのボタン | 自動再生が止められて鳴っていないときは、1 回目の押下で鳴らす | 旧サイトは「再生中」の見た目のまま鳴っておらず、鳴らすには 2 回押す必要があった。最初の見た目は同じ |
| 読み上げ用の要素 | `.util-split` に読み上げ用の文（`.is-sr-only`）が入る。固定の部品の外側が `div` から `header` になる | a11y（4 章）。見た目は変わらない |
| `<head>` | 外部の script が GA4 だけになる。CSP の `<meta>`、canonical、構造化データが入る | 4 章。`lang` は本番と同じ `en` のまま（本文が英語のため。最初の案の「`ja` になる」は誤りだった） |

### 3.3 比べた結果（2026-10-25）

旧サイトは `.snapshot/server/public_html/` を `python3 -m http.server` で、新サイトは `pnpm preview` で配り、`scripts/visual/capture.ts` で 8 幅 × 各 15〜40 枚を撮りました（Playwright 1.64.1、Chromium 156、macOS）。

- 旧サイトを 2 回撮った画像は、全部で差が 0 でした。基準は安定しています。
- 新旧の画像の差（pixelmatch、threshold 0.1）は、ほとんどが 0.1% 未満です。それより大きいものは、どれも 3.2 の表で説明がつきました。
  - 作品の画像が写る画面（0.1〜1.3%）: 画像を作り直したことによる細かい画素の差。位置と大きさは同じです。
  - 登場後の画面（0.2〜0.5%）: 図形の位置。
  - 音楽の区画（2〜18%）: YouTube の枠。旧サイトの撮影では YouTube への通信を止めているので空になり、新サイトは押す前のサムネイルを出します。
- computed style の差は、図形の `transform`、慣性スクロールのときの区画の `opacity`、`.c-scrollbar` の `position`、背景のグラデーションの書き方（`0px` と `0%`。描き方は同じ）だけです。最初の比較で出た Playfair Display の字幅の差は、旧サイトが読んでいた Google Fonts のファイルをそのまま自分のサーバーから配るようにして消しました。
- ページの高さ（スクロールの終わり）は、8 幅とも旧サイトと同じです。

a11y（axe、登場後、375px と 1440px）:

| 違反 | 旧サイト | 新サイト |
| --- | --- | --- |
| `aria-hidden-focus`（読み上げから隠した中にリンクがある） | 1 | 0 |
| `aria-prohibited-attr`（`aria-label` を付けられない要素に付けている） | 8 | 0 |
| `region`（ランドマークの外にある内容） | 1 | 0 |
| `color-contrast` | 375px で 14 | 14 |

`color-contrast` はデザインの色（作品へのリンクの色など）なので、見た目を変えないために残しました。旧サイトの 1440px で 0 件なのは、慣性スクロールで画面外の区画が `opacity: 0` になっていて、axe が調べなかったためです。

Lighthouse 12.8.2（手元、GA4 などの外部への通信は止めて測った）:

| | 性能 | a11y | ベストプラクティス | SEO | LCP | 転送量 |
| --- | --- | --- | --- | --- | --- | --- |
| 旧サイト（モバイル） | 65 | 87 | 82 | 92 | 6.0 秒 | 1,000 KiB |
| 新サイト（モバイル） | 97 | 96 | 100 | 100 | 2.3 秒 | 264 KiB |
| 旧サイト（デスクトップ） | 98 | 92 | 81 | 92 | 0.9 秒 | 1,185 KiB |
| 新サイト（デスクトップ） | 100 | 96 | 100 | 100 | 0.5 秒 | 308 KiB |

## 4. 見た目の外で直すこと

「モダンにする」の中身です。見た目は変えずに、次のことを入れます。

| 分類 | やること |
| --- | --- |
| 安全 | polyfill.io の読み込みを消します。`.htaccess` で応答ヘッダー（`X-Content-Type-Options`、`Referrer-Policy`、`Permissions-Policy`、HSTS）を足します。CSP は Astro の `security.csp` で `<meta>` に出します。script と `<style>` はハッシュで許し、外は GA4 と YouTube（押されたあとの iframe）だけを許します。splitting が要素の `style` 属性を使うので、`style-src-attr` だけ `unsafe-inline` にしました |
| 計測 | GA4（`G-EFFLZF7XMD`）は続けます。ID は環境変数で渡し、本番のビルドでだけ読みます。Google Search Console に `uto-usui.com` をドメインプロパティで登録し（確認用の TXT レコードは API で足しました）、sitemap を送りました（2026-10-25）。 |
| 検索・共有 | `@astrojs/sitemap` で `sitemap.xml` を作り、`robots.txt` から指します。OGP と Twitter Card は今の内容のまま、`og:image` の絶対 URL と `canonical` を正しく出します。人物の構造化データ（JSON-LD の `Person`）を足します。404 ページを作ります |
| 速さ | ハッシュ付きの `/_astro/*` は 1 年キャッシュ、HTML は毎回確かめる、という設定を `.htaccess` に書きます（今は `max-age=1`）。BGM は押されてから読み込みます。Core Web Vitals を Lighthouse で旧サイトと比べ、悪くならないことを確かめます |
| a11y | 「今より悪くしない」を守ります。OS で「視差効果を減らす」を選んでいる人には、慣性スクロールと大きな動きを止めます（`prefers-reduced-motion`）。動きを減らしていない人の見た目は変わりません。直す順番は axe の結果を一覧にしてから決めます |
| `.htaccess` | 今の `.htaccess` をもとに `public/.htaccess` を作り、リポジトリで管理します。`http` / `www` / `/index.html` の転送と、`8180/` の動画の CORS はそのまま残します。WordPress と SiteGuard の空の目印は消します。`note.uto-usui.com` は DNS が note のサーバーを向いているので、この `.htaccess` は効きません |
| 外部の script | KARTE のタグは消します（2026-10-25 にユーザーが了承）。GA4 は今のプロパティを使い続けます（同日、使えることをユーザーが確認） |
| 掃除 | 使っていない three.js の演出、`Debug` 部品、UA 判定、`console.log` を持っていきません |

## 5. 手順

| # | やること | 終わりの条件 |
| --- | --- | --- |
| 0 | 旧サイトを退避する | **済み**。`.snapshot/live/`（HTTP）と `.snapshot/server/public_html/`（SSH でまるごと）に保存した |
| 1 | 見た目の基準を撮る（3.1） | **済み**。2 回撮った画像は全部一致した |
| 2 | 雛形を作る（Astro、Node 26、pnpm、lint、CI） | **済み**。yarn と Nuxt 2 のファイルは消した |
| 3 | スタイルを移す | **済み**。使っているものだけを `@use` の形で移し、Dart Sass 1.106 で警告なく通る |
| 4 | マークアップを移す（部品を `.astro` に） | **済み**。登場後の状態で computed style を比べた（3.3）。旧サイトは JS を切ると本文が空になるので、JS を切った比較はやめた |
| 5 | 演出を移す（スクロール、登場の動き、文字、図形、ローダー、サウンド、YouTube） | **済み**。v5 ではなく Lenis + v4 の式の移植にした（2 章） |
| 6 | head、SEO、計測、`.htaccess`（4 章） | **済み**。`test/dist/` で確かめる |
| 7 | エックスサーバーとの同期（7 章） | **済み**。dry-run で、旧サイトの `_nuxt/` などの削除と `.htaccess` の変更が「確認が要る」と判定された |
| 8 | 比べて仕上げる | **済み**（3.3） |
| 9 | 公開する | **済み**（2026-10-25、PR #1）。`xserver:deploy` で入れ替えた。公開後の確認は、`robots.txt` が X アクセラレータのキャッシュで古いまま返ったほかは通った。同じ日に Search Console にドメインプロパティで登録し（確認用の TXT は API で追加）、sitemap を送った |

## 6. やらないこと

- デザインを変えること。文言を書き換えること（下の段落）。
- CMS を入れること。作品は今と同じく `data/` のデータで持ちます。
- PWA を続けること。
- サーバーにある、このサイト以外のディレクトリに触ること。

文言について: 「I am 31 years old」「@ Condé Nast」などのプロフィール文は 2021 年の時点の内容です。リニューアルでは今のまま移し、公開したあとでユーザーが直します。

## 7. エックスサーバーとの同期

サーバーの設定（SSH の有効化、鍵の登録、DNS など）はこのリポジトリの外で扱います。このリポジトリには、このサイトを同期する薄い層だけを置きます。

### 7.1 最初に 1 回だけやること

1. SSH を有効にし、公開鍵を登録する（**済み**）。
2. SSH で `public_html` の中身と `.htaccess` を見て、`www` と `http` の転送をどこでしているか確かめる（**済み**。1.2 に書きました）。
3. サーバー名・公開ディレクトリ・鍵の場所を書いた `.xserver.json` を作る（`.gitignore` に入れます。**済み**）。中身は [../xserver.md](../xserver.md) にあります。

### 7.2 スクリプト

`scripts/xserver/` に置き、`package.json` から呼びます。`pnpm deploy` は pnpm に元からあるコマンドなので、名前は `xserver:*` にします。

| コマンド | すること |
| --- | --- |
| `pnpm xserver:pull` | サーバーの `public_html` を `.snapshot/server/` に rsync で取ってくる（サーバー → 手元。サーバーは変えません） |
| `pnpm xserver:diff` | `dist/` とサーバーの差を `rsync -n --itemize-changes --delete` で出す。追加・更新・削除されるファイルの一覧になります |
| `pnpm xserver:deploy` | 次を順に行う。① `pnpm build` ② diff を表示 ③ 確認を求める（`--yes` で省く）④ サーバー側で `public_html` を控えとして複製（直近 3 つを残す）⑤ `rsync --delete` で反映 ⑥ 公開後の確認 |
| `pnpm xserver:rollback` | ④ で複製したもののうち、指定したものを `public_html` に戻す |
| `pnpm xserver:check` | 主な URL（`/`、`/sw.js`、`/sitemap.xml`、`/og.jpg`、`http://`・`www.` からの転送）の応答を確かめ、API でエラーログを取る |

- rsync の除外: `.git`、`node_modules`、`.env`、`.DS_Store`、`.xserver.json`。加えて、サーバーにだけあるもの（`/8180/`、`/test/`、`/default_page.png`）を除外します（`/note.uto-usui.com/` と `/assets/` は公開のあとに消したので外した）。除外したものは `--delete` でも消えません。除外の一覧はスクリプトの中の 1 か所にまとめ、サーバーにだけ置くものが増えたらここに足します。
- SSH の鍵は `.xserver.json` の `ssh_key` で渡します。API キーは使いません。エラーログは、`.xserver.json` に取り方のコマンドを書いたときだけ取ります。
- 人が手で叩くときは ③ で一覧を見て答えます。Claude Code から呼ぶときは、7.4 の判断を済ませてから `--yes` を付けます。

### 7.3 エージェント向けのスキルと人向けのガイド

- `.claude/skills/xserver-sync/SKILL.md`: 7.4 の流れと判断の基準を書きます。サーバーの設定（SSH、ドメイン、DNS、キャッシュ）には触りません。
- `docs/xserver.md`: 人が CLI で操作するときのガイドです。最初の準備（7.1）、毎回の公開、戻し方、よくあるエラーを書きます。

### 7.4 公開の流れ

PR を master にマージしたら、手元の Claude Code がスキル `xserver-sync` で公開します。CI はビルドとテストの確認だけで、公開はしません。サーバーが SSH の接続元を絞っていて、GitHub Actions からは SSH できないためです。

きっかけは、Claude Code で PR をマージしたとき（続けて公開に進みます）か、「デプロイして」と言われたときです。スキルは次の順で進めます。

1. 公開してよい状態かを確かめる。master にいて、`origin/master` と一致し、作業ツリーがきれいで、マージしたコミットの CI が通っている（`gh` で確認）。
2. `pnpm build` のあと `pnpm xserver:diff` を取り、差分を読んで判断する。
3. 判断が「進める」なら `pnpm xserver:deploy --yes` で反映し、`pnpm xserver:check` の結果と公開した URL を報告する。

2 の判断の基準:

| 差分 | 判断 |
| --- | --- |
| マージした PR の変更から説明がつく追加・更新と、前のビルドのハッシュ付きファイル（`_astro/*`）の削除だけ | 確認なしで進める |
| ビルドが作らないファイルの削除（サーバーにだけ置いたもの）、`.htaccess` の変更、`index.html` が消える、ファイル数が大きく減る | 止めて、一覧を見せて確認を取る |
| 1 の条件を満たしていない、ビルドやテストが落ちた | 公開しない。理由を報告する |

`rsync --delete` は、ふつうは毎回ユーザーの確認が要る操作です。このサイトでは、上の表の 1 行目に当たる差分なら確認なしで進めてよい、とユーザーが決めました（2026-10-25）。反映の前に必ずサーバー側へ控えを取るので、`pnpm xserver:rollback` で戻せます。
