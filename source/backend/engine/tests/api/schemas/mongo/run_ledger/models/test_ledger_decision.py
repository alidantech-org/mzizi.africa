"""Contract test: Ledger Decision keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.run_ledger.models.ledger_decision import LedgerDecision


def test_fields_match_contract() -> None:
    fields = LedgerDecision.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "fetched": "fetched",
        "reason": "reason",
        "score": "score",
        "source_url": "sourceUrl",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in LedgerDecision.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "fetched",
            "reason",
            "source_url",
        ]
    )
