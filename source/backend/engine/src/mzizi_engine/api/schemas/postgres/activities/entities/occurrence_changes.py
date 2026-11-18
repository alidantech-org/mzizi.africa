"""Occurrence Changes: one row of occurrence_changes."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class OccurrenceChangesRow(BaseModel):
    """One reschedule, postponement, adjournment, cancellation or confirmation of an occurrence, with the reason, who decided it and under which law. History is the list of changes."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "activities.occurrence_changes"

    authority_entity_id: UUID | None = None
    basis_provision_id: UUID | None = None
    change_kind_id: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    decided_on: date | None = None
    deleted_at: datetime | None = None
    explanation: Annotated[str, Field(max_length=4000)] | None = None
    from_on: date | None = None
    id: UUID
    occurrence_id: UUID
    reason_id: UUID | None = None
    replacement_occurrence_id: UUID | None = None
    source_citation_id: UUID | None = None
    to_on: date | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
