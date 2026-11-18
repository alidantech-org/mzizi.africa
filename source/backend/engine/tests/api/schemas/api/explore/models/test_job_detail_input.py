"""Contract test: Job Detail Input keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.job_detail_input import JobDetailInput


def test_fields_match_contract() -> None:
    fields = JobDetailInput.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "job_id": "jobId",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in JobDetailInput.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "job_id",
        ]
    )
