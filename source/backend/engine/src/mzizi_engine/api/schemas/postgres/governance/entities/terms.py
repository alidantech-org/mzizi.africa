"""Terms: one row of terms."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TermsRow(BaseModel):
    """A fixed period for which offices are filled: a presidential term, a parliament, a county assembly. Elections, by-elections, mandates and sittings belong to a term."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.terms"

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
    ends_on: date | None = None
    id: UUID
    institution_id: UUID | None = None
    ordinal: Annotated[int, Field(ge=1)] | None = None
    source_citation_id: UUID | None = None
    starts_on: date
    term_kind_id: UUID
    unit_feature_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
