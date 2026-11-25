"""Lang: one row of lang."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LangRow(BaseModel):
    """The languages a release offers, in order."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "product.lang"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    language_id: UUID
    position: Annotated[int, Field(ge=0)]
    release_id: UUID
