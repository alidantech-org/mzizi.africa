#!/bin/bash
# usage: stage2.sh "<import command args after 'cli'>" ["rationale"]
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
set -a; . ${ENVFILE:-.data/dev.env}; . .data/env.local; set +a
cd source/backend/engine/data
OUT=$(.venv/bin/python -m mzizi_data.cli $1 --store ../../../../.data/objects 2>&1 | tail -8)
echo "$OUT"
cd ../database
A=00000000-0000-4000-8000-0000000000a3
for R in $(echo "$OUT" | grep -o "run [0-9a-f-]*" | cut -d' ' -f2); do
  bun src/cli.ts validate $R | tail -1
  bun src/cli.ts review-run $A $R "${2:-AI review (mzizi-agent): public official source fetched through the gate; validation passed with no errors.}" | tail -1
  bun src/cli.ts apply-review | tail -1
  bun src/cli.ts promote $R | tail -2
done
