"""Contract test: Prepare Request keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.prepare_request import PrepareRequest


def test_fields_match_contract() -> None:
    fields = PrepareRequest.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "columns": "columns",
        "path": "path",
        "root": "root",
        "save_as": "saveAs",
        "skip_empty_rows": "skipEmptyRows",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in PrepareRequest.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "columns",
            "path",
            "root",
        ]
    )
