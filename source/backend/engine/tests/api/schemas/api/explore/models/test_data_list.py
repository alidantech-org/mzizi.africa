"""Contract test: Data List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.data_list import DataList


def test_fields_match_contract() -> None:
    fields = DataList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "code": "code",
        "columns": "columns",
        "describe": "describe",
        "domain": "domain",
        "sql": "sql",
        "title": "title",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in DataList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "code",
            "columns",
            "describe",
            "domain",
            "sql",
            "title",
        ]
    )
