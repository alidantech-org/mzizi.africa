"""Contract test: Column Plan keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.column_plan import ColumnPlan


def test_fields_match_contract() -> None:
    fields = ColumnPlan.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "clean": "clean",
        "keep": "keep",
        "name": "name",
        "source": "source",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ColumnPlan.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "source",
        ]
    )
