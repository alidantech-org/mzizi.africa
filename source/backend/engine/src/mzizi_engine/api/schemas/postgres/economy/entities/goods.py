"""Goods: one row of goods."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.economy.enums.good_kind import GoodKind
from mzizi_engine.api.schemas.postgres.economy.enums.good_status import GoodStatus


class GoodsRow(BaseModel):
    """The catalogue of goods, services and works ("Cement, 50 kg bag, grade 42.5N")."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "economy.goods"

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
    kind: GoodKind
    parent_id: UUID | None = None
    size: float | None = None
    size_unit_id: UUID | None = None
    standard_term: UUID | None = None
    status: GoodStatus
    unit_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
