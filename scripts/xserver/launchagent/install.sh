#!/usr/bin/env bash
# 自動デプロイ（scripts/xserver/auto-deploy.sh）を 5 分ごとに動かす LaunchAgent を入れる。何度実行してもよい。
#
#   pnpm xserver:auto:install
#
# - デプロイ用のクローンを状態のディレクトリ（既定は ~/.local/state/uto-usui-auto-deploy、700）に HTTPS で作る。
#   公開リポなので資格情報を持たせない。作業用のリポジトリのブランチや未コミットの変更には触れない
# - .env と .xserver.json は、このコマンドを実行したリポジトリからクローンへ写す（600）
# - auto-deploy.sh もクローンではなく状態のディレクトリへ写して動かす。直したら入れ直す
# - 初めて入れるときは、いまの origin/master を処理済みにする（出ている前提）
# - node・pnpm・gh・git は絶対パスに解決して plist に埋める。launchd は対話シェルの PATH を引き継がない
set -euo pipefail

if [[ "$(uname)" != "Darwin" ]]; then
    echo "Error: LaunchAgent は macOS 専用です。" >&2
    exit 1
fi

LABEL="com.uto-usui.auto-deploy"
ORIGIN="https://github.com/uto-usui/uto-usui.git"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"
BASE="${AUTO_DEPLOY_DIR:-$HOME/.local/state/uto-usui-auto-deploy}"
OUT="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG="$HOME/Library/Logs/uto-usui/auto-deploy.log"

need() {
    local p
    p="$(command -v "$1" 2>/dev/null || true)"
    if [ -z "$p" ]; then
        echo "Error: $1 が PATH に見つかりません。" >&2
        exit 1
    fi
    echo "$p"
}
NODE="$(need node)"
PNPM="$(need pnpm)"
GH="$(need gh)"
GIT="$(need git)"
for f in .env .xserver.json; do
    if [ ! -f "$ROOT/$f" ]; then
        echo "Error: $ROOT/$f がありません（docs/xserver.md の「最初の準備」）。" >&2
        exit 1
    fi
done

mkdir -p "$BASE" "$(dirname "$LOG")" "$(dirname "$OUT")"
chmod 700 "$BASE"

if [ -d "$BASE/repo/.git" ]; then
    if [ "$("$GIT" -C "$BASE/repo" remote get-url origin)" != "$ORIGIN" ]; then
        echo "Error: $BASE/repo の origin が $ORIGIN ではありません。" >&2
        exit 1
    fi
    "$GIT" -C "$BASE/repo" fetch --quiet origin master
else
    "$GIT" clone --quiet "$ORIGIN" "$BASE/repo"
fi
for f in .env .xserver.json; do
    install -m 600 "$ROOT/$f" "$BASE/repo/$f"
done
install -m 700 "$HERE/../auto-deploy.sh" "$BASE/auto-deploy.sh"
if [ ! -f "$BASE/last-sha" ]; then
    "$GIT" -C "$BASE/repo" rev-parse origin/master >"$BASE/last-sha"
    echo "  いまの origin/master（$(cut -c1-7 "$BASE/last-sha")）を処理済みにしました"
fi

PATH_VALUE="$(dirname "$NODE"):$(dirname "$PNPM"):$(dirname "$GH"):$(dirname "$GIT"):/usr/bin:/bin"
sed \
    -e "s|{{HOME}}|$HOME|g" \
    -e "s|{{USER}}|$USER|g" \
    -e "s|{{PATH}}|$PATH_VALUE|g" \
    -e "s|{{BASE}}|$BASE|g" \
    -e "s|{{LOG}}|$LOG|g" \
    "$HERE/${LABEL}.plist.template" >"$OUT"

launchctl bootout "gui/$UID/$LABEL" 2>/dev/null || true
# bootout は止めきる前に返る。消えきらないうちに bootstrap すると「5: Input/output error」で失敗する
for _ in $(seq 1 20); do
    launchctl print "gui/$UID/$LABEL" >/dev/null 2>&1 || break
    sleep 0.25
done
launchctl bootstrap "gui/$UID" "$OUT"

echo "✓ Installed LaunchAgent: ${OUT}（5 分ごと）"
echo "  クローン: $BASE/repo"
echo "  ログ:     $LOG"
echo ""
echo "  通知:             $BASE/notify に実行ファイルを置くと、件名と本文を引数で渡します（無ければログだけ）"
echo "  反映せずに試す:   bash $BASE/auto-deploy.sh --dry-run"
echo "  すぐ 1 回動かす:  launchctl kickstart gui/$UID/$LABEL"
echo "  アンインストール: pnpm xserver:auto:uninstall"
