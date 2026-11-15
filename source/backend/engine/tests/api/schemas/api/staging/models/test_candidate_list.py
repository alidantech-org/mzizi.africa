"""Contract test: Candidate List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.staging.models.candidate_list import CandidateList


def test_fields_match_contract() -> None:
    fields = CandidateList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "candidates": "candidates",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in CandidateList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "candidates",
        ]
    )
