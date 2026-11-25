"""Privileges: one row of privileges."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PrivilegesRow(BaseModel):
    """What a role may do: a permission granted to a role, with who granted it and when."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.privileges"

    granted_at: datetime
    granted_by: UUID
    permission_id: UUID
    role_id: UUID
