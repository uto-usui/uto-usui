#!/usr/bin/env bash
# 自動デプロイの LaunchAgent を止めて plist を消す。クローンと状態のディレクトリは残す。
set -euo pipefail

if [[ "$(uname)" != "Darwin" ]]; then
    echo "Error: LaunchAgent は macOS 専用です。" >&2
    exit 1
fi

LABEL="com.uto-usui.auto-deploy"
OUT="$HOME/Library/LaunchAgents/${LABEL}.plist"
BASE="${AUTO_DEPLOY_DIR:-$HOME/.local/state/uto-usui-auto-deploy}"

launchctl bootout "gui/$UID/$LABEL" 2>/dev/null || true

if [ -f "$OUT" ]; then
    rm "$OUT"
    echo "✓ Removed $OUT"
else
    echo "  (plist は入っていませんでした)"
fi

echo "✓ Uninstalled $LABEL"
echo "  クローンと状態は残しています。要らなければ消してください: $BASE"
