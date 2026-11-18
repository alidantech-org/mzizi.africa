"""Contract test: File View keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.file_view import FileView


def test_fields_match_contract() -> None:
    fields = FileView.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "actions": "actions",
        "header": "header",
        "kind": "kind",
        "modified": "modified",
        "name": "name",
        "parsed": "parsed",
        "path": "path",
        "root": "root",
        "rows": "rows",
        "size": "size",
        "text": "text",
        "total_rows": "totalRows",
        "truncated": "truncated",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in FileView.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "actions",
            "header",
            "kind",
            "modified",
            "name",
            "path",
            "root",
            "rows",
            "size",
            "truncated",
        ]
    )
