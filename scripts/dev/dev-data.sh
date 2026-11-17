#!/usr/bin/env bash
# Builds the development database `mzizi_ui` (or $DEV_DB): creates it if missing, applies the migrations and roles,
# builds the invented dev seed plus the geoBoundaries outlines from .dev/, and loads everything with the engine's
# seed loader. Safe to run again: unchanged rows stay unchanged. Needs the root .env (MZIZI_DB_ADMIN_URL, DATABASE_*).
set -euo pipefail
cd "$(dirname "$0")/../.."
set -a; . ./.env; set +a
DEV_DB="${DEV_DB:-mzizi_ui}"
swap() { echo "$1" | sed -E "s#/[^/?]+(\?.*)?\$#/$DEV_DB#"; }
ADMIN_BASE=$(echo "$MZIZI_DB_ADMIN_URL" | sed -E 's#/[^/?]+(\?.*)?$#/postgres#')
if [ -z "$(psql "$ADMIN_BASE" -Atc "select 1 from pg_database where datname = '$DEV_DB'")" ]; then
  psql "$ADMIN_BASE" -qc "create database $DEV_DB template template_postgis"
  echo "created database $DEV_DB"
fi
export MZIZI_DB_ADMIN_URL=$(swap "$MZIZI_DB_ADMIN_URL")
bun run db migrate
bun run db roles
uv run python scripts/dev/build_dev_seed.py
export DATABASE_WRITE_URL=$(swap "$DATABASE_WRITE_URL") DATABASE_URL=$(swap "$DATABASE_URL")
uv run mzizi-engine seed --root .dev/seed-dev/merged --apply
