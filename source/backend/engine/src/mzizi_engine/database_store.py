"""Python engine persistence over named Bun database-service operations.

The engine submits business commands and never receives SQL, table names, or PostgreSQL credentials.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

import httpx


class DatabaseServiceStore:
    def __init__(self, service_url: str, service_token: str) -> None:
        if not service_url or not service_token:
            raise ValueError("DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for persistent engine storage")
        self.base = service_url.rstrip("/") + "/internal/v1/engine"
        self.token = service_token

    def _request(self, path: str, *, method: str = "POST", payload: dict[str, Any] | None = None) -> dict[str, Any]:
        response = httpx.request(
            method,
            f"{self.base}/{path.lstrip('/')}",
            json=payload,
            headers={"authorization": f"Bearer {self.token}"},
            timeout=10.0,
        )
        response.raise_for_status()
        return response.json()

    def create_run(self, name: str, requested_by: str | None) -> dict:
        return self._request("runs", payload={"name": name, "requestedBy": requested_by})["run"]

    def get_run(self, run_id: str) -> dict | None:
        return self._request(f"runs/{run_id}", method="GET")["run"]

    def create_job(self, kind: str, payload: dict, idempotency_key: str | None, requested_by: str | None, run_id: str | None, max_attempts: int) -> tuple[dict, bool]:
        result = self._request("jobs", payload={"kind": kind, "input": payload, "idempotencyKey": idempotency_key,
            "requestedBy": requested_by, "runId": run_id, "maxAttempts": max_attempts})
        return result["job"], bool(result["created"])

    def get_job(self, job_id: str) -> dict | None:
        return self._request(f"jobs/{job_id}", method="GET")["job"]

    def list_jobs(self, status: str | None = None, limit: int = 100) -> list[dict]:
        query = f"?limit={limit}" + (f"&status={status}" if status else "")
        return self._request(f"jobs{query}", method="GET")["jobs"]

    def update_job(self, job_id: str, **fields: Any) -> dict:
        return self._request(f"jobs/{job_id}/update", payload=fields)["job"]

    def requeue_interrupted(self) -> int:
        return int(self._request("jobs/requeue-interrupted")["count"])

    def queued_jobs(self) -> list[dict]:
        return self._request("jobs-queued", method="GET")["jobs"]

    def add_event(self, kind: str, job_id: str | None, run_id: str | None, data: dict, targets: list[str]) -> dict:
        event = self._request("events", payload={"kind": kind, "jobId": job_id, "runId": run_id, "data": data, "targets": targets})["event"]
        event["seq"] = int(event["seq"])
        return event

    def events_after(self, seq: int, job_id: str | None = None, limit: int = 500) -> list[dict]:
        query = f"?after={seq}&limit={limit}" + (f"&jobId={job_id}" if job_id else "")
        events = self._request(f"events{query}", method="GET")["events"]
        for event in events:
            event["seq"] = int(event["seq"])
        return events

    def due_outbox(self, now: datetime | None = None, limit: int = 20) -> list[dict]:
        rows = self._request(f"outbox/due?limit={limit}", method="GET")["entries"]
        return [{"id": row["id"], "event_seq": int(row["eventSeq"]), "target": row["target"], "attempts": row["attempts"],
            "event": {"seq": int(row["eventSeq"]), "kind": row["kind"], "job_id": row["jobId"], "run_id": row["runId"], "data": row["data"], "created_at": row["createdAt"]}}
            for row in rows]

    def mark_delivered(self, outbox_id: str) -> None:
        self._request(f"outbox/{outbox_id}/delivered")

    def mark_failed(self, outbox_id: str, error: str, retry_in: float, max_attempts: int) -> None:
        self._request(f"outbox/{outbox_id}/failed", payload={"error": error, "retryIn": retry_in, "maxAttempts": max_attempts})
