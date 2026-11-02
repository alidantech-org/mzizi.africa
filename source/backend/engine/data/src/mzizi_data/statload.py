"""Shared staging helpers for the statistics loaders (geography measurements, census, electoral, derived values).

A loader preserves a source artifact (the KNBS volume, the IEBC file, a computed measurement report), records the
extracted rows as an immutable ExtractionResult, and stages one candidate per row. Rows are already payload dictionaries;
a reference to another record is written as `ref(kind, field=value)` and resolved when the candidate is validated and promoted.
Review and promotion go through the database engine CLI, so a decision always names an account and a rationale.
"""
from __future__ import annotations

import json
import os
import subprocess
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import psycopg

from . import candidates, pipeline, register
from .files import FileVersionRef, LocalDirectoryStore

AGENT_ACCOUNT = "00000000-0000-4000-8000-0000000000a3"
NAMESPACE = uuid.UUID("5d2c1b52-0f6e-4f3a-9a53-6d2a9a3f8e11")
REPO = Path(__file__).resolve().parents[6]


def ref(kind: str, **where: Any) -> dict:
    """A reference by natural key; a value may itself be a ref."""
    return {"$ref": {"kind": kind, "where": where}}


def stable_id(*parts: Any) -> str:
    """A deterministic uuid so a row that other rows point at (an observation and its dimension rows) has a known id before promotion."""
    return str(uuid.uuid5(NAMESPACE, "|".join(str(p) for p in parts)))


@dataclass
class Source:
    document_id: str
    capture_id: str
    ref: FileVersionRef


@dataclass
class Group:
    """One target kind staged in one run."""

    name: str
    target_kind: str
    key: list[str]
    rows: list[dict]
    method: str = "extracted"


@dataclass
class Staged:
    runs: dict[str, str] = field(default_factory=dict)
    stats: dict[str, candidates.CandidateStats] = field(default_factory=dict)


def publisher(conn: psycopg.Connection, code: str, name: str, website_url: str | None = None, kind: str = "institution") -> str:
    return register.ensure_publisher(conn, code, name, kind=kind, website_url=website_url)


def jurisdiction_id(conn: psycopg.Connection, code: str = "ke") -> str:
    return str(conn.execute("SELECT id FROM reference.jurisdictions WHERE code = %s", (code,)).fetchone()["id"])


def preserve(conn: psycopg.Connection, store: LocalDirectoryStore, data: bytes, filename: str, publisher_id: str, title: str, url: str | None, licence: str, citation: str, tool: str, mime_type: str, kind: str = "dataset", jurisdiction: str = "ke", **spec_extra: Any) -> Source:
    spec = register.DocumentSpec(publisher_id, title, kind, url=url, licence=licence, citation=citation, jurisdiction_id=jurisdiction_id(conn, jurisdiction), **spec_extra)
    document_id, capture_id, version = pipeline.ingest(conn, store, data, filename, spec, url=url, tool=tool, mime_type=mime_type)
    conn.commit()
    return Source(document_id, capture_id, version)


def stage(conn: psycopg.Connection, store: LocalDirectoryStore, source: Source, extractor: str, extractor_version: str, dataset: str, groups: list[Group], diagnostics: list[dict] | None = None, profile: str | None = None) -> Staged:
    """Stores the extracted rows as one result and stages each group as its own run (promotion order is the order of groups)."""
    now = datetime.now(timezone.utc)
    segments, index = [], []
    for g in groups:
        for n, row in enumerate(g.rows):
            key = f"{g.name}-{n}"
            index.append((g, key, row))
            segments.append({"key": key, "kind": "record", "locator": json.dumps({"group": g.name, "row": n}), "content": json.dumps(row, sort_keys=True, default=str), "confidence": 1})
    result, _stored = pipeline.store_result(store, source.ref, extractor, extractor_version, profile, "succeeded", segments, diagnostics or [{"level": "info", "code": "rows", "message": f"{len(segments)} rows"}], now, now, source.capture_id, source.document_id, {"dataset": dataset, "extractor": extractor})
    staged = Staged()
    for g in groups:
        mapping = {"mapping": g.name, "target_kind": g.target_kind, "key": g.key, "fields": {name: {"from": name} for name in sorted({k for row in g.rows for k in row})}}
        run_id = candidates.create_run(conn, f"{dataset}/{g.name}", "v1", source.capture_id, str(result.id))
        records = [(key, row) for grp, key, row in index if grp is g]
        stats = candidates.add_candidates(conn, run_id, mapping, records, str(result.id), [], [], method=g.method)
        candidates.finish_run(conn, run_id)
        staged.runs[g.name], staged.stats[g.name] = run_id, stats
    conn.commit()
    return staged


def promote_run(run_id: str, rationale: str, env_file: str = ".data/real.env", actor: str = AGENT_ACCOUNT) -> dict:
    """validate -> review (agent account with rationale) -> apply -> promote, through the database engine CLI. Returns the last lines of each step."""
    env = dict(os.environ)
    base = f"set -a; . {REPO / env_file}; . {REPO / '.data/env.local'}; set +a; cd {REPO / 'source/backend/engine/database'}; "
    out: dict[str, str] = {}
    for name, cmd in (("validate", f"bun src/cli.ts validate {run_id}"),):
        out[name] = _sh(base + cmd, env)
    out["review"] = _sh(base + f"bun src/cli.ts review-run {actor} {run_id} {json.dumps(rationale)}", env)
    out["apply"] = _sh(base + "bun src/cli.ts apply-review", env)
    out["promote"] = _sh(base + f"bun src/cli.ts promote {run_id}", env)
    return out


def _sh(command: str, env: dict) -> str:
    done = subprocess.run(["bash", "-c", command], capture_output=True, text=True, env=env)
    return (done.stdout + done.stderr).strip()[-600:]
