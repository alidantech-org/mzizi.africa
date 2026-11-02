#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
.venv/bin/datamodel-codegen --input ../../contracts/exchange.schema.json --input-file-type jsonschema --output-model-type pydantic_v2.BaseModel --formatters black --output src/mzizi_data/contracts/exchange_models.py
