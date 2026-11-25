"""Languages: one row of languages."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class LanguagesRow(BaseModel):
    """The language registry. Every text in the database points here; `und`, `mul` and `zxx` say what a missing language cannot, and a missing language never means English."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.languages"

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
    direction_term: UUID | None = None
    family_term: UUID | None = None
    glottocode: Annotated[str, Field(min_length=8, max_length=8, pattern="^[a-z]{4}[0-9]{4}$")] | None = None
    id: UUID
    identity_kind: IdentityKind
    iso6391: Annotated[str, Field(min_length=2, max_length=2, pattern="^[a-z]{2}$")] | None = None
    iso6392: Annotated[str, Field(min_length=3, max_length=3, pattern="^[a-z]{3}$")] | None = None
    iso6393: Annotated[str, Field(min_length=3, max_length=3, pattern="^[a-z]{3}$")] | None = None
    kind_term: UUID
    parent_id: UUID | None = None
    script_term: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    vitality_term: UUID | None = None
