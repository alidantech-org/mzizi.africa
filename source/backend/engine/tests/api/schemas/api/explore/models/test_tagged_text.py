"""Contract test: Tagged Text keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.tagged_text import TaggedText


def test_fields_match_contract() -> None:
    fields = TaggedText.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "hits": "hits",
        "text": "text",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TaggedText.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "hits",
            "text",
        ]
    )
