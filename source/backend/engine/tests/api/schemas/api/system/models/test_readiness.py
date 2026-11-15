"""Contract test: Readiness keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.system.models.readiness import Readiness


def test_fields_match_contract() -> None:
    fields = Readiness.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "dependencies": "dependencies",
        "state": "state",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Readiness.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "dependencies",
            "state",
        ]
    )
