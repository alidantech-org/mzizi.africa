"""Officials: one row of officials."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OfficialsRow(BaseModel):
    """A person who acted in a buying process (evaluated, approved, signed), with the role and the office held then; this is what lets a conflict be checked on a real signature."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.officials"

    acted_on: date | None = None
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    individual_id: UUID
    office_id: UUID | None = None
    procurement_id: UUID | None = None
    role_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
