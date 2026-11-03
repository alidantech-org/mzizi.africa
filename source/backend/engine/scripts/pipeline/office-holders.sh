#!/bin/bash
# Stage, validate, review, apply and promote one stage of the national office holders import.
# usage: office-holders.sh <A|B|C> [envname]   (env file .data/<envname>.env, default p3 = scratch; use `real` under flock /tmp/promote.lock)
R=/home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
ENVN=${2:-p3}
set -a; . $R/.data/$ENVN.env; . $R/.data/env.local; set +a
A=00000000-0000-4000-8000-0000000000a3
cd $R/source/backend/engine/data
.venv/bin/python -m mzizi_data.cli import-office-holders $R/.data/raw/wikipedia --stage "$1" --report $R/.data/reports/office-holders-$ENVN-$1.json --plan $R/.data/reports/office-holders-plan-$ENVN.json | tee /tmp/oh-$ENVN-$1.out
cd $R/source/backend/engine/database
bun src/cli.ts validate | tail -1
for RUN in $(grep -o 'run [0-9a-f-]*' /tmp/oh-$ENVN-$1.out | cut -d' ' -f2); do
  bun src/cli.ts validate $RUN | tail -1
  bun src/cli.ts review-run $A $RUN "AI review (mzizi-agent): national office holders from Wikipedia list pages and the 13th Parliament seat links. Completion-first: soft warnings promote as unverified; no hard check failed. Sources are cited per candidate; unmatched places and parties are left unlinked and reported." | tail -1
  bun src/cli.ts apply-review | tail -1
  bun src/cli.ts promote $RUN | tail -1
done
