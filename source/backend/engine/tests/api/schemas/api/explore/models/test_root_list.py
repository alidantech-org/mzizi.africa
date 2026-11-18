"""Contract test: Root List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.root_list import RootList


def test_fields_match_contract() -> None:
    fields = RootList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "roots": "roots",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RootList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "roots",
        ]
    )
