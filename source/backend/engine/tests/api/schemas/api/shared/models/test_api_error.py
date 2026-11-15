"""Contract test: Api Error keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.shared.models.api_error import ApiError


def test_fields_match_contract() -> None:
    fields = ApiError.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "code": "code",
        "message": "message",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ApiError.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "message",
        ]
    )
