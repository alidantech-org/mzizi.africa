"""Ephemeral engine state used by unit tests and explicitly memory-backed local runs.

Persistent job/event/outbox state is owned by the Bun database service and accessed through database_store.py.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta
from typing import Any, Protocol


class Store(Protocol):
    def create_run(self, name: str, requested_by: str | None) -> dict: ...
    def get_run(self, run_id: str) -> dict | None: ...
    def create_job(
        self,
        kind: str,
        payload: dict,
        idempotency_key: str | None,
        requested_by: str | None,
        run_id: str | None,
        max_attempts: int,
    ) -> tuple[dict, bool]: ...
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
    return datetime.now(UTC)


class MemoryStore:
    def __init__(self) -> None:
        self.runs: dict[str, dict] = {}
        self.jobs: dict[str, dict] = {}
        self.events: list[dict] = []
        self.outbox: dict[str, dict] = {}

    def create_run(self, name: str, requested_by: str | None) -> dict:
        run: dict[str, Any] = {
            "id": str(uuid.uuid4()),
            "name": name,
            "status": "running",
            "requested_by": requested_by,
            "created_at": _now().isoformat(),
            "finished_at": None,
        }
        self.runs[run["id"]] = run
        return dict(run)

    def get_run(self, run_id: str) -> dict | None:
        return dict(self.runs[run_id]) if run_id in self.runs else None

    def create_job(
        self,
        kind: str,
        payload: dict,
        idempotency_key: str | None,
        requested_by: str | None,
        run_id: str | None,
        max_attempts: int,
    ) -> tuple[dict, bool]:
        if idempotency_key:
            for job in self.jobs.values():
                if job["idempotency_key"] == idempotency_key:
                    return dict(job), False
        job = {
            "id": str(uuid.uuid4()),
            "run_id": run_id,
            "kind": kind,
            "input": payload,
            "idempotency_key": idempotency_key,
            "status": "queued",
            "attempts": 0,
            "max_attempts": max_attempts,
            "requested_by": requested_by,
            "result": None,
            "error": None,
            "created_at": _now().isoformat(),
            "started_at": None,
            "finished_at": None,
        }
        self.jobs[job["id"]] = job
        return dict(job), True

    def get_job(self, job_id: str) -> dict | None:
        return dict(self.jobs[job_id]) if job_id in self.jobs else None

    def list_jobs(self, status: str | None = None, limit: int = 100) -> list[dict]:
        jobs = [dict(j) for j in self.jobs.values() if status is None or j["status"] == status]
        return sorted(jobs, key=lambda j: j["created_at"], reverse=True)[:limit]

    def update_job(self, job_id: str, **fields: Any) -> dict:
        self.jobs[job_id].update(fields)
        return dict(self.jobs[job_id])

    def requeue_interrupted(self) -> int:
        n = 0
        for job in self.jobs.values():
            if job["status"] == "running":
                job["status"], n = "queued", n + 1
        return n

    def queued_jobs(self) -> list[dict]:
        return sorted((dict(j) for j in self.jobs.values() if j["status"] == "queued"), key=lambda j: j["created_at"])

    def add_event(self, kind: str, job_id: str | None, run_id: str | None, data: dict, targets: list[str]) -> dict:
        event = {
            "seq": len(self.events) + 1,
            "kind": kind,
            "job_id": job_id,
            "run_id": run_id,
            "data": data,
            "created_at": _now().isoformat(),
        }
        self.events.append(event)
        for target in targets:
            oid = str(uuid.uuid4())
            self.outbox[oid] = {
                "id": oid,
                "event_seq": event["seq"],
                "target": target,
                "status": "pending",
                "attempts": 0,
                "next_attempt_at": _now(),
                "last_error": None,
            }
        return dict(event)

    def events_after(self, seq: int, job_id: str | None = None, limit: int = 500) -> list[dict]:
        return [dict(e) for e in self.events if e["seq"] > seq and (job_id is None or e["job_id"] == job_id)][:limit]

    def due_outbox(self, now: datetime | None = None, limit: int = 20) -> list[dict]:
        now = now or _now()
        rows = [dict(o) for o in self.outbox.values() if o["status"] == "pending" and o["next_attempt_at"] <= now]
        return [
            {**r, "event": self.events[r["event_seq"] - 1]} for r in sorted(rows, key=lambda r: r["event_seq"])[:limit]
        ]

    def mark_delivered(self, outbox_id: str) -> None:
        self.outbox[outbox_id].update(status="delivered", delivered_at=_now())

    def mark_failed(self, outbox_id: str, error: str, retry_in: float, max_attempts: int) -> None:
        row = self.outbox[outbox_id]
        row["attempts"] += 1
        row["last_error"] = error
        row["status"] = "dead" if row["attempts"] >= max_attempts else "pending"
        row["next_attempt_at"] = _now() + timedelta(seconds=retry_in)
