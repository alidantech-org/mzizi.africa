import json
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator

from mzizi_data import jobs, pipeline, register

SCHEMA = json.loads((Path(__file__).resolve().parents[3] / "contracts" / "exchange.schema.json").read_text())
SQUARE = [[36, -1], [37, -1], [37, -2], [36, -2], [36, -1]]
GEOJSON = json.dumps({"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {"shapeName": "Nairobi"}, "geometry": {"type": "Polygon", "coordinates": [SQUARE]}}]}).encode()


def spec(conn):
    publisher = register.ensure_publisher(conn, "test/publisher", "Test publisher")
    return register.DocumentSpec(publisher, "Test county boundaries", "dataset", url="https://data.example.org/ke.geojson", licence="CC-BY-4.0")


def run_all(conn, store):
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    ran = []
    while (job := jobs.run_once(conn, handlers, worker="test")):
        ran.append(job)
    return ran


def test_ingest_extract_produces_a_schema_valid_immutable_result(conn, store):
    document_id, capture_id, ref = pipeline.ingest(conn, store, GEOJSON, "ke.geojson", spec(conn), tool="test")
    job_id, created = pipeline.enqueue_extraction(conn, ref.version_id, "geojson", "admin-boundaries", capture_id)
    assert created
    conn.commit()
    assert [j.id for j in run_all(conn, store)] == [job_id]
    row = conn.execute("SELECT status, result, result_file_version_id FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    assert row["status"] == "succeeded" and row["result"]["segments"] == 1
    body = json.loads(store.get(str(row["result_file_version_id"])))
    Draft202012Validator({**SCHEMA, "$ref": "#/$defs/ExtractionResult"}, format_checker=Draft202012Validator.FORMAT_CHECKER).validate(body)
    assert body["artifact"]["contentHash"] == ref.content_hash
    assert pipeline.load_result(store, str(row["result_file_version_id"])).extractor == "geojson"


def test_reingesting_identical_bytes_adds_a_capture_and_version_but_no_object(conn, store):
    s = spec(conn)
    _, first_capture, first = pipeline.ingest(conn, store, GEOJSON, "dup.geojson", s, tool="test")
    _, second_capture, second = pipeline.ingest(conn, store, GEOJSON, "dup.geojson", s, tool="test")
    assert first_capture != second_capture
    assert first.object_id == second.object_id and first.version_id != second.version_id and second.version_number == first.version_number + 1
    count = conn.execute("SELECT count(*) AS n FROM filesystem.objects WHERE content_hash = %s", (first.content_hash,)).fetchone()["n"]
    assert count == 1


def test_enqueue_is_idempotent_and_rerun_creates_a_new_result_without_touching_the_old_one(conn, store):
    _, capture_id, ref = pipeline.ingest(conn, store, GEOJSON, "rerun.geojson", spec(conn), tool="test")
    first_id, created = pipeline.enqueue_extraction(conn, ref.version_id, "geojson", None, capture_id)
    again_id, created_again = pipeline.enqueue_extraction(conn, ref.version_id, "geojson", None, capture_id)
    assert created and not created_again and first_id == again_id
    conn.commit()
    run_all(conn, store)
    rerun_id, created_rerun = pipeline.enqueue_extraction(conn, ref.version_id, "geojson", None, capture_id, rerun=True)
    assert created_rerun and rerun_id != first_id
    conn.commit()
    run_all(conn, store)
    rows = conn.execute("SELECT generation, result->>'resultId' AS result_id, result_file_version_id FROM engine.jobs WHERE id IN (%s, %s) ORDER BY generation", (first_id, rerun_id)).fetchall()
    assert [r["generation"] for r in rows] == [1, 2] and rows[0]["result_id"] != rows[1]["result_id"]
    assert store.get(str(rows[0]["result_file_version_id"])) != store.get(str(rows[1]["result_file_version_id"]))


def test_unparseable_input_fails_without_retrying(conn, store):
    _, capture_id, ref = pipeline.ingest(conn, store, b"{broken", "bad.geojson", spec(conn), tool="test")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "geojson", None, capture_id)
    conn.commit()
    run_all(conn, store)
    row = conn.execute("SELECT status, attempts FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    assert row["status"] == "failed" and row["attempts"] == 1


def test_transient_errors_are_retried_with_backoff_then_fail(conn):
    job_id, _ = jobs.enqueue(conn, "flaky", {"n": 1}, max_attempts=2)
    conn.commit()

    def boom(job):
        raise RuntimeError("temporary")

    jobs.run_once(conn, {"flaky": boom}, worker="test")
    row = conn.execute("SELECT status, attempts, run_after > now() AS delayed FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    assert row["status"] == "pending" and row["attempts"] == 1 and row["delayed"]
    conn.execute("UPDATE engine.jobs SET run_after = now() WHERE id = %s", (job_id,))
    conn.commit()
    jobs.run_once(conn, {"flaky": boom}, worker="test")
    assert conn.execute("SELECT status FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()["status"] == "failed"


def test_two_workers_never_claim_the_same_job(conn, database_url):
    from mzizi_data.db import connect

    job_id, _ = jobs.enqueue(conn, "once", {"n": 2})
    conn.commit()
    with connect(database_url) as other:
        first = jobs.claim(conn, "a")
        second = jobs.claim(other, "b")
        assert first is not None and first.id == job_id and second is None
        conn.rollback()
        other.rollback()


def test_missing_classification_is_a_clear_error(conn):
    with pytest.raises(LookupError):
        register.ensure_publisher(conn, "x/y", "Y", kind="no-such-kind")
