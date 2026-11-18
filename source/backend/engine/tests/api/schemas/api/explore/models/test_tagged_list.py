"""Contract test: Tagged List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.tagged_list import TaggedList


def test_fields_match_contract() -> None:
    fields = TaggedList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "items": "items",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TaggedList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "items",
        ]
    )
