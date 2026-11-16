"""Contract test: Run Summary Document keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.run_ledger.models.run_summary_document import RunSummaryDocument


def test_fields_match_contract() -> None:
    fields = RunSummaryDocument.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "approver": "approver",
        "counts": "counts",
        "decisions": "decisions",
        "files": "files",
        "finished_at": "finishedAt",
        "run_id": "runId",
        "spec_hash": "specHash",
        "state": "state",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RunSummaryDocument.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "counts",
            "decisions",
            "files",
            "finished_at",
            "run_id",
            "spec_hash",
            "state",
        ]
    )
