"""Replies: one row of replies."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RepliesRow(BaseModel):
    """An official response to a post."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.replies"

    body: Annotated[str, Field(min_length=1, max_length=20000)]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    language_id: UUID
    post_country_id: UUID
    post_id: UUID
    published_at: datetime | None = None
    received_at: datetime
    respondent_id: UUID
    status_term: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
