"""Contract test: Save File Body keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.save_file_body import SaveFileBody


def test_fields_match_contract() -> None:
    fields = SaveFileBody.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "overwrite": "overwrite",
        "path": "path",
        "text": "text",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in SaveFileBody.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "path",
            "text",
        ]
    )
