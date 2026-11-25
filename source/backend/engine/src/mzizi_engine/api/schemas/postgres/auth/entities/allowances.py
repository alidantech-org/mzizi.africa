"""Allowances: one row of allowances."""

from __future__ import annotations

from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AllowancesRow(BaseModel):
    """The security ceiling of a delegation: the roles a delegate may receive through it."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.allowances"

    delegation_id: UUID
    role_id: UUID
