"""Consents: one row of consents."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ConsentsRow(BaseModel):
    """One consent given or withdrawn by an actor for one purpose, with the wording version shown."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.consents"

    actor_id: UUID
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    given_at: datetime
    id: UUID
    purpose_id: UUID
    text_version: Annotated[str, Field(min_length=1, max_length=100)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    withdrawn_at: datetime | None = None
