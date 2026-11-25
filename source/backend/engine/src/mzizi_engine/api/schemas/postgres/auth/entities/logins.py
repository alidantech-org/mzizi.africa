"""Logins: one row of logins."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.auth.enums.login_kind import LoginKind


class LoginsRow(BaseModel):
    """A way an account signs in: email or phone with one-time codes, or an OIDC issuer and subject."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.logins"

    account_id: UUID
    id: UUID
    issuer: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    kind: LoginKind
    last_authenticated_at: datetime | None = None
    linked_at: datetime
    subject: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    unlinked_at: datetime | None = None
    value: Annotated[str, Field(min_length=3, max_length=320)] | None = None
    verified_at: datetime | None = None
