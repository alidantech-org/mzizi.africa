from __future__ import annotations

from pathlib import Path

import pytest
import yaml

FULL = "role: seed_input\nacquisition_class: static_curated\npreparation: human_prepared\n"


def build_seed_root(tmp_path: Path, files: dict[str, str], entries: list[dict], release: str = "r1", extra_folders: dict[str, str] | None = None) -> Path:
    """A synthetic seed root: global scope, internal access, one manifest entry per given dict (defaults filled in)."""
    folders = {"_folder.yaml": "access: internal\nallow_weaker_children: true\n", "global/_folder.yaml": "scope: {kind: global}\n" + FULL, **(extra_folders or {})}
    for path, text in {**folders, **files}.items():
        target = tmp_path / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")
    full = [{"media_type": "text/csv", "loader": "auth.baseline", "target": "t", "database_target_state": "test_only", "depends_on": [], "consumers": [], "sync_policy": "x", **e} for e in entries]
    (tmp_path / "manifest.yaml").write_text(yaml.safe_dump({"schema_version": 1, "release": release, "bucket": "mzizi", "region": "us-east-1", "entries": full}), encoding="utf-8")
    return tmp_path


@pytest.fixture
def seed_root(tmp_path):
    return build_seed_root(tmp_path, {"global/a.csv": "code\nx\n", "global/b.csv": "code\ny\n"}, [{"id": "g.a", "path": "global/a.csv"}, {"id": "g.b", "path": "global/b.csv"}])
