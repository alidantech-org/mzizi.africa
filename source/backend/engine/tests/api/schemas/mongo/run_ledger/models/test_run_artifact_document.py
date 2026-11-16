"""Contract test: Run Artifact Document keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.run_ledger.models.run_artifact_document import RunArtifactDocument


def test_fields_match_contract() -> None:
    fields = RunArtifactDocument.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "derived_from": "derivedFrom",
        "media_type": "mediaType",
        "path": "path",
        "run_id": "runId",
        "sha256": "sha256",
        "size": "size",
        "source_url": "sourceUrl",
        "stage": "stage",
        "state": "state",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in RunArtifactDocument.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "derived_from",
            "media_type",
            "path",
            "run_id",
            "sha256",
            "size",
            "stage",
            "state",
        ]
    )
