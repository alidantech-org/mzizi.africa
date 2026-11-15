"""Delegations: one row of delegations."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DelegationsRow(BaseModel):
    """Time-limited delegation of scoped access from one account to another."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.delegations"

    created_at: datetime
    delegate_account_id: UUID
    delegator_account_id: UUID
    expires_at: datetime | None = None
    id: UUID
    revoked_at: datetime | None = None
    revoked_by: UUID | None = None
    scope_id: UUID
    starts_at: datetime | None = None
