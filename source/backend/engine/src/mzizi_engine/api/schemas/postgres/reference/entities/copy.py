"""Copy: one row of copy."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CopyRow(BaseModel):
    """One interface or explanatory wording for one copy key in one language, optionally specific to a country. Screens declare keys; the words live here."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.copy"

    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    is_development_text: bool
    key: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    language_id: UUID
    text: Annotated[str, Field(min_length=1)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
