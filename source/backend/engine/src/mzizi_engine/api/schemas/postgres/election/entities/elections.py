"""Elections: one row of elections."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class ElectionsRow(BaseModel):
    """An election or referendum. Its names are `identity.names`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.elections"

    authority_id: UUID | None = None
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
    event_id: UUID | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)]
    held_on: date | None = None
    id: UUID
    identity_kind: IdentityKind
    kind_term: UUID
    parent_id: UUID | None = None
    status_term: UUID
    term_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
