"""Keys: one row of keys."""

from __future__ import annotations

import builtins
from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class KeysRow(BaseModel):
    """An interface text key declared in contracts; unknown keys are refused and missing messages are gaps."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "product.keys"

    app_id: UUID | None = None
    code: Annotated[str, Field(min_length=3, max_length=255, pattern="^[a-z][a-z0-9-]*(\\.[a-z0-9][a-z0-9-]*)+$")]
    created_at: datetime
    deleted_at: datetime | None = None
    description: Annotated[str, Field(max_length=4000)] | None = None
    id: UUID
    max_length: Annotated[int, Field(ge=1)] | None = None
    placeholders: (
        builtins.list[Annotated[str, Field(min_length=1, max_length=64, pattern="^[a-zA-Z][a-zA-Z0-9]*$")]] | None
    ) = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
