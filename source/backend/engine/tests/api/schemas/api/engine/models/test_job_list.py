"""Contract test: Job List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.engine.models.job_list import JobList


def test_fields_match_contract() -> None:
    fields = JobList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "jobs": "jobs",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in JobList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "jobs",
        ]
    )
