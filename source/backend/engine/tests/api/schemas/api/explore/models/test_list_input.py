"""Contract test: List Input keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.list_input import ListInput


def test_fields_match_contract() -> None:
    fields = ListInput.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "code": "code",
        "domain": "domain",
        "limit": "limit",
        "offset": "offset",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ListInput.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "code",
            "domain",
        ]
    )
