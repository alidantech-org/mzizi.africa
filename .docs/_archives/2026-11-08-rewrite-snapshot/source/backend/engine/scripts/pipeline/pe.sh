#!/bin/bash
cd /home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa
set -a; . .data/real.env; . .data/env.local; set +a
cd source/backend/engine/data
.venv/bin/python /tmp/pages.py ke/tenders https://tenders.go.ke/api/pe/all-pe 189 ../../../../.data/raw/tenders-pe
