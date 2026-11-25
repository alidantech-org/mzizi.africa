"""Positions: one row of positions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class PositionsRow(BaseModel):
    """A kind of seat that law creates (Governor, Member of County Assembly). Its titles are `identity.names`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.positions"

    basis_term: UUID | None = None
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
    exposure_term: UUID | None = None
    id: UUID
    identity_kind: IdentityKind
    institution_id: UUID | None = None
    level_id: UUID | None = None
    method_term: UUID | None = None
    position: Annotated[int, Field(ge=0)] | None = None
    provision_id: UUID | None = None
    role_term: UUID
    seat_count: Annotated[int, Field(ge=1)] | None = None
    seat_level_id: UUID | None = None
    term_limit: Annotated[int, Field(ge=1)] | None = None
    term_years: Annotated[int, Field(ge=1)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
