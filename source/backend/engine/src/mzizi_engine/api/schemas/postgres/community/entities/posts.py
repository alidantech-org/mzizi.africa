"""Posts: one row of posts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.post_state import PostState
from mzizi_engine.api.schemas.postgres.shared.enums.post_kind import PostKind


class PostsRow(BaseModel):
    """Every contribution: comments, reviews, reports and questions from signed-in members."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.posts"

    actor_id: UUID
    body: Annotated[str, Field(min_length=1, max_length=20000)] | None = None
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    device_id: UUID | None = None
    id: UUID
    identity_id: UUID | None = None
    kind: PostKind
    language_id: UUID | None = None
    parent_id: UUID | None = None
    proof_id: UUID | None = None
    published_at: datetime | None = None
    rating: Annotated[int, Field(ge=1, le=5)] | None = None
    state: PostState
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
