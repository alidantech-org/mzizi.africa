"""Promises: one row of promises."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PromisesRow(BaseModel):
    """Something a leader said they would do, with where and when, what was promised and its checked status. 'No record found' is a status backed by source coverage, never an empty cell."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.promises"

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
    due_on: date | None = None
    id: UUID
    made_on: date
    maker_holder_id: UUID | None = None
    maker_individual_id: UUID | None = None
    occurrence_id: UUID | None = None
    office_id: UUID | None = None
    place_feature_id: UUID | None = None
    quantity: float | None = None
    sitting_id: UUID | None = None
    source_citation_id: UUID | None = None
    speech_id: UUID | None = None
    statement: Annotated[str, Field(max_length=4000)]
    status_as_of: date
    status_id: UUID
    topic_id: UUID | None = None
    unit_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
