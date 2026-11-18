"""Contract test: Term Hit keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.term_hit import TermHit


def test_fields_match_contract() -> None:
    fields = TermHit.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "domain": "domain",
        "group": "group",
        "surface": "surface",
        "term": "term",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TermHit.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "domain",
            "group",
            "surface",
            "term",
        ]
    )
