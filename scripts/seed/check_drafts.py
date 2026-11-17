"""Check the drafts in seed/drafts/* against the database schemas, together with the real seed, without loading anything.

Usage: uv run python scripts/seed/check_drafts.py [draft folder name]
Copies seed/data and each draft's data/ into a temporary tree and runs the same check the loader runs.
"""

from __future__ import annotations

import shutil
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "source/packages/manifest/src"))

from mzizi_manifest.features.data.check import check_data  # noqa: E402


def main() -> int:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    drafts = [d for d in sorted((REPO / "seed/drafts").iterdir()) if d.is_dir() and (not only or d.name == only)]
    status = 0
    for draft in drafts:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "seed"
            shutil.copytree(REPO / "seed/data", root / "data")
            shutil.copytree(draft / "data", root / "data", dirs_exist_ok=True)
            result = check_data(root)
        own = [p for p in result.problems if "no artifact row" not in p]
        print(f"{draft.name}: {len(result.rows)} tables, {len(own)} problems")
        for problem in own[:25]:
            print("  ", problem)
        status |= bool(own)
    return status


if __name__ == "__main__":
    raise SystemExit(main())
