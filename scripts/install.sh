#!/usr/bin/env bash
set -euo pipefail

APP_NAME="OpCut"
APP_PROCESS_NAME="opcut"
BUILT_APP="src-tauri/target/release/bundle/macos/${APP_NAME}.app"
INSTALLED_APP="/Applications/${APP_NAME}.app"

cd "$(dirname "$0")/.."

bun run tauri build --bundles app

if pgrep -x "$APP_PROCESS_NAME" >/dev/null; then
  osascript -e "quit app \"${APP_NAME}\"" >/dev/null 2>&1 || true
  for _ in {1..20}; do
    pgrep -x "$APP_PROCESS_NAME" >/dev/null || break
    sleep 0.25
  done
  pkill -x "$APP_PROCESS_NAME" || true
fi

rm -rf "$INSTALLED_APP"
ditto "$BUILT_APP" "$INSTALLED_APP"
open "$INSTALLED_APP"
