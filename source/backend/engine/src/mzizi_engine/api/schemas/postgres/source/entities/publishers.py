"""Publishers: one row of publishers."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class PublishersRow(BaseModel):
    """Who publishes; a publisher shares its organisation's identity (`official.entities`)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.publishers"

    class_term: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_kind: IdentityKind
    kind_term: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
