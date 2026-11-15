"""Contract test: Candidate Window keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.staging.models.candidate_window import CandidateWindow


def test_fields_match_contract() -> None:
    fields = CandidateWindow.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "kind": "kind",
        "limit": "limit",
        "status": "status",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in CandidateWindow.model_fields.items() if field.is_required()}
    assert required == set([])
