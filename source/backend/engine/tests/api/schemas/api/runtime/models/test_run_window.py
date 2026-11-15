"""Contract test: Run Window keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.runtime.models.run_window import RunWindow


def test_fields_match_contract() -> None:
    fields = RunWindow.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "limit": "limit",
        "status": "status",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RunWindow.model_fields.items() if field.is_required()}
    assert required == set([])
