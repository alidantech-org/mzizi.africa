"""Articles: one row of articles."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ArticlesRow(BaseModel):
    """An article record with no text; its texts per language are `media.texts`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "media.articles"

    author_id: UUID | None = None
    category_term: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contributor_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_id: UUID | None = None
    published_at: datetime | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
