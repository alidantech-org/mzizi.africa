#!/bin/bash
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
set -a; . .data/${PHOTOENV:-dev}.env; . .data/env.local; set +a
cd source/backend/engine/data
.venv/bin/python -m mzizi_data.cli fetch-photos ../../../../.data/raw/members --store ../../../../.data/objects 2>&1 | tail -20
echo PHOTOS-DONE
