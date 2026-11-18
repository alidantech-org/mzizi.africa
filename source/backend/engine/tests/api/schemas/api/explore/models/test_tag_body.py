"""Contract test: Tag Body keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.tag_body import TagBody


def test_fields_match_contract() -> None:
    fields = TagBody.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "domain": "domain",
        "texts": "texts",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TagBody.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "texts",
        ]
    )
