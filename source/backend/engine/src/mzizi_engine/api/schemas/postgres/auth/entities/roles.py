"""Roles: one row of roles."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RolesRow(BaseModel):
    """Named permission bundle with a policy version; protected roles cannot be edited away."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.roles"

    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    description: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    managing_institution_ref_id: UUID | None = None
    policy_version: Annotated[str, Field(min_length=1, max_length=255)]
    protected: bool
    retired_at: datetime | None = None
    title: Annotated[str, Field(min_length=1, max_length=255)]
