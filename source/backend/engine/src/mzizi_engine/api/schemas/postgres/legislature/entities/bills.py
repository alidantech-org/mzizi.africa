"""Bills: one row of bills."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class BillsRow(BaseModel):
    """A bill. Its titles are `identity.names`; its summaries are `legislature.summaries`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.bills"

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
    identity_kind: IdentityKind
    institution_id: UUID
    instrument_id: UUID | None = None
    kind_term: UUID
    sponsor_id: UUID | None = None
    status_term: UUID
    term_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
