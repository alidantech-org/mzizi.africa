"""The Python engine encodes named persistence operations and holds no PostgreSQL store implementation."""

from __future__ import annotations

from typing import Any

import httpx
import pytest

from mzizi_engine.database_store import DatabaseServiceStore


def test_job_submission_uses_a_named_operation_and_preserves_idempotency_result(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    requests: list[tuple[str, str, dict[str, Any] | None]] = []

    def request(method: str, url: str, *, json: Any = None, headers: Any = None, timeout: Any = None) -> httpx.Response:
        requests.append((method, url, json))
        return httpx.Response(200, json={"job": {"id": "job-id"}, "created": False}, request=httpx.Request(method, url))

    monkeypatch.setattr(httpx, "request", request)
    store = DatabaseServiceStore("http://database.test", "test-token")
    job, created = store.create_job("extraction.csv", {"rows": []}, "same-key", "actor", None, 3)
    assert job == {"id": "job-id"} and not created
    assert requests == [
        (
            "POST",
            "http://database.test/internal/v1/engine/jobs",
            {
                "kind": "extraction.csv",
                "input": {"rows": []},
                "idempotencyKey": "same-key",
                "requestedBy": "actor",
                "runId": None,
                "maxAttempts": 3,
            },
        )
    ]


def test_due_outbox_maps_service_contract_for_the_engine_dispatcher(monkeypatch: pytest.MonkeyPatch) -> None:
    def request(method: str, url: str, *, json: Any = None, headers: Any = None, timeout: Any = None) -> httpx.Response:
        assert method == "GET" and url == "http://database.test/internal/v1/engine/outbox/due?limit=20"
        return httpx.Response(
            200,
            json={
                "entries": [
                    {
                        "id": "outbox-id",
                        "eventSeq": 7,
                        "target": "api",
                        "attempts": 2,
                        "kind": "job.done",
                        "jobId": "job-id",
                        "runId": None,
                        "data": {"ok": True},
                        "createdAt": "2026-11-11T00:00:00Z",
                    }
                ]
            },
            request=httpx.Request(method, url),
        )

    monkeypatch.setattr(httpx, "request", request)
    entry = DatabaseServiceStore("http://database.test", "test-token").due_outbox()[0]
    assert entry["event_seq"] == 7 and entry["event"] == {
        "seq": 7,
        "kind": "job.done",
        "job_id": "job-id",
        "run_id": None,
        "data": {"ok": True},
        "created_at": "2026-11-11T00:00:00Z",
    }
