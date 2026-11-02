#!/bin/bash
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
set -a; . .data/dev.env; . .data/env.local; set +a
cd source/backend/engine/data
for id in $(seq 1 290); do
  for n in mobile-allocations mobile-disbursements; do
    .venv/bin/python -m mzizi_data.cli fetch --site ke/ngcdf --url "https://crm.ngcdf.go.ke/api/bootstrap?n=$n&constid=$id" --out ../../../../.data/raw/ngcdf 2>&1 | tail -1 | grep -v "^\.\./" 
  done
done
echo NGCDF-DONE
