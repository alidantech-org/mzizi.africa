"""Value: one row of values."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ValueRow(BaseModel):
    """A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.values"

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
    label: Annotated[str, Field(min_length=1, max_length=300)]
    parent_id: UUID | None = None
    position: Annotated[int, Field(ge=0)] | None = None
    scheme_id: UUID
    supersedes_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
