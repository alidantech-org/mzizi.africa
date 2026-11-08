"""Locations the manifest package reads: the seed root, the schema root and fixtures.

The repository root is found from this file (an editable workspace install keeps it in the checkout);
set MZIZI_REPO_ROOT, MZIZI_SEED_ROOT or MZIZI_SCHEMA_ROOT to override.
"""
from __future__ import annotations

import os
from pathlib import Path

# .../source/packages/manifest/src/mzizi_manifest/paths.py -> repository root is five levels up.
REPO_ROOT = Path(os.environ.get("MZIZI_REPO_ROOT") or Path(__file__).resolve().parents[5])
SEED_ROOT = Path(os.environ.get("MZIZI_SEED_ROOT") or REPO_ROOT / "seed")
SCHEMA_ROOT = Path(os.environ.get("MZIZI_SCHEMA_ROOT") or REPO_ROOT / "source" / "schema")
