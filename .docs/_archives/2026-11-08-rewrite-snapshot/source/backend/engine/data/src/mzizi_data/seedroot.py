"""Location of the system seed inputs: the repository-root `seed/` directory (override with MZIZI_SEED_ROOT)."""

from __future__ import annotations

import json
import os
from pathlib import Path

# .../source/backend/engine/data/src/mzizi_data/seedroot.py -> repository root is six levels up.
SEED_ROOT = Path(os.environ.get("MZIZI_SEED_ROOT") or Path(__file__).resolve().parents[6] / "seed")

def read_seed_json(path: str):
    """A JSON seed input by its path under seed/, e.g. 'system/policy/never-crawl.json'."""
    return json.loads((SEED_ROOT / path).read_text())


MAPPINGS_ROOT = SEED_ROOT / "system" / "mappings"

# Test fixtures, samples and example payloads live under seed/fixtures, never inside source code.
FIXTURES_ROOT = SEED_ROOT / "fixtures"
