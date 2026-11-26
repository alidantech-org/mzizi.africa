"""Levels: one row of levels."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class LevelsRow(BaseModel):
    """A rank of one hierarchy (Kenya 2013: county, sub-county, ward)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.levels"

    allows_skip: bool
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
    depth: Annotated[int, Field(ge=0, le=12)]
    hierarchy_id: UUID
    id: UUID
    identity_kind: IdentityKind
    kind_term: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
