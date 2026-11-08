"""Agent batch tooling for site structures: submit, list, activate, demote.

Agents author bundles in batches; each submission is validated and stored as an immutable version
with its authoring method (agent, model, inputs) recorded. Publishing never activates collection:
activation is a separate, explicit step and the collection gate still decides whether any request
may be made. A bundle that fails validation is stored as a rejected version with its report, so the
attempt and its reasons stay on record.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

import psycopg

from . import registry, register
from .files import LocalDirectoryStore
from .structure import bundle as bundle_mod
from .structure.validate import validate


@dataclass
class Submission:
    directory: str
    site_code: str
    status: str  # validated | rejected | skipped
    version_id: str | None = None
    number: int | None = None
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def authoring_method(conn: psycopg.Connection, agent: str, model: str | None, version: str = "1") -> str:
    """The method row for an agent authoring run (kind ai_assisted when a model is named, curated otherwise)."""
    kind = "ai_assisted" if model else "curated"
    return register.ensure_method(conn, kind, "site structure authoring", agent, version, model)


def owner_of(conn: psycopg.Connection, bundle: bundle_mod.Bundle, jurisdiction_code: str | None = None) -> tuple[str, str, str]:
    """(owner kind, owner id, code) for a bundle: a site bundle needs a registered site; a family bundle a registered family."""
    manifest = bundle.manifest
    if manifest.get("kind") == "family":
        code = manifest["family"]
        row = conn.execute("SELECT id::text AS id FROM website.families WHERE code = %s", (code,)).fetchone()
        if not row:
            raise LookupError(f"family {code} is not registered")
        return "family", row["id"], code
    code = manifest["site"]
    row = conn.execute("SELECT id::text AS id FROM website.sites WHERE code = %s", (code,)).fetchone()
    if not row:
        raise LookupError(f"site {code} is not registered; register the site (and its domains) first")
    return "site", row["id"], code


def submit(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, agent: str, model: str | None = None, family_dir: str | Path | None = None, created_by: str | None = None) -> Submission:
    bundle = bundle_mod.load(directory)
    family = bundle_mod.load(family_dir) if family_dir else None
    report = validate(bundle, family)
    if bundle.errors or not bundle.manifest:
        return Submission(str(directory), "?", "rejected", errors=report.errors or ["no manifest"])
    try:
        kind, owner_id, code = owner_of(conn, bundle)
    except LookupError as error:
        return Submission(str(directory), bundle.manifest.get("site") or bundle.manifest.get("family") or "?", "skipped", errors=[str(error)])
    status = "validated" if report.ok else "rejected"
    version_id = registry.publish_bundle(conn, store, bundle, kind, owner_id, code, report.to_json(), method_id=authoring_method(conn, agent, model), created_by=created_by, status=status)
    number = conn.execute("SELECT number FROM website.structure_versions WHERE id = %s", (version_id,)).fetchone()["number"]
    return Submission(str(directory), code, status, version_id, number, report.errors, report.warnings)


def submit_batch(conn: psycopg.Connection, store: LocalDirectoryStore, root: str | Path, agent: str, model: str | None = None) -> list[Submission]:
    """Submits every subdirectory of root that holds a manifest.yml; commits each submission on its own."""
    results = []
    for directory in sorted(p for p in Path(root).iterdir() if (p / "manifest.yml").exists()):
        results.append(submit(conn, store, directory, agent, model))
        conn.commit()
    return results


def list_versions(conn: psycopg.Connection, code: str) -> list[dict]:
    return conn.execute(
        """SELECT v.id::text AS id, v.number, v.status, v.manifest_hash, v.created_at, s.status AS structure_status, (s.current_version_id = v.id) AS is_current
             FROM website.structure_versions v JOIN website.structures s ON s.id = v.structure_id
             LEFT JOIN website.sites st ON s.owner_kind = 'site' AND st.id = s.owner_id
             LEFT JOIN website.families f ON s.owner_kind = 'family' AND f.id = s.owner_id
            WHERE st.code = %s OR f.code = %s ORDER BY v.number""",
        (code, code),
    ).fetchall()


def activate(conn: psycopg.Connection, version_id: str) -> None:
    registry.activate_version(conn, version_id)


def demote(conn: psycopg.Connection, version_id: str, reason: str) -> None:
    registry.demote_version(conn, version_id, reason)
