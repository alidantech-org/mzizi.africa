"""Accounts: one row of accounts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.auth.enums.account_status import AccountStatus
from mzizi_engine.api.schemas.postgres.auth.enums.auth_actor_kind import AuthActorKind


class AccountsRow(BaseModel):
    """A sign-in principal for a person, service or agent."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.accounts"

    actor_kind: AuthActorKind
    created_at: datetime
    disabled_at: datetime | None = None
    display_name: Annotated[str, Field(min_length=1, max_length=255)]
    id: UUID
    individual_id: UUID | None = None
    last_authenticated_at: datetime | None = None
    status: AccountStatus
