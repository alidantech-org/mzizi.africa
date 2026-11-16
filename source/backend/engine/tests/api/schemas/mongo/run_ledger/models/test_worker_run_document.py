"""Contract test: Worker Run Document keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.run_ledger.models.worker_run_document import WorkerRunDocument


def test_fields_match_contract() -> None:
    fields = WorkerRunDocument.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "approval_json": "approvalJson",
        "attempts": "attempts",
        "available_at": "availableAt",
        "cancel_requested_at": "cancelRequestedAt",
        "failure_type": "failureType",
        "finished_at": "finishedAt",
        "heartbeat_at": "heartbeatAt",
        "lease_expires_at": "leaseExpiresAt",
        "lease_id": "leaseId",
        "logs_expired": "logsExpired",
        "manifest_hash": "manifestHash",
        "release_plan_hash": "releasePlanHash",
        "requested_at": "requestedAt",
        "requested_by": "requestedBy",
        "revision": "revision",
        "run_id": "runId",
        "run_store": "runStore",
        "sealed_at": "sealedAt",
        "spec_hash": "specHash",
        "spec_json": "specJson",
        "stages_completed": "stagesCompleted",
        "started_at": "startedAt",
        "state": "state",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in WorkerRunDocument.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "attempts",
            "requested_at",
            "run_id",
            "spec_hash",
            "spec_json",
            "state",
        ]
    )
