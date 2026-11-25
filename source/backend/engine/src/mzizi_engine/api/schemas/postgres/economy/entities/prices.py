"""Prices: one row of prices."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.economy.enums.price_kind import PriceKind
from mzizi_engine.api.schemas.postgres.shared.enums.figure_basis import FigureBasis
from mzizi_engine.api.schemas.postgres.shared.enums.figure_status import FigureStatus


class PricesRow(BaseModel):
    """One observed, reference or modelled price of a good at a place and time."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "economy.prices"

    amount: Annotated[int, Field(ge=0)] | None = None
    basis: FigureBasis
    collection_id: UUID | None = None
    country_id: UUID
    created_at: datetime
    currency_id: UUID
    deleted_at: datetime | None = None
    ends_on: date | None = None
    feature_id: UUID | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    good_id: UUID
    id: UUID
    kind: PriceKind
    revision: Annotated[int, Field(ge=1)]
    starts_on: date | None = None
    status: FigureStatus
    supersedes_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
