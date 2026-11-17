"""Branding: one row of branding."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BrandingRow(BaseModel):
    """How an entity or person presents itself: slogan, colours, a symbol or logo, a portrait. Words go in `value`; images and recordings are filesystem media that mention the entity or person."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.branding"

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
    entity_id: UUID | None = None
    id: UUID
    individual_id: UUID | None = None
    kind_id: UUID
    language_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    value: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    version: Annotated[int, Field(ge=1)]
