"""Contract test: Prepare Result keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.prepare_result import PrepareResult


def test_fields_match_contract() -> None:
    fields = PrepareResult.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "dropped_rows": "droppedRows",
        "header": "header",
        "problems": "problems",
        "rows": "rows",
        "saved": "saved",
        "total_rows": "totalRows",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in PrepareResult.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "dropped_rows",
            "header",
            "problems",
            "rows",
            "saved",
            "total_rows",
        ]
    )
