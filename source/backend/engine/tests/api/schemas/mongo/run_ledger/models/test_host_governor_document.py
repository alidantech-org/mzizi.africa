"""Contract test: Host Governor Document keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.run_ledger.models.host_governor_document import HostGovernorDocument


def test_fields_match_contract() -> None:
    fields = HostGovernorDocument.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "expires_at": "expiresAt",
        "revision": "revision",
        "state_json": "stateJson",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in HostGovernorDocument.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "expires_at",
            "revision",
            "state_json",
        ]
    )
