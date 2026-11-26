"""Premises: one row of premises."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PremisesRow(BaseModel):
    """A located premises of an organisation: its headquarters, regional or registered office. The address is an `identity.addresses` row or a postal-address contact; the pin may be unknown while the row is only expected."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.premises"

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
    entity_id: UUID
    feature_id: UUID | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    kind_term: UUID
    ordinal: Annotated[int, Field(ge=1)]
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
