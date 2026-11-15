"""Contract test: Candidate keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.staging.models.candidate import Candidate


def test_fields_match_contract() -> None:
    fields = Candidate.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "capture_ids": "captureIds",
        "confidence": "confidence",
        "created_at": "createdAt",
        "decided_at": "decidedAt",
        "decided_by": "decidedBy",
        "id": "id",
        "kind": "kind",
        "ledger_id": "ledgerId",
        "payload": "payload",
        "proposed_by": "proposedBy",
        "status": "status",
        "target_table": "targetTable",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Candidate.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "capture_ids",
            "created_at",
            "id",
            "kind",
            "payload",
            "proposed_by",
            "status",
        ]
    )
