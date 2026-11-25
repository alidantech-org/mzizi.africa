"""Scopes: one row of scopes."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind


class VocabularyScopesRow(BaseModel):
    """Which kinds of named thing a scheme may classify."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "vocabulary.scopes"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_kind: IdentityKind
    scheme_id: UUID
