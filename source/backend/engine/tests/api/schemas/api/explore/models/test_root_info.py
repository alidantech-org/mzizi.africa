"""Contract test: Root Info keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.root_info import RootInfo


def test_fields_match_contract() -> None:
    fields = RootInfo.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "name": "name",
        "path": "path",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RootInfo.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "name",
            "path",
        ]
    )
