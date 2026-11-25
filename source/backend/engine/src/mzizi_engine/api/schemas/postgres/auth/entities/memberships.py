"""Memberships: one row of memberships."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.auth.enums.membership_status import MembershipStatus


class AuthMembershipsRow(BaseModel):
    """An account's membership of an institution, verified and revocable with attribution."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.memberships"

    account_id: UUID
    ends_at: datetime | None = None
    id: UUID
    institution_id: UUID
    revoked_at: datetime | None = None
    revoked_by: UUID | None = None
    starts_at: datetime | None = None
    status: MembershipStatus
    verified_at: datetime | None = None
    verified_by: UUID | None = None
