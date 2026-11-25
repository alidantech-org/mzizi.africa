"""Instances: one row of instances."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class InstancesRow(BaseModel):
    """Which template produced which record, for which place, and whether it is only expected or has been found."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.instances"

    contact_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    domain_id: UUID | None = None
    generated_at: datetime
    id: UUID
    institution_id: UUID | None = None
    office_id: UUID | None = None
    position_id: UUID | None = None
    status_term: UUID
    template_id: UUID
    unit_feature_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
