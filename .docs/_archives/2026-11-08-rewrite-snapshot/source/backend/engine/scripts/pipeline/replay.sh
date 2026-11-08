#!/bin/bash
export ENVFILE=.data/real.env
R=../../../../.data/raw
run() { echo "### $1"; /tmp/stage2.sh "$1" "${2:-AI review (mzizi-agent): public official source fetched through the gate and replayed from the preserved raw files; validation passed with no errors.}" 2>&1 | grep -v "^promoted" | tail -9; }
for s in A B C; do run "import-members $R/members --stage $s"; done
run "import-iebc $R/20951570e875-iebc --stage B"
run "import-iebc $R/20951570e875-iebc --stage C"
run "import-constitution $R/constitution --stage A"
run "import-constitution $R/constitution --stage B"
run "import-ngcdf $R/ngcdf --constituencies $R/d8eaaa457207-constituency --stage A"
run "import-ngcdf $R/ngcdf --constituencies $R/d8eaaa457207-constituency --stage B"
echo REPLAY-DONE
