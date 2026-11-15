"""Contract test: Job Event keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.runtime.models.job_event import JobEvent


def test_fields_match_contract() -> None:
    fields = JobEvent.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "at": "at",
        "data": "data",
        "id": "id",
        "job_id": "jobId",
        "message": "message",
        "run_id": "runId",
        "sequence": "sequence",
        "type": "type",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in JobEvent.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "at",
            "id",
            "job_id",
            "sequence",
            "type",
        ]
    )
