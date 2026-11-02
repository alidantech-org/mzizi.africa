"""Vertical slice: real geoBoundaries data for Kenya through every layer.

register and preserve -> extract -> stage candidates -> validate -> review -> promote (database
engine) -> serve (API use cases). The reviewer is a test account created here; in real use a human
reviewer records the decisions through the API.
"""
import json
import os
import subprocess
from pathlib import Path

import pytest

from mzizi_data.imports import geoboundaries

BACKEND = Path(__file__).resolve().parents[2]  # source/backend/engine
DATA = Path(__file__).resolve().parent / "data" / "geoboundaries"


def cli(url, *args):
    out = subprocess.run(["bun", "src/cli.ts", *args], cwd=BACKEND / "database", env={**os.environ, "DATABASE_URL": url}, capture_output=True, text=True)
    assert out.returncode == 0, out.stderr + out.stdout
    return out.stdout


def approve_run(conn, url, run_id, reviewer, state):
    """Validate a run, record an approving decision for each candidate in review, then apply and promote."""
    cli(url, "validate", run_id)
    ids = [r["id"] for r in conn.execute("SELECT id FROM staging.candidates WHERE run_id = %s AND status = 'in_review'", (run_id,)).fetchall()]
    for candidate in ids:
        conn.execute("INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version) VALUES ('staging.candidates', %s, 'approve', %s, 'test reviewer', %s, now(), now(), 1)", (candidate, state, reviewer))
    conn.commit()
    cli(url, "apply-review")
    return len(ids), cli(url, "promote", run_id)


def test_kenya_counties_from_open_data_to_the_boundary_endpoint(conn, store, database_url):
    reviewer = conn.execute("INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', 'slice-reviewer', 'active', now(), now(), 1) RETURNING id").fetchone()["id"]
    conn.execute("INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES (%s, 'reviewer', true, now(), now(), 1)", (reviewer,))
    conn.commit()

    # 1-4: preserve, register, extract, stage
    result = geoboundaries.import_directory(conn, store, DATA)
    adm0, adm1 = result.levels
    assert (adm0.units.created, adm0.boundaries.created, adm1.units.created, adm1.boundaries.created) == (1, 1, 47, 47)
    assert conn.execute("SELECT licence FROM source.documents WHERE id = %s", (adm1.document_id,)).fetchone()["licence"].startswith("Public Domain")

    # 5-9: validate, review, promote, in dependency order (units before their boundaries, country before counties)
    for run, state in [(adm0.unit_run, "unverified"), (adm0.boundary_run, "verified"), (adm1.unit_run, "unverified"), (adm1.boundary_run, "verified")]:
        count, output = approve_run(conn, database_url, run, reviewer, state)
        assert count > 0 and f"{count} promoted, 0 deferred" in output, output

    assert conn.execute("SELECT count(*) AS n FROM geography.units WHERE is_current").fetchone()["n"] == 48
    assert conn.execute("SELECT count(*) AS n FROM geography.boundaries WHERE is_current").fetchone()["n"] == 48
    assert conn.execute("SELECT count(*) AS n FROM geography.boundary_shapes WHERE is_valid").fetchone()["n"] == 48
    assert conn.execute("SELECT count(*) AS n FROM source.verifications v JOIN geography.boundaries b ON b.id = v.target_id WHERE v.is_current AND v.state = 'verified'").fetchone()["n"] == 48
    parent = conn.execute("SELECT count(*) AS n FROM geography.units c JOIN geography.units p ON p.id = c.parent_id WHERE p.code = 'ke'").fetchone()["n"]
    assert parent == 47
    assert "integrity ok" in cli(database_url, "integrity")

    # idempotent re-run: the same files again stage nothing new and promote nothing twice
    again = geoboundaries.import_directory(conn, store, DATA)
    assert [(l.units.created, l.boundaries.created, l.units.unchanged, l.boundaries.unchanged) for l in again.levels] == [(0, 0, 1, 1), (0, 0, 47, 47)]
    assert conn.execute("SELECT count(*) AS n FROM geography.boundaries").fetchone()["n"] == 48
    # raw evidence kept: every import preserved its bytes as a new capture, but the identical bytes are one object
    assert conn.execute("SELECT count(*) AS n FROM source.captures c JOIN source.documents d ON d.id = c.document_id WHERE d.title LIKE 'geoBoundaries%%'").fetchone()["n"] == 4
    assert conn.execute("SELECT count(DISTINCT content_hash) AS n FROM filesystem.objects o JOIN filesystem.versions v ON v.object_id = o.id JOIN filesystem.files f ON f.id = v.file_id WHERE f.name LIKE 'geoBoundaries-%%'").fetchone()["n"] == 2

    # 10: the API reads it back
    out = subprocess.run(["bunx", "vitest", "run", "--root", "src", "neutral/boundary-slice"], cwd=BACKEND.parent / "api", env={**os.environ, "SLICE_DATABASE_URL": database_url}, capture_output=True, text=True)
    assert out.returncode == 0, out.stdout[-3000:] + out.stderr[-2000:]
