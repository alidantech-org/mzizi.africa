"""Contract test: Base Query keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.shared.models.base_query import BaseQuery


def test_fields_match_contract() -> None:
    fields = BaseQuery.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "limit": "limit",
        "order": "order",
        "page": "page",
        "sort": "sort",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in BaseQuery.model_fields.items() if field.is_required()}
    assert required == set([])
