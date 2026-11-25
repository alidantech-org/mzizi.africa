"""Roles: one row of roles."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CivicRolesRow(BaseModel):
    """The people and organisations involved in procurement, contracts and projects, and how."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.roles"

    acted_on: date | None = None
    bid_id: UUID | None = None
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    holder_id: UUID | None = None
    id: UUID
    identity_id: UUID | None = None
    procurement_id: UUID | None = None
    project_id: UUID | None = None
    role_term: UUID
    share: Annotated[float, Field(ge=0, le=100)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
