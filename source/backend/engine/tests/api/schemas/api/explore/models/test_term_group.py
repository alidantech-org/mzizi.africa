"""Contract test: Term Group keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.term_group import TermGroup


def test_fields_match_contract() -> None:
    fields = TermGroup.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "domain": "domain",
        "group": "group",
        "label": "label",
        "terms": "terms",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TermGroup.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "domain",
            "group",
            "label",
            "terms",
        ]
    )
