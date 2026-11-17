"""The seed loader against a scratch PostgreSQL database: run again and again, edit a little, add a row, add a column."""

from __future__ import annotations

import os
import uuid
from collections.abc import Iterator
from pathlib import Path

import psycopg
import pytest

from mzizi_engine.persistence.postgres.connection import Connection, connect
from mzizi_engine.persistence.postgres.seed_loader import load_seed
from mzizi_manifest.features.data.datasets import write_datasets
from mzizi_manifest.shared.paths import REPO_ROOT

ADMIN_URL = os.environ.get("MZIZI_DB_ADMIN_URL", "postgres://postgres@127.0.0.1:5432/postgres")
MIGRATIONS = sorted((REPO_ROOT / "source" / "backend" / "database" / "migrations").glob("0*.sql"))


def _admin_url(database: str) -> str:
    head, _, _ = ADMIN_URL.rpartition("/")
    return f"{head}/{database}"


@pytest.fixture
def conn() -> Iterator[Connection]:
    name = f"mzizi_test_loader_{uuid.uuid4().hex[:8]}"
    try:
        admin = psycopg.connect(_admin_url("postgres"), autocommit=True)
    except psycopg.OperationalError:
        pytest.skip("no PostgreSQL with PostGIS on the admin URL")
    admin.execute(f'CREATE DATABASE "{name}"')
    try:
        with psycopg.connect(_admin_url(name), autocommit=True) as setup:
            for release in MIGRATIONS:
                setup.execute(release.read_text(encoding="utf-8"))
        with connect(_admin_url(name)) as connection:
            yield connection
    finally:
        admin.execute(f'DROP DATABASE IF EXISTS "{name}" WITH (FORCE)')
        admin.close()


SCHEMES = (
    "code,title,owner_snapshot\ngeo.feature.kind,Feature kinds,test\nsrc.product.kind,Product kinds,test\n"
    "src.relationship.kind,Relationship kinds,test\nsrc.locator.kind,Locator kinds,test\n"
)
VALUES = (
    "code,scheme_code,label\n"
    "geo.feature.kind.country,geo.feature.kind,Country\n"
    "src.product.kind.dataset,src.product.kind,Dataset\n"
    "src.relationship.kind.prepared-from,src.relationship.kind,Prepared from\n"
    "src.locator.kind.csv-line,src.locator.kind,CSV line\n"
)


def make_seed(tmp_path: Path, features: str = "code,feature_type_code\nke,geo.feature.kind.country\n") -> Path:
    root = tmp_path / "seed"
    files = {
        "global/reference/schemes.csv": SCHEMES,
        "global/reference/values.csv": VALUES,
        "ke/geo/features.csv": features,
    }
    for name, text in files.items():
        path = root / "data" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    write_datasets(root)
    return root


def counts(report) -> dict[str, tuple[int, int, int]]:
    return {t.table: (t.inserted, t.updated, t.unchanged) for t in report.tables}


def test_a_dry_run_changes_nothing_and_an_apply_then_a_repeat_changes_nothing(conn: Connection, tmp_path: Path) -> None:
    root = make_seed(tmp_path)
    dry = load_seed(conn, root, apply=False)
    assert dry.ok and dry.changed
    assert conn.execute("SELECT count(*) AS n FROM geography.features").fetchone()["n"] == 0

    first = load_seed(conn, root, apply=True)
    assert first.ok and counts(first)["geography.features"] == (1, 0, 0)
    assert conn.execute("SELECT count(*) AS n FROM source.relationships WHERE subject_table = 'geography.features'").fetchone()["n"] == 1
    assert conn.execute("SELECT count(*) AS n FROM source.citations").fetchone()["n"] > 0

    again = load_seed(conn, root, apply=True)
    assert not again.changed
    assert counts(again)["geography.features"] == (0, 0, 1)
    row = conn.execute("SELECT version FROM geography.features").fetchone()
    assert row["version"] == 1


def test_a_small_edit_updates_only_that_row_and_bumps_its_version(conn: Connection, tmp_path: Path) -> None:
    root = make_seed(tmp_path)
    load_seed(conn, root, apply=True)
    (root / "data/ke/geo/features.csv").write_text(
        "code,feature_type_code,valid_from\nke,geo.feature.kind.country,2000-01-01\n", encoding="utf-8"
    )
    write_datasets(root)
    report = load_seed(conn, root, apply=True)
    assert report.ok
    assert counts(report)["geography.features"] == (0, 1, 0)
    row = conn.execute("SELECT version, valid_from FROM geography.features").fetchone()
    assert row["version"] == 2 and str(row["valid_from"]) == "2000-01-01"
    assert counts(report)["reference.values"] == (0, 0, 4)
    # The edited CSV is a new artifact; provenance written for the earlier bytes still points at the earlier artifact.
    artifacts = conn.execute("SELECT count(*) AS n FROM source.artifacts WHERE code LIKE '%ke.geo.features~%'").fetchone()
    assert artifacts["n"] == 2


def test_a_row_that_left_the_seed_is_reported_and_never_deleted(conn: Connection, tmp_path: Path) -> None:
    root = make_seed(tmp_path, "code,feature_type_code\nke,geo.feature.kind.country\ntz,geo.feature.kind.country\n")
    load_seed(conn, root, apply=True)
    (root / "data/ke/geo/features.csv").write_text(
        "code,feature_type_code\nke,geo.feature.kind.country\n", encoding="utf-8"
    )
    write_datasets(root)
    report = load_seed(conn, root, apply=True)
    feature_report = next(t for t in report.tables if t.table == "geography.features")
    assert feature_report.absent == 1
    assert conn.execute("SELECT count(*) AS n FROM geography.features").fetchone()["n"] == 2


def test_a_value_of_the_wrong_scheme_is_refused_by_the_database(conn: Connection, tmp_path: Path) -> None:
    root = make_seed(tmp_path, "code,feature_type_code\nke,src.product.kind.dataset\n")
    with pytest.raises(psycopg.errors.CheckViolation):
        load_seed(conn, root, apply=True)


def test_a_problem_in_a_csv_stops_the_run_before_any_write(conn: Connection, tmp_path: Path) -> None:
    root = make_seed(tmp_path, "code,feature_type_code\nKE!,geo.feature.kind.country\n")
    report = load_seed(conn, root, apply=True)
    assert not report.ok and not report.tables
    assert conn.execute("SELECT count(*) AS n FROM reference.schemes").fetchone()["n"] == 0


def test_a_subject_must_exist_and_a_referenced_subject_cannot_be_deleted(conn: Connection, tmp_path: Path) -> None:
    root = make_seed(tmp_path)
    load_seed(conn, root, apply=True)
    with pytest.raises(psycopg.errors.ForeignKeyViolation, match="does not exist"):
        conn.execute(
            "INSERT INTO source.relationships (id, created_at, updated_at, version, code, kind_id, subject_table, subject_id, "
            "input_artifact_id) SELECT gen_random_uuid(), now(), now(), 1, 'src.rel.bad', kind_id, 'geography.features', "
            "gen_random_uuid(), input_artifact_id FROM source.relationships LIMIT 1"
        )
    conn.rollback()
    with pytest.raises(psycopg.errors.ForeignKeyViolation, match="does not exist"):  # an unknown table is no subject
        conn.execute(
            "INSERT INTO source.relationships (id, created_at, updated_at, version, code, kind_id, subject_table, subject_id, "
            "input_artifact_id) SELECT gen_random_uuid(), now(), now(), 1, 'src.rel.bad', kind_id, 'not.a_table', "
            "gen_random_uuid(), input_artifact_id FROM source.relationships LIMIT 1"
        )
    conn.rollback()
    with pytest.raises(psycopg.errors.ForeignKeyViolation, match="still referenced"):
        conn.execute("DELETE FROM geography.features")
    conn.rollback()
