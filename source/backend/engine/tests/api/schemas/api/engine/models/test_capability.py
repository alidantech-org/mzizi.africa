"""Contract test: Capability keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.engine.models.capability import Capability


def test_fields_match_contract() -> None:
    fields = Capability.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "description": "description",
        "kind": "kind",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Capability.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "kind",
        ]
    )
