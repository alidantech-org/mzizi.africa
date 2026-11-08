"""Location of the system seed inputs: the repository-root `seed/` directory (override with MZIZI_SEED_ROOT)."""

from __future__ import annotations

import os
from pathlib import Path

# .../source/backend/engine/data/src/mzizi_data/seedroot.py -> repository root is six levels up.
SEED_ROOT = Path(os.environ.get("MZIZI_SEED_ROOT") or Path(__file__).resolve().parents[6] / "seed")

MAPPINGS_ROOT = SEED_ROOT / "system" / "mappings"
