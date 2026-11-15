"""Contract test: Base Entity keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.shared.models.base_entity import BaseEntity


def test_fields_match_contract() -> None:
    fields = BaseEntity.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "created_at": "createdAt",
        "id": "id",
        "updated_at": "updatedAt",
        "version": "version",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in BaseEntity.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "created_at",
            "id",
            "updated_at",
            "version",
        ]
    )
