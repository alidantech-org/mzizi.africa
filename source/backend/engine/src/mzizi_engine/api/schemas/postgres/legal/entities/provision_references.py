"""Provision References: one row of provision_references."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legal.enums.reference_method import ReferenceMethod
from mzizi_engine.api.schemas.postgres.legal.enums.reference_relation import ReferenceRelation
from mzizi_engine.api.schemas.postgres.legal.enums.review_status import ReviewStatus


class ProvisionReferencesRow(BaseModel):
    """A mention of one provision inside the wording of another, with the exact span, so a reader can follow it like a link and ask what refers to a provision."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.provision_references"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    method: ReferenceMethod
    relation: ReferenceRelation
    review_status: ReviewStatus
    source_version_id: UUID
    span_end: Annotated[int, Field(ge=1)]
    span_start: Annotated[int, Field(ge=0)]
    span_text: Annotated[str, Field(min_length=1, max_length=500)]
    target_provision_id: UUID
    translation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
