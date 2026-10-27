# uto-usui.com

uto usui のポートフォリオです。Astro で静的に書き出し、エックスサーバーに置いています。

## 開発

Node 26 と pnpm 10（`packageManager` で固定）を使います。

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm verify     # lint / format / 型 / unit / build / dist / E2E
```

| 場所               | 中身                                                                      |
| ------------------ | ------------------------------------------------------------------------- |
| `src/data/`        | 文言と作品のデータ                                                        |
| `src/components/`  | 部品（atoms / molecules / organisms）。class 名は旧サイト（Nuxt 2）のまま |
| `src/scripts/`     | ブラウザ側の動き（慣性スクロールと視差、登場の動き、リンク、サウンド）    |
| `src/styles/`      | 全体のスタイルと、全部の SCSS に差し込む変数・mixin                       |
| `public/.htaccess` | サーバーの転送・応答ヘッダー・キャッシュ                                  |
| `scripts/visual/`  | 旧サイトとの見た目の比較（`docs/renewal/README.md` の 3 章）              |
| `scripts/xserver/` | エックスサーバーとの同期                                                  |

## 公開

CI はビルドとテストの確認だけで、公開はしません。master にマージすると、手元の Mac の launchd が 5 分以内に出します（`pnpm xserver:auto:install` で入れます）。手で出すときの手順も [xserver.md](xserver.md) にあります。Claude Code には「デプロイして」と頼めば、スキル `xserver-sync` で進めます。

```bash
pnpm xserver:deploy
```

## リニューアルの記録

Nuxt 2 から Astro への載せ替えの計画と結果は [renewal/README.md](renewal/README.md) にあります。
