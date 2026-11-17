"""Contract test: Seed Table keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.catalog.models.seed_table import SeedTable


def test_fields_match_contract() -> None:
    fields = SeedTable.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "columns": "columns",
        "name": "name",
        "natural_key": "naturalKey",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in SeedTable.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "columns",
            "name",
            "natural_key",
        ]
    )
