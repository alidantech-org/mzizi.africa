"""Tokens: one row of tokens."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.push_provider import PushProvider


class TokensRow(BaseModel):
    """A push notification token of a device."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.tokens"

    created_at: datetime
    deleted_at: datetime | None = None
    device_id: UUID
    enabled_at: datetime
    id: UUID
    provider: PushProvider
    revoked_at: datetime | None = None
    token: Annotated[str, Field(min_length=1, max_length=1000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
