"""Contract test: Column Info keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.column_info import ColumnInfo


def test_fields_match_contract() -> None:
    fields = ColumnInfo.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "name": "name",
        "nullable": "nullable",
        "primary": "primary",
        "type": "type",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ColumnInfo.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "name",
            "nullable",
            "primary",
            "type",
        ]
    )
