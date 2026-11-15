"""Contract test: Health keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.system.models.health import Health


def test_fields_match_contract() -> None:
    fields = Health.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "state": "state",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Health.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "state",
        ]
    )
