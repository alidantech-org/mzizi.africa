"""Delegation Roles: one row of delegation_roles."""

from __future__ import annotations

from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DelegationRolesRow(BaseModel):
    """Role included in a delegation."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.delegation_roles"

    delegation_id: UUID
    role_id: UUID
