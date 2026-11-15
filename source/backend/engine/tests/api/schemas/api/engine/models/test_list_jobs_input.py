"""Contract test: List Jobs Input keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.engine.models.list_jobs_input import ListJobsInput


def test_fields_match_contract() -> None:
    fields = ListJobsInput.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "limit": "limit",
        "status": "status",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ListJobsInput.model_fields.items() if field.is_required()}
    assert required == set([])
