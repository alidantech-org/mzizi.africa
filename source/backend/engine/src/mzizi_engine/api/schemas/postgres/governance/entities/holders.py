"""Holders: one row of holders."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.holder_end import HolderEnd
from mzizi_engine.api.schemas.postgres.shared.enums.selection_method import SelectionMethod


class HoldersRow(BaseModel):
    """A person in an office for a period, or the empty slot for one. How a person got there is `governance.appointments`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.holders"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contest_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    individual_id: UUID | None = None
    method: SelectionMethod | None = None
    office_id: UUID
    reason: HolderEnd | None = None
    starts_on: date | None = None
    term_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
