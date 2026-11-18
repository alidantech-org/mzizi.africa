"""Contract test: Domain List keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.domain_list import DomainList


def test_fields_match_contract() -> None:
    fields = DomainList.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "domains": "domains",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in DomainList.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "domains",
        ]
    )
