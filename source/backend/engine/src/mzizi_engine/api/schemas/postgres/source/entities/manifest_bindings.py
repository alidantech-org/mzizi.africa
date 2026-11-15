"""Manifest Bindings: one row of manifest_bindings."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ManifestBindingsRow(BaseModel):
    """Dated release binding; activation never changes releases already pinned by running jobs."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.manifest_bindings"

    activated_at: datetime
    created_at: datetime
    deactivated_at: datetime | None = None
    deleted_at: datetime | None = None
    effective_from: datetime
    effective_until: datetime | None = None
    id: UUID
    manifest_release_id: UUID
    source_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
