"""Scopes: one row of scopes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AuthScopesRow(BaseModel):
    """A deduplicated access scope: global, or narrowed by institution, country, place or field group."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.scopes"

    country_id: UUID | None = None
    created_at: datetime
    feature_id: UUID | None = None
    field_group: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    id: UUID
    include_descendants: bool
    institution_id: UUID | None = None
    is_global: bool
    scope_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
