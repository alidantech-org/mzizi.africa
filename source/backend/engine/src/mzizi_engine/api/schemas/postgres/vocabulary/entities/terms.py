"""Terms: one row of terms."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.vocabulary.enums.term_status import TermStatus


class TermsRow(BaseModel):
    """A member of one scheme: a code, its place in the scheme, display hints and optional numeric band. No display text: words are `vocabulary.labels`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "vocabulary.terms"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    color_token: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    icon_code: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    id: UUID
    lower: float | None = None
    lower_inclusive: bool | None = None
    parent_id: UUID | None = None
    position: Annotated[int, Field(ge=0)] | None = None
    scheme_id: UUID
    status: TermStatus
    supersedes_id: UUID | None = None
    unit_id: UUID | None = None
    updated_at: datetime
    upper: float | None = None
    upper_inclusive: bool | None = None
    version: Annotated[int, Field(ge=1)]
