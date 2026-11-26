"""Appropriations: one row of appropriations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AppropriationsRow(BaseModel):
    """A line of a budget revision: money voted to a recipient, programme, project or place."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.appropriations"

    amount: Annotated[int, Field(ge=0)] | None = None
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
    currency_id: UUID | None = None
    deleted_at: datetime | None = None
    feature_id: UUID | None = None
    id: UUID
    parent_id: UUID | None = None
    project_id: UUID | None = None
    recipient_id: UUID | None = None
    revision_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
