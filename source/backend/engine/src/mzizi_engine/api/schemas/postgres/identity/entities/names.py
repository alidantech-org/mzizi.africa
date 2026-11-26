"""Names: one row of names."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind
from mzizi_engine.api.schemas.postgres.shared.enums.name_kind import NameKind


class IdentityNamesRow(BaseModel):
    """Display names of named things in every language, with kind, script and valid period. Where a name came from is recorded in `source.evidence`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "identity.names"

    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_id: UUID
    identity_kind: IdentityKind
    is_default: bool
    kind: NameKind
    language_id: UUID
    script_term: UUID | None = None
    text: Annotated[str, Field(min_length=1, max_length=1000)]
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
