"""Contract test: Capture Window keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.staging.models.capture_window import CaptureWindow


def test_fields_match_contract() -> None:
    fields = CaptureWindow.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "limit": "limit",
        "source_id": "sourceId",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in CaptureWindow.model_fields.items() if field.is_required()}
    assert required == set([])
