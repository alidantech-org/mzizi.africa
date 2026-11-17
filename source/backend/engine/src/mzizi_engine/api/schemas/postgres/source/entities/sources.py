"""Sources: one row of sources."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.source.enums.source_kind import SourceKind


class SourcesRow(BaseModel):
    """A publication channel, named by anything but its domain: a real website, a real API, or a dataset (files or data obtained from somewhere that is neither). Only websites and APIs have domains and paths; the dataset tables record what we prepared from sources."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.sources"

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
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    kind: SourceKind
    official_entity_id: UUID | None = None
    publisher_id: UUID
    title: Annotated[str, Field(min_length=1, max_length=300)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
