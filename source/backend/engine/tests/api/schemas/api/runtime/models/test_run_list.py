"""Contract test: Run List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.runtime.models.run_list import RunList


def test_fields_match_contract() -> None:
    fields = RunList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "runs": "runs",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RunList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "runs",
        ]
    )
