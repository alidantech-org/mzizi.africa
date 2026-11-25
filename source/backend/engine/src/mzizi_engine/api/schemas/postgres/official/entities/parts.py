"""Parts: one row of parts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.official.enums.name_part import NamePart
from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class PartsRow(BaseModel):
    """The parts of a person's name (given, family), for sorting and formal display."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.parts"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    name_id: UUID
    name_kind: IdentityKind
    part: NamePart
    position: Annotated[int, Field(ge=0)]
    text: Annotated[str, Field(min_length=1, max_length=255)]
