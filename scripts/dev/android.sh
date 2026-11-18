#!/usr/bin/env bash
# Runs the Flutter app on the USB-connected Android device. The phone reaches the API on this computer through
# `adb reverse`; pass "prod" to use https://mz-api.alidantech.org instead (no reverse needed).
#   android.sh [dev|prod] [run|install|shot]
set -euo pipefail
cd "$(dirname "$0")/../../source/apps/app"
mode=${1:-dev}; action=${2:-run}
device=$(adb devices | awk 'NR>1 && $2=="device" {print $1; exit}')
[ -n "$device" ] || { echo "no Android device (enable USB debugging)"; exit 1; }
config=config/development.json; [ "$mode" = prod ] && config=config/production.json
[ "$mode" = prod ] || adb -s "$device" reverse tcp:8700 tcp:8700
case "$action" in
  run) flutter run -d "$device" --dart-define-from-file="$config" ;;
  install) flutter build apk --debug --dart-define-from-file="$config" && adb -s "$device" install -r build/app/outputs/flutter-apk/app-debug.apk && adb -s "$device" shell monkey -p org.alidantech.mzizi_app -c android.intent.category.LAUNCHER 1 ;;
  shot) mkdir -p ../../../.dev/shots && adb -s "$device" exec-out screencap -p > "../../../.dev/shots/android-$(date +%H%M%S).png" && ls -t ../../../.dev/shots | head -1 ;;
esac
