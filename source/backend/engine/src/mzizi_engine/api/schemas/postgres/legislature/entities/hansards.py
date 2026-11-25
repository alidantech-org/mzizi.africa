"""Hansards: one row of hansards."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legislature.enums.hansard_status import HansardStatus


class HansardsRow(BaseModel):
    """The official record of a sitting."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legislature.hansards"

    artifact_id: UUID | None = None
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
    id: UUID
    language_id: UUID
    published_on: date | None = None
    reference: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    sitting_id: UUID
    status: HansardStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
