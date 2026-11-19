"""Contract test: Raw File keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.raw_file import RawFile


def test_fields_match_contract() -> None:
    fields = RawFile.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "base64": "base64",
        "content_type": "contentType",
        "name": "name",
        "size": "size",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RawFile.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "base64",
            "content_type",
            "name",
            "size",
        ]
    )
