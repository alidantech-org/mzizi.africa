"""Contract test: Capture keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.mongo.staging.models.capture import Capture


def test_fields_match_contract() -> None:
    fields = Capture.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "byte_size": "byteSize",
        "content_type": "contentType",
        "fetched_at": "fetchedAt",
        "http_status": "httpStatus",
        "id": "id",
        "object_key": "objectKey",
        "sha256": "sha256",
        "source_id": "sourceId",
        "url": "url",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Capture.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "byte_size",
            "fetched_at",
            "id",
            "object_key",
            "sha256",
            "source_id",
            "url",
        ]
    )
