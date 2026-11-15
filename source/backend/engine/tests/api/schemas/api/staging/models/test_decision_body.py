"""Contract test: Decision Body keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.staging.models.decision_body import DecisionBody


def test_fields_match_contract() -> None:
    fields = DecisionBody.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "decision": "decision",
        "reason": "reason",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in DecisionBody.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "decision",
        ]
    )
