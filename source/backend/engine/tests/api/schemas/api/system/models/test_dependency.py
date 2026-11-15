"""Contract test: Dependency keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.system.models.dependency import Dependency


def test_fields_match_contract() -> None:
    fields = Dependency.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "detail": "detail",
        "name": "name",
        "state": "state",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Dependency.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "name",
            "state",
        ]
    )
