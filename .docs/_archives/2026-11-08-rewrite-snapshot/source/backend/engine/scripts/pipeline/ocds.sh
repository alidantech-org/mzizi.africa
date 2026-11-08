#!/bin/bash
for y in 2025-2026 2024-2025 2023-2024 2022-2023 2021-2022 2020-2021 2019-2020 2018-2019; do
  /tmp/kfr.sh ke/tenders "https://tenders.go.ke/storage/OCDS/$y.json" tenders-ocds
done
echo OCDS-DONE
