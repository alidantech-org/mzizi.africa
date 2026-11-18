"""Actors: one row of actors."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.actor_kind import ActorKind
from mzizi_engine.api.schemas.postgres.community.enums.actor_status import ActorStatus


class ActorsRow(BaseModel):
    """A visitor identity the server issues: anonymous by default, tied to an account only if one is linked later. No name, email or phone is held."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.actors"

    account_id: UUID | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    first_seen_at: datetime
    id: UUID
    kind: ActorKind
    language_id: UUID | None = None
    last_seen_at: datetime
    status: ActorStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
