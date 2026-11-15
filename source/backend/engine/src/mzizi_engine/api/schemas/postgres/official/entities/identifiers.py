"""Identifiers: one row of identifiers."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OfficialIdentifiersRow(BaseModel):
    """One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.identifiers"

    created_at: datetime
    deleted_at: datetime | None = None
    entity_id: UUID | None = None
    id: UUID
    individual_id: UUID | None = None
    issuer_entity_id: UUID | None = None
    namespace: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    scheme_id: UUID
    source_citation_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    value: Annotated[str, Field(min_length=1, max_length=1000)]
    version: Annotated[int, Field(ge=1)]
