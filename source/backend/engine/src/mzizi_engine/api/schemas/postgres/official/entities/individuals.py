"""Individuals: one row of individuals."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class IndividualsRow(BaseModel):
    """A person in public life. Display names are `identity.names`; name parts are `official.parts`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.individuals"

    birth_date: date | None = None
    birth_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    death_date: date | None = None
    death_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    deleted_at: datetime | None = None
    id: UUID
    identity_kind: IdentityKind
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
