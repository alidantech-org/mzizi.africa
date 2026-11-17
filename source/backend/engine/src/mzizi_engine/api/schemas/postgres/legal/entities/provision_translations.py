"""Provision Translations: one row of provision_translations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legal.enums.review_status import ReviewStatus
from mzizi_engine.api.schemas.postgres.legal.enums.translation_kind import TranslationKind


class ProvisionTranslationsRow(BaseModel):
    """The wording of one provision version in another language, one row per statement so translations line up row for row. A machine or unofficial translation is a reviewable proposal, never silently canonical."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.provision_translations"

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
    document_id: UUID | None = None
    id: UUID
    kind: TranslationKind
    language_id: UUID
    produced_by: str | None = None
    provision_version_id: UUID
    review_status: ReviewStatus
    reviewed_at: datetime | None = None
    reviewed_by_snapshot: str | None = None
    text: Annotated[str, Field(min_length=1)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
