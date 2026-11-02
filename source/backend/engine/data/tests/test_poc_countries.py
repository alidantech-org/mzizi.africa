"""Wave 1 proof of concept: the same mapping files and the same pipeline import South Africa, Nigeria and Tanzania.

The point is country neutrality: nothing in the data engine or the database engine is specific to a
country; only reference data (the jurisdiction and its level names) and the mapping variables differ.
"""
import os
import subprocess
from pathlib import Path

import pytest

from mzizi_data.imports import geoboundaries

BACKEND = Path(__file__).resolve().parents[2]
DATA = Path(__file__).resolve().parent / "data" / "geoboundaries"
# jurisdiction, ADM1 count, ADM1 boundaries that pass validation, containment findings
EXPECTED = {"ZAF": ("za", 9, 9, 0), "NGA": ("ng", 37, 37, 0), "TZA": ("tz", 30, 19, 11)}


@pytest.fixture(scope="module")
def database_url():
    from tests.conftest import scratch_database

    return scratch_database("mzizi_test")


@pytest.fixture()
def conn(database_url):
    from mzizi_data.db import connect

    with connect(database_url) as connection:
        yield connection
        connection.rollback()


@pytest.fixture()
def store(conn, tmp_path):
    from mzizi_data.files import LocalDirectoryStore

    return LocalDirectoryStore(conn, tmp_path / "objects")


def cli(url, *args):
    out = subprocess.run(["bun", "src/cli.ts", *args], cwd=BACKEND / "database", env={**os.environ, "DATABASE_URL": url}, capture_output=True, text=True)
    assert out.returncode == 0, out.stderr + out.stdout
    return out.stdout


def promote_run(conn, url, run_id, reviewer, state):
    cli(url, "validate", run_id)
    candidates = conn.execute("SELECT id, status FROM staging.candidates WHERE run_id = %s", (run_id,)).fetchall()
    ready = [c["id"] for c in candidates if c["status"] == "in_review"]
    for cid in ready:
        conn.execute("INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version) VALUES ('staging.candidates', %s, 'approve', %s, 'test reviewer', %s, now(), now(), 1)", (cid, state, reviewer))
    conn.commit()
    cli(url, "apply-review")
    cli(url, "promote", run_id)
    return len(candidates), len(ready)


@pytest.mark.parametrize("iso3", ["ZAF", "NGA", "TZA"])
def test_a_country_imports_through_the_same_pipeline_without_code_changes(conn, store, database_url, iso3):
    jurisdiction, count, passing, findings = EXPECTED[iso3]
    reviewer = conn.execute("INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', %s, 'active', now(), now(), 1) RETURNING id", (f"poc-{iso3}",)).fetchone()["id"]
    conn.execute("INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES (%s, 'reviewer', true, now(), now(), 1)", (reviewer,))
    conn.commit()
    result = geoboundaries.import_directory(conn, store, DATA, iso3)
    adm0, adm1 = result.levels
    assert (adm0.units.created, adm0.boundaries.created, adm1.units.created, adm1.boundaries.created) == (1, 1, count, count)
    licence = conn.execute("SELECT licence FROM source.documents WHERE id = %s", (adm1.document_id,)).fetchone()["licence"]
    assert licence and "not confirmed by a human reviewer" in licence

    outcomes = {}
    for name, run, state in [("unit0", adm0.unit_run, "unverified"), ("boundary0", adm0.boundary_run, "verified"), ("unit1", adm1.unit_run, "unverified"), ("boundary1", adm1.boundary_run, "verified")]:
        outcomes[name] = promote_run(conn, database_url, run, reviewer, state)
    assert outcomes["unit0"] == (1, 1) and outcomes["unit1"] == (count, count)
    # Boundaries are checked against their parent country boundary. A dataset whose ADM1 units do not sit inside its ADM0 is
    # reported and held back, never silently accepted (Tanzania's two sources disagree about water and coast).
    issues = conn.execute("SELECT i.message FROM staging.issues i JOIN staging.candidates c ON c.id = i.candidate_id WHERE c.run_id = %s AND i.rule = 'containment' AND i.severity = 'error'", (adm1.boundary_run,)).fetchall()
    total, ready = outcomes["boundary1"]
    assert (total, ready, len(issues)) == (count, passing, findings)
    assert all("outside its parent unit" in i["message"] for i in issues)
    assert conn.execute("SELECT count(*) AS n FROM geography.boundaries b JOIN geography.units u ON u.id = b.unit_id JOIN reference.jurisdictions j ON j.id = u.jurisdiction_id WHERE j.code = %s AND b.is_current", (jurisdiction,)).fetchone()["n"] == 1 + passing
    promoted = conn.execute("SELECT count(*) AS n FROM geography.units u JOIN reference.jurisdictions j ON j.id = u.jurisdiction_id WHERE j.code = %s AND u.is_current", (jurisdiction,)).fetchone()["n"]
    assert promoted == count + 1


@pytest.mark.parametrize("iso3", ["ZAF", "NGA", "TZA"])
def test_national_population_series_imports_per_country_with_shared_periods(conn, store, database_url, iso3):
    from mzizi_data.imports import worldbank

    jurisdiction = EXPECTED[iso3][0]
    reviewer = conn.execute("SELECT account_id FROM identity.grants g JOIN identity.accounts a ON a.id = g.account_id WHERE a.subject = %s", (f"poc-{iso3}",)).fetchone()["account_id"]
    result = worldbank.import_population(conn, store, DATA.parent / "worldbank" / f"SP.POP.TOTL-{iso3}.json", iso3)
    assert result.stats["observation"].created == 66 and result.stats["dataset"].created == 1
    assert conn.execute("SELECT licence FROM source.documents WHERE id = %s", (result.document_id,)).fetchone()["licence"].startswith("CC BY 4.0")
    for name in worldbank.ORDER:
        promote_run(conn, database_url, result.runs[name], reviewer, "unverified")
    assert conn.execute("SELECT count(*) AS n FROM statistical.observations o JOIN statistical.datasets d ON d.id = o.table_id WHERE d.code = %s", (f"worldbank/SP.POP.TOTL/{iso3}",)).fetchone()["n"] == 66
    assert conn.execute("SELECT count(*) AS n FROM statistical.periods").fetchone()["n"] == 66  # years are shared across countries
    assert conn.execute("SELECT count(*) AS n FROM statistical.indicators WHERE code = 'SP.POP.TOTL'").fetchone()["n"] == 1
    latest = conn.execute("SELECT o.numeric_value FROM statistical.observations o JOIN statistical.periods p ON p.id = o.period_id JOIN statistical.datasets d ON d.id = o.table_id WHERE d.code = %s AND p.code = 'year/2025'", (f"worldbank/SP.POP.TOTL/{iso3}",)).fetchone()
    assert latest and float(latest["numeric_value"]) > 1_000_000
    again = worldbank.import_population(conn, store, DATA.parent / "worldbank" / f"SP.POP.TOTL-{iso3}.json", iso3)
    assert all(st.created == 0 for st in again.stats.values())  # re-import stages nothing new
