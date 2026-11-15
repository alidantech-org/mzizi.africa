"""Role Permissions: one row of role_permissions."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RolePermissionsRow(BaseModel):
    """Permission granted to a role, with who granted it and when."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.role_permissions"

    granted_at: datetime
    granted_by: UUID
    permission_id: UUID
    role_id: UUID
