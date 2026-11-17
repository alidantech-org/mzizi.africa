"""Provisions: one row of provisions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.legal.enums.provision_kind import ProvisionKind


class ProvisionsRow(BaseModel):
    """Stable section identity within one instrument; hierarchy must remain within that instrument. One provision holds one statement: a numbered point is a row of its own under its parent."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "legal.provisions"

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
    designation: Annotated[str, Field(min_length=1, max_length=255)]
    id: UUID
    instrument_id: UUID
    kind: ProvisionKind
    parent_id: UUID | None = None
    position: Annotated[int, Field(ge=1)]
    title: Annotated[str, Field(min_length=1, max_length=300)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
