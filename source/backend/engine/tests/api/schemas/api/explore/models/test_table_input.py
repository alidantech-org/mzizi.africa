"""Contract test: Table Input keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.table_input import TableInput


def test_fields_match_contract() -> None:
    fields = TableInput.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "direction": "direction",
        "domain": "domain",
        "limit": "limit",
        "offset": "offset",
        "order": "order",
        "q": "q",
        "table": "table",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in TableInput.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "domain",
            "table",
        ]
    )
