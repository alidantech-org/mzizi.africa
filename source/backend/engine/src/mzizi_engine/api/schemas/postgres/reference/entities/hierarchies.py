"""Hierarchies: one row of hierarchies."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.hierarchy_kind import HierarchyKind
from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class HierarchiesRow(BaseModel):
    """One way a country divides itself for a period (Kenya administrative 1963–2013, Kenya administrative 2013–, Kenya electoral). Places are geography features linked through `geography.relationships`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.hierarchies"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_kind: IdentityKind
    is_routing: bool
    kind: HierarchyKind
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
