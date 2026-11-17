"""Paths: one row of paths."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.source.enums.http_method import HttpMethod
from mzizi_engine.api.schemas.postgres.source.enums.path_kind import PathKind


class PathsRow(BaseModel):
    """A page, listing, file or API endpoint on a domain; captures hang off it."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.paths"

    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    domain_id: UUID
    id: UUID
    kind: PathKind
    method: HttpMethod | None = None
    note: Annotated[str, Field(max_length=4000)] | None = None
    path: Annotated[str, Field(min_length=1, max_length=1000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
