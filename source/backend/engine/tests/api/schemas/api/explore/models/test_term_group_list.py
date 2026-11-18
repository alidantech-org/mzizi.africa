"""Contract test: Term Group List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.term_group_list import TermGroupList


def test_fields_match_contract() -> None:
    fields = TermGroupList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "groups": "groups",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TermGroupList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "groups",
        ]
    )
