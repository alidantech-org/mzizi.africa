"""Sources: one row of sources."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.source.enums.source_kind import SourceKind


class SourcesRow(BaseModel):
    """A publication channel of a publisher."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.sources"

    class_term: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    credential_binding: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    credibility_term: UUID | None = None
    deleted_at: datetime | None = None
    id: UUID
    kind: SourceKind
    label: Annotated[str, Field(min_length=1, max_length=255)]
    licence_term: UUID | None = None
    publisher_id: UUID
    terms_url: Annotated[str, Field(max_length=2048)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
