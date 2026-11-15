"""Contract test: Paginated Response keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.shared.models.paginated_response import PaginatedResponse


def test_fields_match_contract() -> None:
    fields = PaginatedResponse.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "meta": "meta",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in PaginatedResponse.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "meta",
        ]
    )
