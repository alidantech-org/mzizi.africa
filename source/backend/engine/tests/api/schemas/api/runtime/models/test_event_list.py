"""Contract test: Event List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.runtime.models.event_list import EventList


def test_fields_match_contract() -> None:
    fields = EventList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "events": "events",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in EventList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "events",
        ]
    )
