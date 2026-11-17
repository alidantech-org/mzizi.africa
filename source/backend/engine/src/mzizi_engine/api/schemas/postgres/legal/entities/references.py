"""References: one row of references."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legal.enums.reference_method import ReferenceMethod
from mzizi_engine.api.schemas.postgres.legal.enums.reference_relation import ReferenceRelation
from mzizi_engine.api.schemas.postgres.legal.enums.review_status import ReviewStatus


class ReferencesRow(BaseModel):
    """A textual mention of a provision inside a wording or translation, with the exact span. A mention is not an amendment."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.references"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    method: ReferenceMethod
    relation: ReferenceRelation
    review_status: ReviewStatus
    span_end: Annotated[int, Field(ge=1)]
    span_start: Annotated[int, Field(ge=0)]
    span_text: Annotated[str, Field(min_length=1, max_length=500)]
    target_provision_id: UUID
    target_wording_id: UUID | None = None
    translation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    wording_id: UUID | None = None
