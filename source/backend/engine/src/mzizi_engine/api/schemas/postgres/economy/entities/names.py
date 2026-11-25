"""Names: one row of names."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.economy.enums.name_kind import NameKind


class EconomyNamesRow(BaseModel):
    """Names of a good in any language."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "economy.names"

    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    good_id: UUID
    id: UUID
    kind: NameKind
    language_id: UUID
    text: Annotated[str, Field(min_length=1, max_length=1000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
