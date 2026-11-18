"""Contract test: Get File Input keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.get_file_input import GetFileInput


def test_fields_match_contract() -> None:
    fields = GetFileInput.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "limit": "limit",
        "offset": "offset",
        "path": "path",
        "root": "root",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in GetFileInput.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "path",
            "root",
        ]
    )
