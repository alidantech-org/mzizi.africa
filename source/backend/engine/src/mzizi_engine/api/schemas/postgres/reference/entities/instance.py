"""Instance: one row of instances."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class InstanceRow(BaseModel):
    """The ledger of generated records: which template produced which institution, position, office, site or contact, for which unit, and whether it is still only expected or has been sourced or verified."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.instances"

    contact_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    domain_id: UUID | None = None
    generated_at: datetime
    id: UUID
    institution_id: UUID | None = None
    office_id: UUID | None = None
    position_id: UUID | None = None
    status_id: UUID
    template_id: UUID
    unit_feature_id: UUID | None = None
    updated_at: datetime
    verified_citation_id: UUID | None = None
    version: Annotated[int, Field(ge=1)]
