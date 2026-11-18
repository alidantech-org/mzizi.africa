"""Contract test: Entry keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.entry import Entry


def test_fields_match_contract() -> None:
    fields = Entry.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "directory": "directory",
        "kind": "kind",
        "modified": "modified",
        "name": "name",
        "path": "path",
        "size": "size",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Entry.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "directory",
            "kind",
            "modified",
            "name",
            "path",
            "size",
        ]
    )
