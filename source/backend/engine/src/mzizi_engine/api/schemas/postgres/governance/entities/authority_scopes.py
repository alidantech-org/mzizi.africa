"""Authority Scopes: one row of authority_scopes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AuthorityScopesRow(BaseModel):
    """One institution or office authority over a required Geography unit for an effective period."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.authority_scopes"

    authority_kind_id: UUID
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    institution_id: UUID | None = None
    office_id: UUID | None = None
    source_citation_id: UUID | None = None
    unit_feature_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
