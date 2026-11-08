"""Importable helpers for the filesystem tests (conftest.py holds only fixtures)."""
from __future__ import annotations

import uuid

from mzizi_filesystem.testing import purge_tree as purge

ISSUER = "https://pytest.mzizi.local"
CLASS = {"access": "internal", "artifact_role": "seed_input", "acquisition_class": "static_curated", "preparation": "human_prepared", "is_seed": False}


def new_account(conn, name="tester") -> str:
    return str(conn.execute("INSERT INTO auth.accounts (display_name) VALUES (%s) RETURNING id", (f"{name}-{uuid.uuid4().hex[:6]}",)).fetchone()["id"])


def sub(repo, parent, name, **fields):
    return repo.create_folder(parent["id"], name, fields, None)
