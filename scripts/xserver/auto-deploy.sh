#!/usr/bin/env bash
# master に入ったコミットを uto-usui.com に出す。launchd から 5 分ごとに呼ばれる（docs/xserver.md の「自動デプロイ」）。
# サーバーが SSH の接続元を絞っているので、GitHub Actions ではなく手元の Mac で回す。
#
# 出すのは次の 2 つを満たす origin/master の先頭だけ。どちらかが確定で駄目なら、その sha は出さずに通知する。
#   1. その sha の push の CI が success
#   2. cli.ts の判定が「確認なしで進めてよい」（--only-if-safe。駄目なら cli.ts が何もせずに終える）
#
#   auto-deploy.sh [--dry-run]   --dry-run は反映せず、条件と差分と判定までを見る。記録も通知もしない
#
# install.sh がこのファイルを状態のディレクトリに写して、そちらを動かす。
# クローンの checkout で動いている最中のスクリプトが書き換わらないようにするため。
# 通知は、状態のディレクトリに実行できる notify があれば、それに件名と本文を引数で渡す（無ければログだけ）。
# 通知の送り先や token はリポジトリに置かない。
set -euo pipefail

REPO="uto-usui/uto-usui"
ORIGIN="https://github.com/${REPO}.git"
BASE="${AUTO_DEPLOY_DIR:-$HOME/.local/state/uto-usui-auto-deploy}"
CLONE="$BASE/repo"
DONE="$BASE/last-sha"      # 処理を終えた sha。出したか、出さないと決めたもの
NOTIFIED="$BASE/notified"  # 一時的な失敗を同じ sha で何度も通知しないための印
NOTIFY="$BASE/notify"
LOCK="$BASE/lock"
DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

log() { printf '%s %s\n' "$(date '+%F %T')" "$*"; }

notify() {
    local title="uto-usui.com: $1" message="$2"
    if [ "$DRY_RUN" = 1 ] || [ ! -x "$NOTIFY" ]; then
        log "通知: $title / $message"
        return 0
    fi
    "$NOTIFY" "$title" "$message" || log "通知を送れませんでした: $title"
}

# この sha は処理済みにする。次の回からは同じ sha を見ない
finish() { [ "$DRY_RUN" = 1 ] || printf '%s\n' "$SHA" >"$DONE"; }

# 一時的な失敗（次の回にやり直すもの）の通知は、同じ sha で 1 回だけにする
notify_once() {
    [ "$(cat "$NOTIFIED" 2>/dev/null || true)" = "$SHA" ] && return 0
    notify "$1" "$2"
    [ "$DRY_RUN" = 1 ] || printf '%s\n' "$SHA" >"$NOTIFIED"
}

mkdir -p "$BASE"
chmod 700 "$BASE"
if ! mkdir "$LOCK" 2>/dev/null; then
    # 前の回がまだ動いている。落ちて残ったロックは 1 時間で外す
    if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +60 2>/dev/null)" ]; then
        rmdir "$LOCK" && mkdir "$LOCK"
    else
        exit 0
    fi
fi
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT

if [ ! -d "$CLONE/.git" ]; then
    log "クローンがありません: ${CLONE}（pnpm xserver:auto:install）"
    exit 1
fi
cd "$CLONE"
if [ "$(git remote get-url origin)" != "$ORIGIN" ]; then
    log "origin が $ORIGIN ではないので止める: $(git remote get-url origin)"
    exit 1
fi

if ! git fetch --quiet origin master; then
    log "fetch に失敗した。次の回にやり直す"
    exit 0
fi
SHA="$(git rev-parse origin/master)"
SHORT="${SHA:0:7}"
LAST="$(cat "$DONE" 2>/dev/null || true)"
if [ "$SHA" = "$LAST" ] && [ "$DRY_RUN" = 0 ]; then
    exit 0
fi
SUBJECT="$(git log -1 --format=%s "$SHA")"
log "$SHORT $SUBJECT"

# 1. CI
if ! ci="$(gh api "repos/$REPO/actions/runs?head_sha=$SHA&event=push&branch=master" \
    --jq '[.workflow_runs[] | select(.name == "CI")] | if length == 0 then "none" else (.[0].status + " " + (.[0].conclusion // "")) end')"; then
    log "gh api に失敗した。次の回にやり直す"
    exit 0
fi
case "$ci" in
"completed success") ;;
none)
    # CI は docs/**・README.md・.claude/** だけの変更では走らない（.github/workflows/ci.yml の paths-ignore）
    if [ -n "$LAST" ] && changed="$(git diff --name-only "$LAST" "$SHA" 2>/dev/null)" &&
        [ -z "$(printf '%s\n' "$changed" | grep -vE '^(docs/|README\.md$|\.claude/)' | grep -v '^$' || true)" ]; then
        log "サイトに関わる変更がないので出さない"
        finish
        exit 0
    fi
    # push の直後で run がまだできていないことがある。1 時間たっても無ければ止める
    if [ $(($(date +%s) - $(git log -1 --format=%ct "$SHA"))) -gt 3600 ]; then
        log "CI の run が 1 時間たっても無いので出さない"
        notify "自動では出しません" "$SHORT $SUBJECT の CI の run が見つかりません"
        finish
    else
        log "CI の run がまだない。次の回に見る"
    fi
    exit 0
    ;;
completed\ *)
    log "CI が通っていないので出さない（${ci}）"
    notify "CI が通っていないので出しません" "$SHORT ${SUBJECT}（${ci}）"
    finish
    exit 0
    ;;
*)
    log "CI が終わるのを待つ（${ci}）"
    exit 0
    ;;
esac

# ビルド。クローンは読むだけ。.env と .xserver.json は install.sh が置いたものを残す
git checkout --quiet --detach --force "$SHA"
git clean -fdxq -e .env -e .xserver.json -e node_modules
for f in .env .xserver.json; do
    if [ ! -f "$f" ]; then
        log "$CLONE/$f がない（pnpm xserver:auto:install をやり直す）"
        notify_once "公開できません" "デプロイ用のクローンに $f がありません"
        exit 1
    fi
done
# 判定の門（--only-if-safe）を持たない版の cli.ts で --yes を渡すと、判定を見ずに反映してしまう
if ! grep -q -- "--only-if-safe" scripts/xserver/cli.ts; then
    log "cli.ts が --only-if-safe を持っていないので出さない"
    notify "自動では出しません" "$SHORT の cli.ts に --only-if-safe がありません"
    finish
    exit 0
fi
if ! pnpm install --frozen-lockfile --reporter=silent; then
    log "pnpm install に失敗した。次の回にやり直す"
    notify_once "pnpm install に失敗しました" "$SHORT ${SUBJECT}。次の回にやり直します。詳しくはログを見てください"
    exit 1
fi
if ! pnpm build >/dev/null; then
    log "ビルドに失敗したので出さない"
    notify "ビルドに失敗しました" "$SHORT ${SUBJECT}。詳しくはログを見てください"
    finish
    exit 1
fi

# 2. 判定と反映
if [ "$DRY_RUN" = 1 ]; then
    node scripts/xserver/cli.ts diff
    log "dry-run なので反映しない"
    exit 0
fi
set +e
out="$(node scripts/xserver/cli.ts deploy --yes --no-build --only-if-safe --no-error-log 2>&1)"
code=$?
set -e
printf '%s\n' "$out"
backup="$(printf '%s\n' "$out" | sed -n 's|^サーバー側に控えを取りました: .*/||p')"
case "$code" in
0)
    if printf '%s\n' "$out" | grep -q '差分がないので'; then
        log "差分がない"
    else
        log "公開した"
        notify "公開しました" "$SHORT $SUBJECT"
    fi
    ;;
3)
    log "確認が要る差分なので出さない"
    notify "確認が要る差分なので止めました" "$SHORT ${SUBJECT}。Claude Code に「デプロイして」と頼むと、差分を見て確認を取ります"
    ;;
4)
    log "公開後の確認に ✖ がある"
    notify "公開後の確認に ✖ があります" "$SHORT ${SUBJECT}。戻すなら pnpm xserver:rollback ${backup:-<控えの名前>}"
    ;;
*)
    # 反映の途中で落ちたかもしれない。やり直すたびに控えが増えて古い控えが消えるので、自動ではやり直さない
    log "公開に失敗した（終了コード ${code}）"
    notify "公開に失敗しました" "$SHORT ${SUBJECT}。${backup:+戻すなら pnpm xserver:rollback ${backup}。}詳しくはログを見てください"
    ;;
esac
finish
