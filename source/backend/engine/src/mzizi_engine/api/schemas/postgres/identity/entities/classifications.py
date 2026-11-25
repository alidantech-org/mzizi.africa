"""Classifications: one row of classifications."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ClassificationsRow(BaseModel):
    """Dated answers to questions about a named thing (UN region, feature function, office selection). Mzizi's code checks the scheme's scopes and one-answer rule."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "identity.classifications"

    class_term: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_id: UUID
    scheme_id: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
