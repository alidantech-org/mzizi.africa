"""Translations: one row of translations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legal.enums.review_status import ReviewStatus
from mzizi_engine.api.schemas.postgres.legal.enums.translation_method import TranslationMethod


class TranslationsRow(BaseModel):
    """Mzizi's own unofficial translation of a wording; never legal authority."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.translations"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    language_id: UUID
    method: TranslationMethod
    notes: Annotated[str, Field(max_length=4000)] | None = None
    review: ReviewStatus
    reviewed_at: datetime | None = None
    reviewed_by_id: UUID | None = None
    text: Annotated[str, Field(min_length=1)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    wording_id: UUID
