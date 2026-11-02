"""Reads and writes the website registry: sites, domains, structures and their file bundles.

Structure bytes live in `filesystem` (one folder per version); `website` rows hold metadata and
pointers. A version is immutable; a change is a new version.
"""
from __future__ import annotations

import json
from datetime import date
from typing import Any

import psycopg
from psycopg.types.json import Jsonb  # noqa: F401

from .files import LocalDirectoryStore
from .structure import bundle as bundle_mod
from .structure.bundle import Bundle

STRUCTURE_ROOT = "/website-structures"


def site_by_code(conn: psycopg.Connection, code: str) -> dict:
    row = conn.execute("SELECT id::text AS id, code, name, status, jurisdiction_id::text AS jurisdiction_id FROM website.sites WHERE code = %s", (code,)).fetchone()
    if not row:
        raise LookupError(f"unknown site {code}")
    return row


def domains_in_order(conn: psycopg.Connection, site_id: str, on: date | None = None) -> list[dict]:
    """Domains valid on the date, primary first, then alias and mirror; legacy and redirect hosts are history only."""
    on = on or date.today()
    return conn.execute(
        """SELECT id::text AS id, hostname, scheme, role FROM website.domains
            WHERE site_id = %s AND role IN ('primary','alias','mirror') AND valid_from <= %s AND (valid_to IS NULL OR valid_to >= %s)
            ORDER BY CASE role WHEN 'primary' THEN 0 WHEN 'alias' THEN 1 ELSE 2 END, valid_from DESC""",
        (site_id, on, on),
    ).fetchall()


def subject_vars(conn: psycopg.Connection, site_id: str) -> dict[str, str]:
    rows = conn.execute("SELECT target_kind, target_id::text AS target_id FROM website.subjects WHERE site_id = %s AND relation IN ('serves','about','operated_by')", (site_id,)).fetchall()
    out: dict[str, str] = {}
    for row in rows:
        out.setdefault(f"subject.{row['target_kind'].split('.')[0]}", row["target_id"])
    return out


def ensure_structure(conn: psycopg.Connection, owner_kind: str, owner_id: str, purpose: str = "main") -> str:
    row = conn.execute("SELECT id FROM website.structures WHERE owner_kind = %s AND owner_id = %s AND purpose = %s", (owner_kind, owner_id, purpose)).fetchone()
    if row:
        return str(row["id"])
    return str(conn.execute("INSERT INTO website.structures (owner_kind, owner_id, purpose, status, created_at, updated_at, version) VALUES (%s, %s, %s, 'active', now(), now(), 1) RETURNING id", (owner_kind, owner_id, purpose)).fetchone()["id"])


def _role(path: str) -> str:
    if path == "manifest.yml":
        return "manifest"
    head = path.split("/")[0]
    return {"modules": "module", "mappings": "mapping", "examples": "example"}.get(head, "tags" if path == "tags.yml" else "notes")


def publish_bundle(conn: psycopg.Connection, store: LocalDirectoryStore, bundle: Bundle, owner_kind: str, owner_id: str, code: str, report: dict, purpose: str = "main", method_id: str | None = None, created_by: str | None = None, status: str = "validated") -> str:
    """Stores the bundle's files and records a new immutable version. Publishing never activates collection."""
    if status not in ("draft", "validated", "rejected"):
        raise ValueError("publish creates draft, validated or rejected versions; activation is a separate step")
    structure_id = ensure_structure(conn, owner_kind, owner_id, purpose)
    number = conn.execute("SELECT coalesce(max(number), 0) + 1 AS n FROM website.structure_versions WHERE structure_id = %s", (structure_id,)).fetchone()["n"]
    folder = f"{STRUCTURE_ROOT}/{code.replace('/', '-')}/{number}"
    folder_id = store.ensure_folder(folder)
    previous = conn.execute("SELECT id FROM website.structure_versions WHERE structure_id = %s ORDER BY number DESC LIMIT 1", (structure_id,)).fetchone()
    version_id = str(
        conn.execute(
            """INSERT INTO website.structure_versions (structure_id, number, status, folder_id, manifest_hash, schema_version, method_id, created_by, validation_report, supersedes_id, created_at, updated_at, version)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now(), now(), 1) RETURNING id""",
            (structure_id, number, status, folder_id, bundle.manifest_hash(), bundle.manifest.get("schema", "mzizi.site/v1"), method_id, created_by, json.dumps(report), previous["id"] if previous else None),
        ).fetchone()["id"]
    )
    for path, text in sorted(bundle.files.items()):
        sub, _, name = path.rpartition("/")
        ref = store.put(text.encode("utf-8"), name, f"{folder}/{sub}" if sub else folder, mime_type="text/markdown" if path.endswith(".md") else "application/yaml")
        conn.execute(
            "INSERT INTO website.structure_files (version_id, path, role, file_version_id, created_at, updated_at, version) VALUES (%s, %s, %s, %s, now(), now(), 1)",
            (version_id, path, _role(path), ref.version_id),
        )
    return version_id


def activate_version(conn: psycopg.Connection, version_id: str) -> None:
    """Makes a validated version the structure's active one; the previous active version becomes superseded."""
    row = conn.execute("SELECT structure_id, status FROM website.structure_versions WHERE id = %s", (version_id,)).fetchone()
    if not row or row["status"] not in ("validated", "active"):
        raise ValueError("only a validated version can be activated")
    conn.execute("UPDATE website.structure_versions SET status = 'superseded', updated_at = now() WHERE structure_id = %s AND status = 'active' AND id <> %s", (row["structure_id"], version_id))
    conn.execute("UPDATE website.structure_versions SET status = 'active', updated_at = now() WHERE id = %s", (version_id,))
    conn.execute("UPDATE website.structures SET current_version_id = %s, updated_at = now() WHERE id = %s", (version_id, row["structure_id"]))


def demote_version(conn: psycopg.Connection, version_id: str, reason: str) -> None:
    conn.execute("UPDATE website.structure_versions SET status = 'rejected', notes_summary = %s, updated_at = now() WHERE id = %s", (reason[:900], version_id))
    conn.execute("UPDATE website.structures SET current_version_id = NULL, updated_at = now() WHERE current_version_id = %s", (version_id,))


def load_bundle(conn: psycopg.Connection, store: LocalDirectoryStore, version_id: str) -> Bundle:
    rows = conn.execute("SELECT path, file_version_id::text AS fv FROM website.structure_files WHERE version_id = %s ORDER BY path", (version_id,)).fetchall()
    if not rows:
        raise LookupError(f"structure version {version_id} has no files")
    loaded = bundle_mod.from_files(version_id, {r["path"]: store.get(r["fv"]).decode("utf-8") for r in rows})
    recorded = conn.execute("SELECT manifest_hash FROM website.structure_versions WHERE id = %s", (version_id,)).fetchone()["manifest_hash"]
    if loaded.manifest_hash() != recorded:
        raise IOError(f"structure version {version_id} does not match its recorded manifest hash")
    return loaded


def active_version(conn: psycopg.Connection, owner_kind: str, owner_id: str, purpose: str = "main") -> str | None:
    row = conn.execute("SELECT current_version_id::text AS v FROM website.structures WHERE owner_kind = %s AND owner_id = %s AND purpose = %s", (owner_kind, owner_id, purpose)).fetchone()
    return row["v"] if row else None
