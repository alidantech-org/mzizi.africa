#!/usr/bin/env bash
# Link the local Dryv checkout's TypeScript author and compiler into node_modules, as the reference
# backend does. Set DRYV_HOME to the checkout at the ref pinned in ../dryv.yaml.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
dryv_home="${DRYV_HOME:-$HOME/Projects/personal/alidantech-org/codepot/dryv}"
mkdir -p "$here/node_modules/@dryvcode"
for pkg in author compiler; do
  rm -rf "$here/node_modules/@dryvcode/$pkg"
  ln -s "$dryv_home/source/plugins/authoring/typescript/$pkg" "$here/node_modules/@dryvcode/$pkg"
done
