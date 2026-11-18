"""Contract test: Save File Result keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.save_file_result import SaveFileResult


def test_fields_match_contract() -> None:
    fields = SaveFileResult.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "path": "path",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in SaveFileResult.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "path",
        ]
    )
