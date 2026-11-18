"""Contract test: Domain Info keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.explore.models.domain_info import DomainInfo


def test_fields_match_contract() -> None:
    fields = DomainInfo.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "domain": "domain",
        "tables": "tables",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in DomainInfo.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "domain",
            "tables",
        ]
    )
