"""Contributions: one row of contributions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContributionsRow(BaseModel):
    """A political donation or in-kind contribution as disclosed."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.contributions"

    amount: Annotated[int, Field(ge=0)] | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    donor_id: UUID
    election_id: UUID | None = None
    given_on: date | None = None
    id: UUID
    is_in_kind: bool
    recipient_id: UUID
    status_term: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    version_id: UUID | None = None
