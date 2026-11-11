"""Database proof for the connected foundation, with every example rolled back."""
from __future__ import annotations

import psycopg

from mzizi_database import connect, rewrite_url
from mzizi_database.cli import init
from mzizi_database.loaders.reference import apply_reference_seed, apply_country_seed, COUNTRY_SEED_PATH, SEED_PATH, SEED_ROOT


def test_foundation_seed_is_idempotent_and_wrong_scheme_is_rejected():
    assert init()["reference_seed_added"] == {"schemes": 0, "values": 0, "topics": 0}
    with connect(rewrite_url()) as db:
        scheme = db.execute("SELECT id FROM reference.schemes WHERE code='geo_unit_type'").fetchone()["id"]
        wrong = db.execute("SELECT id FROM reference.values WHERE code='office_category.governor'").fetchone()["id"]
        db.execute("SAVEPOINT wrong_scheme")
        try:
            db.execute("INSERT INTO geography.units(code,name,type_scheme_id,type_value_id,existence_status) VALUES ('test.wrong','Wrong',%s,%s,'established')", (scheme, wrong))
        except psycopg.errors.ForeignKeyViolation:
            db.execute("ROLLBACK TO SAVEPOINT wrong_scheme")
        else:
            raise AssertionError("wrong-scheme value was accepted")
        db.rollback()


def test_parallel_systems_and_containment_cycle():
    init()
    with connect(rewrite_url()) as db:
        scheme = db.execute("SELECT id FROM reference.schemes WHERE code='geo_unit_type'").fetchone()["id"]
        value = db.execute("SELECT id FROM reference.values WHERE code='geo_unit_type.administrative'").fetchone()["id"]
        units = [db.execute("INSERT INTO geography.units(code,name,type_scheme_id,type_value_id,existence_status) VALUES (%s,%s,%s,%s,'established') RETURNING id", (f'test.area_{n}', f'Area {n}', scheme, value)).fetchone()["id"] for n in (1, 2)]
        systems = [db.execute("INSERT INTO geography.relationship_systems(code,name,kind,hierarchical,description) VALUES (%s,%s,%s,true,'test') RETURNING id", (f'test.system_{n}', f'System {n}', kind)).fetchone()["id"] for n, kind in ((1,'administrative'),(2,'electoral'))]
        for system in systems:
            db.execute("INSERT INTO geography.relationships(system_id,parent_unit_id,child_unit_id,kind,claim_status) VALUES (%s,%s,%s,'contains','verified')", (system, units[0], units[1]))
        db.execute("SAVEPOINT cycle")
        try:
            db.execute("INSERT INTO geography.relationships(system_id,parent_unit_id,child_unit_id,kind,claim_status) VALUES (%s,%s,%s,'contains','verified')", (systems[0], units[1], units[0]))
        except psycopg.errors.RaiseException:
            db.execute("ROLLBACK TO SAVEPOINT cycle")
        else:
            raise AssertionError("cycle was accepted")
        db.rollback()


def test_reference_seed_conflict_is_explicit_and_atomic(tmp_path):
    import json
    import pytest

    payload = json.loads((SEED_ROOT / SEED_PATH).read_text())
    payload["values"][0]["label"] = "Changed without review"
    altered = tmp_path / "foundation.json"
    altered.write_text(json.dumps(payload))
    with connect(rewrite_url()) as db:
        with pytest.raises(ValueError, match="reference value conflict"):
            apply_reference_seed(db, altered)
        db.rollback()


def test_official_country_reconciliation_has_55_unique_codes_and_checks_source_hashes(tmp_path):
    import json
    import pytest

    data = json.loads((SEED_ROOT / COUNTRY_SEED_PATH).read_text())
    rows = data["rows"]
    assert len(rows) == len({row["code"] for row in rows}) == 55
    assert [row["recognition_status"] for row in rows].count("disputed") == 1
    data["source_artifacts"][0]["sha256"] = "0" * 64
    altered = tmp_path / "countries.json"
    altered.write_text(json.dumps(data))
    with connect(rewrite_url()) as db:
        with pytest.raises(ValueError, match="source snapshot hash changed"):
            apply_country_seed(db, altered)
        db.rollback()
