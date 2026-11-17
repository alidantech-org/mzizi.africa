"""Contract test: Artifact Ref keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.research.models.artifact_ref import ArtifactRef


def test_fields_match_contract() -> None:
    fields = ArtifactRef.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "path": "path",
        "run_id": "runId",
        "sha256": "sha256",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ArtifactRef.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "path",
            "run_id",
            "sha256",
        ]
    )
