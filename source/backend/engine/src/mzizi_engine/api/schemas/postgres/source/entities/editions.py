"""Editions: one row of editions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SourceEditionsRow(BaseModel):
    """A meaningfully distinct release of a product. Another format or scan of the same wording is an artifact, not an edition."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.editions"

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
    description: Annotated[str, Field(max_length=4000)] | None = None
    designation: Annotated[str, Field(min_length=1, max_length=255)]
    id: UUID
    language_id: UUID | None = None
    product_id: UUID
    published_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
