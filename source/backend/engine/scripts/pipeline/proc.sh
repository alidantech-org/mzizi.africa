#!/bin/bash
export ENVFILE=.data/real.env
P="--pe-dir ../../../../.data/raw/tenders-pe --ocds-dir ../../../../.data/raw/tenders-ocds --years 2025-2026,2026-2027"
for s in A B C D; do
  echo "### procurement $s"
  /tmp/stage2.sh "import-procurement $P --stage $s" "AI review (mzizi-agent): public procurement data from tenders.go.ke fetched through the gate (OCDS files and entity directory); validation passed with no errors; supplier contact points were not staged." 2>&1 | grep -v "^promoted" | tail -14
done
echo PROC-DONE
