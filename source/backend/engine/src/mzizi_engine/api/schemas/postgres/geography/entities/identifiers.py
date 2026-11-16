"""Identifiers: one row of identifiers."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GeographyIdentifiersRow(BaseModel):
    """A preserved identifier assigned to a feature by an external geographic registry or source system."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.identifiers"

    created_at: datetime
    deleted_at: datetime | None = None
    external_id: Annotated[str, Field(min_length=1, max_length=500)]
    feature_id: UUID
    id: UUID
    identifier_scheme_id: UUID
    namespace: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
