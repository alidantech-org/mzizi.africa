"""Texts: one row of texts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.media.enums.text_origin import TextOrigin
from mzizi_engine.api.schemas.postgres.media.enums.text_status import TextStatus


class MediaTextsRow(BaseModel):
    """One article in one language: exactly one original per article, at most one live text per language."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "media.texts"

    article_id: UUID
    body: Annotated[str, Field(min_length=1)]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    language_id: UUID
    origin: TextOrigin
    status: TextStatus
    summary: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    title: Annotated[str, Field(min_length=1, max_length=500)]
    translated_from_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
