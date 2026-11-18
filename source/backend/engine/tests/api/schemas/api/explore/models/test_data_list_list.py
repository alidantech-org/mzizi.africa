"""Contract test: Data List List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.data_list_list import DataListList


def test_fields_match_contract() -> None:
    fields = DataListList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "lists": "lists",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in DataListList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "lists",
        ]
    )
