#!/bin/bash
for i in 1 2 3 4; do echo "## pass $i"; /tmp/fixinvalid.sh real 2>&1 | tail -4; done
echo FIX3-DONE
