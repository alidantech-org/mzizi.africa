"""Invitations: one row of invitations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class InvitationsRow(BaseModel):
    """A single-use invitation to an institution."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.invitations"

    accepted_account_id: UUID | None = None
    accepted_at: datetime | None = None
    created_at: datetime
    expires_at: datetime | None = None
    id: UUID
    institution_id: UUID
    intended_email: str
    invited_by: UUID
    revoked_at: datetime | None = None
    token_digest: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
