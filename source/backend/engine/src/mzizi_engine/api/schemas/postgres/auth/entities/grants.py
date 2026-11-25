"""Grants: one row of grants."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GrantsRow(BaseModel):
    """Who holds which role, within which scope, with revocation history."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.grants"

    account_id: UUID
    created_at: datetime
    delegation_id: UUID | None = None
    expires_at: datetime | None = None
    granted_by: UUID
    id: UUID
    membership_id: UUID | None = None
    revocation_reason: Annotated[str, Field(max_length=4000)] | None = None
    revoked_at: datetime | None = None
    revoked_by: UUID | None = None
    role_id: UUID
    scope_id: UUID
    starts_at: datetime | None = None
