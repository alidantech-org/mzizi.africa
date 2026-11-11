"""PostgresStore against the provisional engine schema in mzizi_new (skipped when the database is not initialised)."""

from __future__ import annotations

import uuid

import pytest

from mzizi_engine.store import PostgresStore

psycopg = pytest.importorskip("psycopg")


@pytest.fixture
def store():
    from mzizi_database import connect, rewrite_url

    try:
        with connect(rewrite_url()) as conn:
            if conn.execute("SELECT to_regclass('engine.jobs') AS t").fetchone()["t"] is None:
                pytest.skip("engine schema not initialised; run `uv run mzizi-db init`")
    except psycopg.OperationalError:
        pytest.skip("rewrite database unavailable")
    created: list[str] = []
    s = PostgresStore(lambda: connect(rewrite_url(), autocommit=True))
    s.created = created
    yield s
    with connect(rewrite_url(), autocommit=True) as conn:
        conn.execute(
            "DELETE FROM engine.outbox WHERE event_seq IN (SELECT seq FROM engine.events WHERE job_id = ANY(%s::uuid[]))",
            (created,),
        )
        conn.execute("DELETE FROM engine.events WHERE job_id = ANY(%s::uuid[])", (created,))
        conn.execute("DELETE FROM engine.jobs WHERE id = ANY(%s::uuid[])", (created,))


def test_jobs_are_idempotent_events_are_ordered_and_the_outbox_retries(store):
    key = f"test-{uuid.uuid4()}"
    job, created = store.create_job("extraction.csv", {"a": 1}, key, None, None, 3)
    store.created.append(job["id"])
    again, created_again = store.create_job("extraction.csv", {"a": 1}, key, None, None, 3)
    assert created and not created_again and again["id"] == job["id"]
    first = store.add_event("job.queued", job["id"], None, {"k": 1}, ["nestjs"])
    second = store.add_event("job.started", job["id"], None, {}, ["nestjs"])
    assert second["seq"] > first["seq"]
    assert [e["kind"] for e in store.events_after(first["seq"] - 1, job["id"])] == ["job.queued", "job.started"]
    due = [o for o in store.due_outbox(limit=100) if o["event"]["job_id"] == job["id"]]
    assert len(due) == 2
    store.mark_failed(due[0]["id"], "HTTP 500", 0, 3)
    store.mark_delivered(due[1]["id"])
    remaining = [o for o in store.due_outbox(limit=100) if o["event"]["job_id"] == job["id"]]
    assert [o["id"] for o in remaining] == [due[0]["id"]] and remaining[0]["attempts"] == 1


def test_job_updates_and_interrupted_jobs_requeue(store):
    job, _ = store.create_job("extraction.json", {}, None, None, None, 2)
    store.created.append(job["id"])
    updated = store.update_job(job["id"], status="running", attempts=1)
    assert updated["status"] == "running"
    assert store.requeue_interrupted() >= 1 and store.get_job(job["id"])["status"] == "queued"
    done = store.update_job(job["id"], status="succeeded", result={"ok": True})
    assert done["result"] == {"ok": True} and store.get_job(job["id"])["status"] == "succeeded"
