"""Engine state: runs, jobs, ordered events and the delivery outbox.

`PostgresStore` writes only the provisional `engine` schema (source/schema/database/engine); `MemoryStore` has the
same behavior for tests and ephemeral use. The engine never writes domain schemas.
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Protocol


class Store(Protocol):
    def create_run(self, name: str, requested_by: str | None) -> dict: ...
    def get_run(self, run_id: str) -> dict | None: ...
    def create_job(self, kind: str, payload: dict, idempotency_key: str | None, requested_by: str | None, run_id: str | None, max_attempts: int) -> tuple[dict, bool]: ...
    def get_job(self, job_id: str) -> dict | None: ...
    def list_jobs(self, status: str | None = None, limit: int = 100) -> list[dict]: ...
    def update_job(self, job_id: str, **fields: Any) -> dict: ...
    def requeue_interrupted(self) -> int: ...
    def queued_jobs(self) -> list[dict]: ...
    def add_event(self, kind: str, job_id: str | None, run_id: str | None, data: dict, targets: list[str]) -> dict: ...
    def events_after(self, seq: int, job_id: str | None = None, limit: int = 500) -> list[dict]: ...
    def due_outbox(self, now: datetime | None = None, limit: int = 20) -> list[dict]: ...
    def mark_delivered(self, outbox_id: str) -> None: ...
    def mark_failed(self, outbox_id: str, error: str, retry_in: float, max_attempts: int) -> None: ...


def _now() -> datetime:
    return datetime.now(timezone.utc)


class MemoryStore:
    def __init__(self) -> None:
        self.runs: dict[str, dict] = {}
        self.jobs: dict[str, dict] = {}
        self.events: list[dict] = []
        self.outbox: dict[str, dict] = {}

    def create_run(self, name, requested_by):
        run = {"id": str(uuid.uuid4()), "name": name, "status": "running", "requested_by": requested_by, "created_at": _now().isoformat(), "finished_at": None}
        self.runs[run["id"]] = run
        return dict(run)

    def get_run(self, run_id):
        return dict(self.runs[run_id]) if run_id in self.runs else None

    def create_job(self, kind, payload, idempotency_key, requested_by, run_id, max_attempts):
        if idempotency_key:
            for job in self.jobs.values():
                if job["idempotency_key"] == idempotency_key:
                    return dict(job), False
        job = {"id": str(uuid.uuid4()), "run_id": run_id, "kind": kind, "input": payload, "idempotency_key": idempotency_key, "status": "queued", "attempts": 0, "max_attempts": max_attempts,
               "requested_by": requested_by, "result": None, "error": None, "created_at": _now().isoformat(), "started_at": None, "finished_at": None}
        self.jobs[job["id"]] = job
        return dict(job), True

    def get_job(self, job_id):
        return dict(self.jobs[job_id]) if job_id in self.jobs else None

    def list_jobs(self, status=None, limit=100):
        jobs = [dict(j) for j in self.jobs.values() if status is None or j["status"] == status]
        return sorted(jobs, key=lambda j: j["created_at"], reverse=True)[:limit]

    def update_job(self, job_id, **fields):
        self.jobs[job_id].update(fields)
        return dict(self.jobs[job_id])

    def requeue_interrupted(self):
        n = 0
        for job in self.jobs.values():
            if job["status"] == "running":
                job["status"], n = "queued", n + 1
        return n

    def queued_jobs(self):
        return sorted((dict(j) for j in self.jobs.values() if j["status"] == "queued"), key=lambda j: j["created_at"])

    def add_event(self, kind, job_id, run_id, data, targets):
        event = {"seq": len(self.events) + 1, "kind": kind, "job_id": job_id, "run_id": run_id, "data": data, "created_at": _now().isoformat()}
        self.events.append(event)
        for target in targets:
            oid = str(uuid.uuid4())
            self.outbox[oid] = {"id": oid, "event_seq": event["seq"], "target": target, "status": "pending", "attempts": 0, "next_attempt_at": _now(), "last_error": None}
        return dict(event)

    def events_after(self, seq, job_id=None, limit=500):
        return [dict(e) for e in self.events if e["seq"] > seq and (job_id is None or e["job_id"] == job_id)][:limit]

    def due_outbox(self, now=None, limit=20):
        now = now or _now()
        rows = [dict(o) for o in self.outbox.values() if o["status"] == "pending" and o["next_attempt_at"] <= now]
        return [{**r, "event": self.events[r["event_seq"] - 1]} for r in sorted(rows, key=lambda r: r["event_seq"])[:limit]]

    def mark_delivered(self, outbox_id):
        self.outbox[outbox_id].update(status="delivered", delivered_at=_now())

    def mark_failed(self, outbox_id, error, retry_in, max_attempts):
        row = self.outbox[outbox_id]
        row["attempts"] += 1
        row["last_error"] = error
        row["status"] = "dead" if row["attempts"] >= max_attempts else "pending"
        row["next_attempt_at"] = _now() + timedelta(seconds=retry_in)


class PostgresStore:
    """Persistent store over the provisional engine schema. `connect` returns a fresh autocommit connection per call."""

    def __init__(self, connect) -> None:
        self._connect = connect

    def _one(self, sql: str, params: tuple = ()):
        with self._connect() as conn:
            return conn.execute(sql, params).fetchone()

    def _all(self, sql: str, params: tuple = ()):
        with self._connect() as conn:
            return conn.execute(sql, params).fetchall()

    @staticmethod
    def _job(row) -> dict | None:
        if row is None:
            return None
        return {**row, "id": str(row["id"]), "run_id": str(row["run_id"]) if row["run_id"] else None, "requested_by": str(row["requested_by"]) if row["requested_by"] else None,
                "created_at": row["created_at"].isoformat(), "started_at": row["started_at"].isoformat() if row["started_at"] else None, "finished_at": row["finished_at"].isoformat() if row["finished_at"] else None}

    def create_run(self, name, requested_by):
        row = self._one("INSERT INTO engine.runs (name, requested_by) VALUES (%s, %s) RETURNING *", (name, requested_by))
        return {**row, "id": str(row["id"]), "requested_by": str(row["requested_by"]) if row["requested_by"] else None, "created_at": row["created_at"].isoformat(), "finished_at": None}

    def get_run(self, run_id):
        row = self._one("SELECT * FROM engine.runs WHERE id = %s", (run_id,))
        return None if row is None else {**row, "id": str(row["id"]), "requested_by": str(row["requested_by"]) if row["requested_by"] else None, "created_at": row["created_at"].isoformat(), "finished_at": row["finished_at"].isoformat() if row["finished_at"] else None}

    def create_job(self, kind, payload, idempotency_key, requested_by, run_id, max_attempts):
        with self._connect() as conn:
            row = conn.execute("INSERT INTO engine.jobs (kind, input, idempotency_key, requested_by, run_id, max_attempts) VALUES (%s, %s::jsonb, %s, %s, %s, %s) ON CONFLICT (idempotency_key) DO NOTHING RETURNING *",
                               (kind, json.dumps(payload), idempotency_key, requested_by, run_id, max_attempts)).fetchone()
            if row:
                return self._job(row), True
            return self._job(conn.execute("SELECT * FROM engine.jobs WHERE idempotency_key = %s", (idempotency_key,)).fetchone()), False

    def get_job(self, job_id):
        return self._job(self._one("SELECT * FROM engine.jobs WHERE id = %s", (job_id,)))

    def list_jobs(self, status=None, limit=100):
        rows = self._all("SELECT * FROM engine.jobs WHERE (%s::text IS NULL OR status = %s) ORDER BY created_at DESC LIMIT %s", (status, status, limit))
        return [self._job(r) for r in rows]

    def update_job(self, job_id, **fields):
        allowed = {"status", "attempts", "result", "error", "started_at", "finished_at"}
        sets, params = [], []
        for key, value in fields.items():
            if key not in allowed:
                raise ValueError(key)
            sets.append(f"{key} = %s" + ("::jsonb" if key == "result" else ""))
            params.append(json.dumps(value) if key == "result" and value is not None else value)
        return self._job(self._one(f"UPDATE engine.jobs SET {', '.join(sets)} WHERE id = %s RETURNING *", (*params, job_id)))

    def requeue_interrupted(self):
        with self._connect() as conn:
            return conn.execute("UPDATE engine.jobs SET status = 'queued' WHERE status = 'running'").rowcount

    def queued_jobs(self):
        return [self._job(r) for r in self._all("SELECT * FROM engine.jobs WHERE status = 'queued' ORDER BY created_at")]

    def add_event(self, kind, job_id, run_id, data, targets):
        with self._connect() as conn:
            row = conn.execute("INSERT INTO engine.events (job_id, run_id, kind, data) VALUES (%s, %s, %s, %s::jsonb) RETURNING *", (job_id, run_id, kind, json.dumps(data))).fetchone()
            for target in targets:
                conn.execute("INSERT INTO engine.outbox (event_seq, target) VALUES (%s, %s) ON CONFLICT DO NOTHING", (row["seq"], target))
        return {"seq": row["seq"], "kind": kind, "job_id": str(row["job_id"]) if row["job_id"] else None, "run_id": str(row["run_id"]) if row["run_id"] else None, "data": data, "created_at": row["created_at"].isoformat()}

    def events_after(self, seq, job_id=None, limit=500):
        rows = self._all("SELECT * FROM engine.events WHERE seq > %s AND (%s::uuid IS NULL OR job_id = %s) ORDER BY seq LIMIT %s", (seq, job_id, job_id, limit))
        return [{"seq": r["seq"], "kind": r["kind"], "job_id": str(r["job_id"]) if r["job_id"] else None, "run_id": str(r["run_id"]) if r["run_id"] else None, "data": r["data"], "created_at": r["created_at"].isoformat()} for r in rows]

    def due_outbox(self, now=None, limit=20):
        rows = self._all("SELECT o.id, o.event_seq, o.target, o.attempts, e.kind, e.job_id, e.run_id, e.data, e.created_at FROM engine.outbox o JOIN engine.events e ON e.seq = o.event_seq WHERE o.status = 'pending' AND o.next_attempt_at <= now() ORDER BY o.event_seq LIMIT %s", (limit,))
        return [{"id": str(r["id"]), "event_seq": r["event_seq"], "target": r["target"], "attempts": r["attempts"],
                 "event": {"seq": r["event_seq"], "kind": r["kind"], "job_id": str(r["job_id"]) if r["job_id"] else None, "run_id": str(r["run_id"]) if r["run_id"] else None, "data": r["data"], "created_at": r["created_at"].isoformat()}} for r in rows]

    def mark_delivered(self, outbox_id):
        self._one("UPDATE engine.outbox SET status = 'delivered', delivered_at = now() WHERE id = %s RETURNING id", (outbox_id,))

    def mark_failed(self, outbox_id, error, retry_in, max_attempts):
        self._one("UPDATE engine.outbox SET attempts = attempts + 1, last_error = %s, status = CASE WHEN attempts + 1 >= %s THEN 'dead' ELSE 'pending' END, next_attempt_at = now() + make_interval(secs => %s) WHERE id = %s RETURNING id", (error, max_attempts, retry_in, outbox_id))
