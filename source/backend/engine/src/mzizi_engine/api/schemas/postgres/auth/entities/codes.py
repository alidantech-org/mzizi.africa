"""Codes: one row of codes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.auth.enums.code_channel import CodeChannel
from mzizi_engine.api.schemas.postgres.auth.enums.code_purpose import CodePurpose


class AuthCodesRow(BaseModel):
    """A one-time sign-up or sign-in code."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.codes"

    attempts: Annotated[int, Field(ge=0, le=100)]
    channel: CodeChannel
    consumed_at: datetime | None = None
    created_at: datetime
    digest: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    expires_at: datetime
    id: UUID
    login_id: UUID | None = None
    purpose: CodePurpose
    value: Annotated[str, Field(min_length=3, max_length=320)] | None = None
