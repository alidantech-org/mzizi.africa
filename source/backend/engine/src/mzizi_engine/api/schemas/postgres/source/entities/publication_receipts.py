"""Publication Receipts: one row of publication_receipts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PublicationReceiptsRow(BaseModel):
    """Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.publication_receipts"

    actor_snapshot: str
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contract_version: Annotated[str, Field(min_length=1, max_length=255)]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    idempotency_key: Annotated[str, Field(min_length=1, max_length=255)]
    payload_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    publication_ref_id: UUID
    published_at: datetime
    request_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    result_manifest: str
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
