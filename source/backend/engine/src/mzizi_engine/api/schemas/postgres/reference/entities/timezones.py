"""Timezones: one row of timezones."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class TimezonesRow(BaseModel):
    """An IANA time zone."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.timezones"

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
    iana_name: Annotated[str, Field(min_length=3, max_length=64, pattern="^[A-Za-z_]+(/[A-Za-z0-9_+-]+)+$|^UTC$")]
    id: UUID
    identity_kind: IdentityKind
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
