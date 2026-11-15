"""Contract test: Run keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.runtime.models.run import Run


def test_fields_match_contract() -> None:
    fields = Run.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "finished_at": "finishedAt",
        "id": "id",
        "job_ids": "jobIds",
        "kind": "kind",
        "note": "note",
        "started_at": "startedAt",
        "status": "status",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Run.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "id",
            "job_ids",
            "kind",
            "started_at",
            "status",
        ]
    )
