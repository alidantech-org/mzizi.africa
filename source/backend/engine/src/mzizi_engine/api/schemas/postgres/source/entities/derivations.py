"""Derivations: one row of derivations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DerivationsRow(BaseModel):
    """Lineage: which artifact, edition or file version was made from which."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.derivations"

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
    id: UUID
    input_artifact_id: UUID | None = None
    input_edition_id: UUID | None = None
    input_version_id: UUID | None = None
    kind_term: UUID
    method: Annotated[str, Field(max_length=4000)] | None = None
    output_artifact_id: UUID | None = None
    output_edition_id: UUID | None = None
    output_version_id: UUID | None = None
    run: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
