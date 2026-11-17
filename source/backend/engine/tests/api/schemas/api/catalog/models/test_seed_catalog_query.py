"""Contract test: Seed Catalog Query keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.catalog.models.seed_catalog_query import SeedCatalogQuery


def test_fields_match_contract() -> None:
    fields = SeedCatalogQuery.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "table": "table",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in SeedCatalogQuery.model_fields.items() if field.is_required()}
    assert required == set([])
