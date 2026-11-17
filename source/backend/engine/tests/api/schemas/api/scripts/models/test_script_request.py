"""Contract test: Script Request keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.scripts.models.script_request import ScriptRequest


def test_fields_match_contract() -> None:
    fields = ScriptRequest.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "inputs": "inputs",
        "language": "language",
        "script": "script",
        "timeout_seconds": "timeoutSeconds",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ScriptRequest.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "language",
            "script",
        ]
    )
