#!/bin/bash
# usage: kf.sh site url
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
set -a; . .data/dev.env; . .data/env.local; set +a
cd source/backend/engine/data
.venv/bin/python -m mzizi_data.cli fetch --site "$1" --url "$2" --out ../../../../.data/raw 2>&1 | tail -1
