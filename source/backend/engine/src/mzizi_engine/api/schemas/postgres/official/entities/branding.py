"""Branding: one row of branding."""

from __future__ import annotations

import builtins
from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BrandingRow(BaseModel):
    """Words and colours of a named thing (slogan, motto, party colours); images are `media`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.branding"

    colors: builtins.list[Annotated[str, Field(pattern="^#[0-9a-fA-F]{6}$")]] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_id: UUID
    kind_term: UUID
    language_id: UUID | None = None
    text: Annotated[str, Field(min_length=1, max_length=2000)] | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
