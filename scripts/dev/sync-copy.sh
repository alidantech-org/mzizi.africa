#!/usr/bin/env bash
# Loads the interface copy (every wording declared in source/sdk/copy, English and Swahili) into the dev database.
# Much faster than the full dev seed: it builds the dev seed tree, then loads only the copy file and what it refers to.
# Run it after adding or changing a wording, then reload the page.
set -euo pipefail
cd "$(dirname "$0")/../.."
uv run python scripts/dev/build_dev_seed.py > .dev/logs/build-seed.log 2>&1
M=.dev/seed-dev/merged
R=.dev/seed-copy-only
rm -rf "$R"
mkdir -p "$R/data/global/source"
ln -s "$(pwd)/$M/columns" "$R/columns"
cp -rL "$M/data/global/reference" "$R/data/global/reference"
for f in "$M"/data/global/source/seed.*.csv; do cp -L "$f" "$R/data/global/source/"; done
set -a; . ./.env; set +a
swap() { echo "$1" | sed -E "s#/[^/?]+(\?.*)?\$#/${DEV_DB:-mzizi_ui}#"; }
export DATABASE_WRITE_URL=$(swap "$DATABASE_WRITE_URL") DATABASE_URL=$(swap "$DATABASE_URL")
uv run mzizi-engine seed --root "$R" --apply 2>&1 | grep -E "^error|reference.copy|^total"
