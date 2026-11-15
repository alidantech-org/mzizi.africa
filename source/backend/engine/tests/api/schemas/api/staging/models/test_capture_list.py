"""Contract test: Capture List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.staging.models.capture_list import CaptureList


def test_fields_match_contract() -> None:
    fields = CaptureList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "captures": "captures",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in CaptureList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "captures",
        ]
    )
