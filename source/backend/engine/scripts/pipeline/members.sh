#!/bin/bash
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
set -a; . .data/dev.env; . .data/env.local; set +a
cd source/backend/engine/data
for n in $(seq 0 35); do
  .venv/bin/python -m mzizi_data.cli fetch --site ke/parliament --url "https://www.parliament.go.ke/the-national-assembly/mps?field_name_value=%20&field_parliament_value=2022&field_employment_history_value=&page=$n" --out ../../../../.data/raw/members 2>&1 | tail -1
done
for n in $(seq 0 6); do
  .venv/bin/python -m mzizi_data.cli fetch --site ke/parliament --url "https://www.parliament.go.ke/the-senate/senators?title=&field_parliament_value=2022&page=$n" --out ../../../../.data/raw/members 2>&1 | tail -1
done
echo DONE
