"""Reactions: one row of reactions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ReactionsRow(BaseModel):
    """A member's reaction to a post, named thing or article."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.reactions"

    actor_id: UUID
    article_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_id: UUID | None = None
    kind_term: UUID
    post_country_id: UUID | None = None
    post_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
