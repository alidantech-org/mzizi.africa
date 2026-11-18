"""Funds: one row of funds."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FundsRow(BaseModel):
    """One named public fund with a classification, manager and country."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.funds"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    fund_kind_id: UUID
    id: UUID
    managing_entity_id: UUID | None = None
    scope_unit_feature_id: UUID | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
