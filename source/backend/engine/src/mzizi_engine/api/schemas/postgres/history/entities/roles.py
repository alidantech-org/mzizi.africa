"""Roles: one row of roles."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class HistoryRolesRow(BaseModel):
    """Who and what took part in a historical occurrence, and how."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "history.roles"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_id: UUID
    occurrence_id: UUID
    role_term: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
