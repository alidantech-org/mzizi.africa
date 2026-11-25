"""Actors: one row of actors."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.actor_kind import ActorKind
from mzizi_engine.api.schemas.postgres.community.enums.actor_status import ActorStatus


class ActorsRow(BaseModel):
    """A visitor or member; a member's public profile. Members are not identities."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.actors"

    account_id: UUID | None = None
    avatar_id: UUID | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    display_name: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    first_seen_at: datetime
    handle: Annotated[str, Field(min_length=3, max_length=30, pattern="^[a-z][a-z0-9]*([._][a-z0-9]+)*$")] | None = None
    id: UUID
    kind: ActorKind
    language_id: UUID | None = None
    last_seen_at: datetime
    status: ActorStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
