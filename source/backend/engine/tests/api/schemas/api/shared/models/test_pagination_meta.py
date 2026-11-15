"""Contract test: Pagination Meta keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.shared.models.pagination_meta import PaginationMeta


def test_fields_match_contract() -> None:
    fields = PaginationMeta.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "limit": "limit",
        "page": "page",
        "total": "total",
        "total_pages": "totalPages",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in PaginationMeta.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "limit",
            "page",
            "total",
            "total_pages",
        ]
    )
