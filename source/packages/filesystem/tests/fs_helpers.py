"""Importable helpers for the filesystem tests (conftest.py holds only fixtures)."""

from __future__ import annotations

import uuid
from pathlib import Path

import yaml

from mzizi_filesystem import plan_seed, run_sync
from mzizi_filesystem.codes import code_segment
from mzizi_filesystem.testing import purge_tree as purge  # noqa: F401 (re-exported for conftest.py)

ISSUER = "https://pytest.mzizi.local"
CLASS = {
    "access": "internal",
    "artifact_role": "seed_input",
    "acquisition_class": "static_curated",
    "preparation": "human_prepared",
    "is_seed": False,
}


def new_account(conn, name="tester") -> str:
    return str(
        conn.execute(
            "INSERT INTO auth.accounts (display_name) VALUES (%s) RETURNING id", (f"{name}-{uuid.uuid4().hex[:6]}",)
        ).fetchone()["id"]
    )


def sub(repo, parent, name, **fields):
    return repo.create_folder(parent["id"], name, fields, None)


class Tree:
    """A synthetic seed root in a temporary directory: `global/` files covered by one manifest entry.

    Sync reads only a root seed manifest, so every test tree is a small, complete seed registry with its own
    logical root and root code. Files written with `write` live under `global/` and are registered under
    `<logical>/global/...`.
    """

    def __init__(self, tmp: Path) -> None:
        self.seed_root = tmp
        token = uuid.uuid4().hex[:8]
        self.logical = f"/pytest-{token}"
        self.code = f"pytest_{token}"
        self.base = f"{self.logical}/global"
        (tmp / "_folder.yaml").write_text("access: internal\nallow_weaker_children: true\n")
        (tmp / "global").mkdir()
        (tmp / "global" / "_folder.yaml").write_text(
            "scope: {kind: global}\nrole: seed_input\nacquisition_class: static_curated\npreparation: human_prepared\n"
        )

    def fc(self, rel: str) -> str:
        """Derived code of the file at a relative path under the tree's `global/` folder."""
        return ".".join([self.code, "global", *[code_segment(p) for p in rel.split("/")]])

    def local(self, rel: str) -> Path:
        return self.seed_root / "global" / rel

    def write(self, rel: str, data: bytes | str) -> None:
        path = self.local(rel)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data if isinstance(data, bytes) else data.encode())

    def manifest(self, retention: str = "preserve_history", **top) -> Path:
        doc = {
            "schema_version": 2,
            "release": "2026-01-01.1",
            "bucket": "mzizi",
            "region": "us-east-1",
            "logical_root": self.logical,
            "root_code": self.code,
            "defaults": {"versioning": "current" if retention == "replace_current" else "versioned", "pin": False},
            "entries": [
                {"id": "t", "glob": "global/**", "loader": "none.unconsumed", "media_type": "text/plain"},
            ],
            **top,
        }
        path = self.seed_root / "manifest.yaml"
        path.write_text(yaml.safe_dump(doc))
        return path

    def plan(self, **options):
        self.manifest(**options)
        return plan_seed(self.seed_root)


def sync(plan, service, apply=True, actor=None):
    return run_sync(plan, service, actor=actor, dry_run=not apply)
