"""Units: one row of units."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class UnitsRow(BaseModel):
    """A unit of measurement and its exact conversion to a base unit; never a spatial unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.units"

    base_id: UUID | None = None
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
    id: UUID
    identity_kind: IdentityKind
    offset: float
    quantity_term: UUID
    scale: float
    symbol: Annotated[str, Field(min_length=1, max_length=100)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
