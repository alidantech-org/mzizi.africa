#!/usr/bin/env bash
set -euo pipefail
bun install --silent
bunx tsc -p tsconfig.json

bun test ./repository.proof.ts
