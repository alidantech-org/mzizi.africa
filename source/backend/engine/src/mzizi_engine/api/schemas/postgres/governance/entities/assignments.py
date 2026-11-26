"""Assignments: one row of assignments."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.assignment_share import AssignmentShare


class AssignmentsRow(BaseModel):
    """Which institution or position carries a function, and who leads it."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.assignments"

    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    function_id: UUID
    id: UUID
    initiator_id: UUID | None = None
    institution_id: UUID | None = None
    position_id: UUID | None = None
    share: AssignmentShare
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
