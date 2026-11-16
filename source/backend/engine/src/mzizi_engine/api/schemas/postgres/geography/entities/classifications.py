"""Classifications: one row of classifications."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ClassificationsRow(BaseModel):
    """One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.classifications"

    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID
    id: UUID
    source_id: UUID | None = None
    updated_at: datetime
    valid_from: date | None = None
    valid_from_earliest: date | None = None
    valid_from_latest: date | None = None
    valid_until: date | None = None
    valid_until_earliest: date | None = None
    valid_until_latest: date | None = None
    value_id: UUID
    version: Annotated[int, Field(ge=1)]
