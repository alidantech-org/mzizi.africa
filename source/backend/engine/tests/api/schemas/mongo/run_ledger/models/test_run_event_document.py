"""Contract test: Run Event Document keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.run_ledger.models.run_event_document import RunEventDocument


def test_fields_match_contract() -> None:
    fields = RunEventDocument.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "event_id": "eventId",
        "expires_at": "expiresAt",
        "failure_type": "failureType",
        "level": "level",
        "run_id": "runId",
        "stage": "stage",
        "state": "state",
        "time": "time",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RunEventDocument.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "event_id",
            "expires_at",
            "level",
            "run_id",
            "state",
            "time",
        ]
    )
