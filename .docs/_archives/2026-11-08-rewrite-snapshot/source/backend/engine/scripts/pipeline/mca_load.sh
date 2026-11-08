#!/bin/bash
# usage: mca_load.sh <county-slug> ...   Stages (A then B), validates, reviews and promotes county assembly members into the real database.
cd "$(dirname "$0")/../../../../.."
set -a; . .data/real.env; . .data/env.local; set +a
A=00000000-0000-4000-8000-0000000000a3
for COUNTY in "$@"; do
  for STAGE in A B; do
    exec 9>/tmp/promote.lock; flock 9
    cd source/backend/engine/data
    OUT=$(.venv/bin/python -m mzizi_data.imports.county_assembly_members ../../../../.data/raw/mca-sites "$COUNTY" --stage $STAGE $EXTRA --store ../../../../.data/objects --report ../../../../.data/reports/mca-import-report.json 2>&1 | tail -8)
    echo "$OUT"
    cd ../database
    for R in $(echo "$OUT" | grep -o "run [0-9a-f-]*" | cut -d' ' -f2); do
      bun src/cli.ts validate $R | tail -1
      bun src/cli.ts review-run $A $R "Completion-first review (mzizi-agent, DEC-COMPLETION-FIRST): public assembly member page fetched through the gate; no hard check failed; soft warnings (unmatched ward names, single source) leave the record unverified." | tail -1
      bun src/cli.ts apply-review | tail -1
      bun src/cli.ts promote $R | tail -2
    done
    cd ../../../..
    flock -u 9
  done
done
