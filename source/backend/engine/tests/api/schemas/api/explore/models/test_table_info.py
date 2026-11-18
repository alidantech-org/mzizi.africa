"""Contract test: Table Info keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.table_info import TableInfo


def test_fields_match_contract() -> None:
    fields = TableInfo.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "columns": "columns",
        "describe": "describe",
        "name": "name",
        "rows": "rows",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TableInfo.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "columns",
            "describe",
            "name",
            "rows",
        ]
    )
