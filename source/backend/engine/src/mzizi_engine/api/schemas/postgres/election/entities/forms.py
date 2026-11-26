"""Forms: one row of forms."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.form_status import FormStatus


class FormsRow(BaseModel):
    """An original results document, so a reader can open the form behind any result."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "election.forms"

    asset_id: UUID | None = None
    contest_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    feature_id: UUID | None = None
    form_term: UUID
    id: UUID
    published_on: date | None = None
    station_id: UUID | None = None
    status: FormStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
