"""Contract test: Seed Column keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.catalog.models.seed_column import SeedColumn


def test_fields_match_contract() -> None:
    fields = SeedColumn.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "kind": "kind",
        "name": "name",
        "required": "required",
        "target_column": "targetColumn",
        "target_table": "targetTable",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in SeedColumn.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "kind",
            "name",
            "required",
        ]
    )
