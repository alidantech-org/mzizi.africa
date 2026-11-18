"""Contract test: Listing keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.listing import Listing


def test_fields_match_contract() -> None:
    fields = Listing.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "entries": "entries",
        "parent": "parent",
        "path": "path",
        "root": "root",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Listing.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "entries",
            "path",
            "root",
        ]
    )
