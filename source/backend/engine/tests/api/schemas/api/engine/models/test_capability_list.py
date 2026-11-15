"""Contract test: Capability List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.engine.models.capability_list import CapabilityList


def test_fields_match_contract() -> None:
    fields = CapabilityList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "capabilities": "capabilities",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in CapabilityList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "capabilities",
        ]
    )
