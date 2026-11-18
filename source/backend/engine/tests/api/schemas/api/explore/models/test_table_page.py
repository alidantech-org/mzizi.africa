"""Contract test: Table Page keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.table_page import TablePage


def test_fields_match_contract() -> None:
    fields = TablePage.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "columns": "columns",
        "direction": "direction",
        "domain": "domain",
        "limit": "limit",
        "offset": "offset",
        "order": "order",
        "rows": "rows",
        "search": "search",
        "table": "table",
        "total": "total",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TablePage.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "columns",
            "direction",
            "domain",
            "limit",
            "offset",
            "order",
            "rows",
            "search",
            "table",
            "total",
        ]
    )
