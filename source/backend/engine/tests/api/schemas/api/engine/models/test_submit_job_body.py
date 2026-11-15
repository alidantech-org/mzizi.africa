"""Contract test: Submit Job Body keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.engine.models.submit_job_body import SubmitJobBody


def test_fields_match_contract() -> None:
    fields = SubmitJobBody.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "idempotency_key": "idempotencyKey",
        "input": "input",
        "kind": "kind",
        "run_id": "runId",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in SubmitJobBody.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "kind",
        ]
    )
