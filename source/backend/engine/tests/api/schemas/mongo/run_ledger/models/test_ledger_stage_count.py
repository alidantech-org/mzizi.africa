"""Contract test: Ledger Stage Count keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.run_ledger.models.ledger_stage_count import LedgerStageCount


def test_fields_match_contract() -> None:
    fields = LedgerStageCount.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "files": "files",
        "stage": "stage",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in LedgerStageCount.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "files",
            "stage",
        ]
    )
