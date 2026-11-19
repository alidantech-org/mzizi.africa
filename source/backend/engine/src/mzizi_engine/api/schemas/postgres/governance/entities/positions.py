"""Positions: one row of positions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.date_precision import DatePrecision


class PositionsRow(BaseModel):
    """A kind of office with its seat rule: how it is filled, how many seats exist and where, the term, the legal basis. Offices are the individual seats of a position; holders are never part of it."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.positions"

    basis_provision_id: UUID | None = None
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
    display_order: Annotated[int, Field(ge=0)] | None = None
    exposure_id: UUID | None = None
    from_to_precision: DatePrecision | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    institution_id: UUID
    jurisdiction_level_id: UUID | None = None
    role_id: UUID
    seat_basis_id: UUID
    seat_count: Annotated[int, Field(ge=1)] | None = None
    seat_unit_level_id: UUID | None = None
    selection_method_id: UUID
    source_citation_id: UUID | None = None
    term_limit: Annotated[int, Field(ge=1)] | None = None
    term_years: Annotated[int, Field(ge=1)] | None = None
    title_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
