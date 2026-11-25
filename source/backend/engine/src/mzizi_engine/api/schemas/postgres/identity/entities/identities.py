"""Identities: one row of identities."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class IdentitiesRow(BaseModel):
    """The anchor of every named thing (country, feature, person, organisation, office, law, event). Extending tables use this id as their own primary key; it never carries display text."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "identity.identities"

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
    kind: IdentityKind
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
