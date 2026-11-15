"""Contract test: Event Window keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.runtime.models.event_window import EventWindow


def test_fields_match_contract() -> None:
    fields = EventWindow.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "after": "after",
        "limit": "limit",
        "run_id": "runId",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in EventWindow.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "run_id",
        ]
    )
