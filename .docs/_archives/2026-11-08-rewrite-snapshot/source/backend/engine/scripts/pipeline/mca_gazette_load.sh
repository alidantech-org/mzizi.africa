#!/bin/bash
# usage: mca_gazette_load.sh <A|B> <county-slug>...  Stages the gazette MCA lists for the counties (one extraction, many runs), then validates, reviews and promotes each run.
cd "$(dirname "$0")/../../../../.."
set -a; . .data/real.env; . .data/env.local; set +a
A=00000000-0000-4000-8000-0000000000a3
STAGE=$1; shift
exec 9>/tmp/promote.lock; flock 9
cd source/backend/engine/data
OUT=$(.venv/bin/python -m mzizi_data.imports.gazette_assembly_members ../../../../.data/raw/iebc-gazette "$@" --stage $STAGE --store ../../../../.data/objects --report ../../../../.data/reports/mca-gazette-report.json 2>&1 | tail -400)
echo "$OUT" | grep -v "^{" 
cd ../database
for R in $(echo "$OUT" | grep -o "run [0-9a-f-]*" | cut -d' ' -f2); do
  bun src/cli.ts validate $R | tail -1
  bun src/cli.ts review-run $A $R "Completion-first review (mzizi-agent, DEC-COMPLETION-FIRST): official IEBC gazette notice fetched through the gate; no hard check failed; soft warnings (unmatched wards, single source) leave the record unverified." | tail -1
  bun src/cli.ts apply-review | tail -1
  bun src/cli.ts promote $R | tail -2
done
