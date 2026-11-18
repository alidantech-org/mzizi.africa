#!/usr/bin/env bash
# Runs one part of the development stack against the dev database ($DEV_DB, default mzizi_ui), in the background:
#   stack.sh api       NestJS API on :8700
#   stack.sh engine    Python engine on :8800
#   stack.sh web       public site on :3300
#   stack.sh portal    developer portal on :3400 (forwards to the engine; the service key stays on the server)
#   stack.sh flutter   builds the Flutter web app and serves it on :8090
#   stack.sh stop      stops everything above
#   stack.sh smoke     checks the running stack end to end (scripts/dev/smoke.sh)
# Logs go to .dev/logs/. Each start replaces whatever listens on that port.
set -euo pipefail
cd "$(dirname "$0")/../.."
ROOT=$(pwd)
mkdir -p .dev/logs
set -a; . ./.env; set +a
DEV_DB="${DEV_DB:-mzizi_ui}"
swap() { echo "$1" | sed -E "s#/[^/?]+(\?.*)?\$#/$DEV_DB#"; }
export DATABASE_URL=$(swap "$DATABASE_URL") DATABASE_WRITE_URL=$(swap "$DATABASE_WRITE_URL")
free() { for pid in $(ss -ltnp 2>/dev/null | grep ":$1 " | grep -o 'pid=[0-9]*' | cut -d= -f2); do kill "$pid" || true; done; sleep 1; }
case "${1:-}" in
  api)
    free 8700
    export PORT=8700 CORS_ORIGINS="http://127.0.0.1:3300,http://localhost:3300,http://127.0.0.1:3400,http://localhost:3400,http://127.0.0.1:8090,http://localhost:8090"
    (cd source/backend/api && nohup bun src/main.ts > "$ROOT/.dev/logs/api.log" 2>&1 &) ;;
  engine)
    free 8800
    ENGINE_STATE_FILE="$ROOT/.dev/engine/state.json" nohup uv run mzizi-engine serve > .dev/logs/engine.log 2>&1 & ;;
  web | portal)
    port=3300; app=web
    if [ "$1" = portal ]; then port=3400; app=dev; fi
    free "$port"
    (cd "source/apps/$app" && rm -rf .next && nohup bun --bun next dev -p "$port" > "$ROOT/.dev/logs/$1.log" 2>&1 &) ;;
  flutter)
    # Serve only after the build: `flutter build web` recreates the folder, which would leave an older server on a deleted one.
    free 8090
    (cd source/apps/app && flutter build web --release --dart-define=API_URL=http://127.0.0.1:8700)
    (cd source/apps/app/build/web && nohup python3 -m http.server 8090 --bind 127.0.0.1 > "$ROOT/.dev/logs/flutter.log" 2>&1 &) ;;
  smoke)
    bash scripts/dev/smoke.sh ;;
  stop)
    for port in 8700 8800 3300 3400 8090; do free "$port"; done ;;
  *)
    echo "usage: stack.sh api|engine|web|portal|flutter|smoke|stop"; exit 2 ;;
esac
