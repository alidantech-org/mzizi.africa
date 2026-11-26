"""Areas: one row of areas."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AreasRow(BaseModel):
    """One official place in one hierarchy at one level for a period: the unit patterns fan out over and offices, jurisdictions and templates point at. Geography details are found through the feature's identity; boundary status is read from the feature's geometry."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.areas"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    hierarchy_id: UUID
    id: UUID
    level_id: UUID
    parent_id: UUID | None = None
    template_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
