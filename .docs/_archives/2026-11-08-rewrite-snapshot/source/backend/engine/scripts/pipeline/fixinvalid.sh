#!/bin/bash
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa/source/backend/engine/database
set -a; . ../../../../.data/${1:-real}.env; set +a
A=00000000-0000-4000-8000-0000000000a3
DB=$(echo $DATABASE_URL | sed 's#.*/##')
bun src/cli.ts validate | tail -1
for R in $(psql -h localhost -U postgres $DB -Atc "select distinct run_id from staging.candidates where status='in_review'"); do
  bun src/cli.ts review-run $A $R "AI review (mzizi-agent): re-validated after its prerequisites were promoted; validation passed with no errors." | tail -1
  bun src/cli.ts apply-review | tail -1
  bun src/cli.ts promote $R | tail -1
done
