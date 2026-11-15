"""Contract test: Job keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.engine.models.job import Job


def test_fields_match_contract() -> None:
    fields = Job.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "attempts": "attempts",
        "error": "error",
        "id": "id",
        "kind": "kind",
        "result": "result",
        "run_id": "runId",
        "status": "status",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Job.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "attempts",
            "id",
            "kind",
            "status",
        ]
    )
