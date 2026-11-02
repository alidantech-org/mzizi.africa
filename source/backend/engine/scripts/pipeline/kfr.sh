#!/bin/bash
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
set -a; . .data/real.env; . .data/env.local; set +a
cd source/backend/engine/data
.venv/bin/python -m mzizi_data.cli fetch --site "$1" --url "$2" --out ../../../../.data/raw/$3 2>&1 | tail -1
