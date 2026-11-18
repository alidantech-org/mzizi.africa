"""Contract test: Data List Page keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.data_list_page import DataListPage


def test_fields_match_contract() -> None:
    fields = DataListPage.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "definition": "definition",
        "limit": "limit",
        "offset": "offset",
        "rows": "rows",
        "total": "total",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in DataListPage.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "definition",
            "limit",
            "offset",
            "rows",
            "total",
        ]
    )
