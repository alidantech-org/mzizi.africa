"""Contract test: Seed Catalog keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.catalog.models.seed_catalog import SeedCatalog


def test_fields_match_contract() -> None:
    fields = SeedCatalog.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "sha256": "sha256",
        "tables": "tables",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in SeedCatalog.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "sha256",
            "tables",
        ]
    )
