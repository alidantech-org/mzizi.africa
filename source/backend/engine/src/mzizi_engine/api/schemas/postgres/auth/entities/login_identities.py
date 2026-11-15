"""Login Identities: one row of login_identities."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LoginIdentitiesRow(BaseModel):
    """External issuer and subject linked to one account; unlinking is recorded, never deleted."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.login_identities"

    account_id: UUID
    id: UUID
    issuer: Annotated[str, Field(min_length=1, max_length=500)]
    last_authenticated_at: datetime | None = None
    linked_at: datetime
    subject: Annotated[str, Field(min_length=1, max_length=500)]
    unlinked_at: datetime | None = None
