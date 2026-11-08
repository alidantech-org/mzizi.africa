import uuid
from decimal import Decimal

import pytest

from mzizi_data import derived, quality


def test_division_without_a_denominator_stores_nothing():
    assert derived.divide(100, 0) is None
    assert derived.divide(100, None) is None
    assert derived.divide(None, 5) is None
    assert derived.divide(100, 8) == Decimal("12.5")


def test_registry_names_inputs_and_versions():
    f = derived.FORMULAS["density"]
    assert f.computation == "density v1" and f.vintage == "derived/density@1"
    assert "geography.area_km2" in f.inputs


def test_inputs_for_formulas_without_loaded_data_fail_loudly(conn):
    with pytest.raises(ValueError):
        derived.inputs(conn, "vote-share")


def test_parent_that_does_not_equal_its_children_is_a_finding():
    found = quality.parent_equals_children("Meru", 1545714, {"a": 800000.0, "b": 744866.0}, "population.county-vs-constituencies")
    assert found and found[0].severity == "warning" and found[0].figures["parent"] == 1545714
    assert quality.parent_equals_children("Meru", 100, {"a": 60.0, "b": 40.0}, "r") == []


def test_children_without_figures_are_reported_as_missing_not_as_a_mismatch():
    found = quality.parent_equals_children("Kilifi", 100, {"a": 100.0, "b": None}, "r")
    assert found[0].rule == "r.missing" and found[0].figures["missing_children"] == ["b"]


def test_cross_source_difference_above_tolerance():
    assert quality.cross_source("ke/bomet", "KNBS", 2530.9, "shape", 2818.7, "area")  # 10 percent
    assert not quality.cross_source("ke/nairobi", "KNBS", 703.9, "shape", 704.2, "area")


def test_plausibility_and_missing_siblings():
    assert quality.plausibility("u", "density.bound", 90_000, quality.MAX_DENSITY, "density")
    assert not quality.plausibility("u", "density.bound", 6247, quality.MAX_DENSITY, "density")
    assert quality.missing_siblings("county", {"a": 1.0, "b": None}, "siblings")[0].figures == {"missing": ["b"]}
    assert not quality.missing_siblings("county", {"a": None, "b": None}, "siblings")


def test_same_finding_has_the_same_fingerprint():
    a = quality.cross_source("u", "A", 1.0, "B", 2.0, "x")[0]
    b = quality.cross_source("u", "A", 1.0, "B", 2.0, "x")[0]
    assert a.fingerprint == b.fingerprint


def test_findings_are_stored_once_and_decided_by_a_named_account(conn):
    finding = quality.cross_source("ke/bomet", "KNBS", 2530.9, "shape", 2818.7, "area")[0]
    finding.target_kind = "statistical.observations"
    assert quality.store(conn, [finding])["new"] == 1
    assert quality.store(conn, [finding])["new"] == 0
    fid = conn.execute("SELECT id FROM engine.quality_findings WHERE fingerprint = %s", (finding.fingerprint,)).fetchone()["id"]
    nobody = conn.execute("INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', %s, 'active', now(), now(), 1) RETURNING id", (str(uuid.uuid4()),)).fetchone()["id"]
    with pytest.raises(PermissionError):
        quality.decide(conn, str(fid), str(nobody), "dispute", "no standing")
    with pytest.raises(ValueError):
        quality.decide(conn, str(fid), str(nobody), "dispute", " ")
    reviewer = conn.execute("INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', %s, 'active', now(), now(), 1) RETURNING id", (str(uuid.uuid4()),)).fetchone()["id"]
    conn.execute("INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES (%s, 'reviewer', true, now(), now(), 1)", (reviewer,))
    assert quality.decide(conn, str(fid), str(reviewer), "accept", "shape is clipped to the county") == "accepted"
    row = conn.execute("SELECT status, decided_by FROM engine.quality_findings WHERE id = %s", (fid,)).fetchone()
    assert row["status"] == "accepted" and row["decided_by"] == reviewer
