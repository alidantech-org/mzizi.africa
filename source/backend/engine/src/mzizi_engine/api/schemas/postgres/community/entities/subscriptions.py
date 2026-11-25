"""Subscriptions: one row of subscriptions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SubscriptionsRow(BaseModel):
    """A named thing an actor follows."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.subscriptions"

    actor_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_id: UUID
    kind_term: UUID
    revoked_at: datetime | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
