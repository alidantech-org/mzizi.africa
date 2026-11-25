"""Captions: one row of captions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.media.enums.text_origin import TextOrigin


class CaptionsRow(BaseModel):
    """Title, description and alt text of an asset in one language."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "media.captions"

    alt_text: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    asset_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(min_length=1, max_length=4000)] | None = None
    id: UUID
    language_id: UUID
    origin: TextOrigin
    title: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
