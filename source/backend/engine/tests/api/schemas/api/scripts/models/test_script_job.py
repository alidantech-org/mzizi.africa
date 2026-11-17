"""Contract test: Script Job keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.scripts.models.script_job import ScriptJob


def test_fields_match_contract() -> None:
    fields = ScriptJob.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "cancel_requested": "cancelRequested",
        "error": "error",
        "exit_code": "exitCode",
        "finished_at": "finishedAt",
        "id": "id",
        "image_id": "imageId",
        "request": "request",
        "script_sha256": "scriptSha256",
        "started_at": "startedAt",
        "status": "status",
        "stderr": "stderr",
        "stderr_sha256": "stderrSha256",
        "stdout": "stdout",
        "stdout_sha256": "stdoutSha256",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ScriptJob.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "cancel_requested",
            "id",
            "image_id",
            "request",
            "script_sha256",
            "started_at",
            "status",
            "stderr",
            "stdout",
        ]
    )
