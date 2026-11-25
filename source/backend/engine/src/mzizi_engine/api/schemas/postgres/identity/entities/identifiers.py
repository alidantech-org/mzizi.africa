"""Identifiers: one row of identifiers."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class IdentifiersRow(BaseModel):
    """Public identifiers of named things (ISO codes, IEBC codes, Wikidata ids, registration numbers). Personal identifiers such as national ID numbers are never stored."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "identity.identifiers"

    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_id: UUID
    identity_kind: IdentityKind
    issuer_id: UUID | None = None
    namespace: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    scheme_term: UUID
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    value: Annotated[str, Field(min_length=1, max_length=500)]
    version: Annotated[int, Field(ge=1)]
