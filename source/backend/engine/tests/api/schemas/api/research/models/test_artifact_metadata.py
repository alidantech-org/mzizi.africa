"""Contract test: Artifact Metadata keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.research.models.artifact_metadata import ArtifactMetadata


def test_fields_match_contract() -> None:
    fields = ArtifactMetadata.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "artifact": "artifact",
        "derived_from": "derivedFrom",
        "media_type": "mediaType",
        "size": "size",
        "source_url": "sourceUrl",
        "stage": "stage",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in ArtifactMetadata.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "artifact",
            "derived_from",
            "media_type",
            "size",
            "stage",
        ]
    )
