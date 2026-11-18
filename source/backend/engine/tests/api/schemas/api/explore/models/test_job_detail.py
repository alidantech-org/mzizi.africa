"""Contract test: Job Detail keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.job_detail import JobDetail


def test_fields_match_contract() -> None:
    fields = JobDetail.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "events": "events",
        "job": "job",
        "output": "output",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in JobDetail.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "events",
            "job",
        ]
    )
