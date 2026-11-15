"""Appropriations: one row of appropriations."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AppropriationsRow(BaseModel):
    """One classified amount authorized in a budget version, optionally nested and assigned to a project or unit."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "finance.appropriations"

    amount_minor_units: Annotated[int, Field(ge=0)]
    budget_version_id: UUID
    classification_id: UUID
    code: Annotated[
        str, Field(min_length=1, max_length=255, pattern="^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$")
    ]
    created_at: datetime
    currency_id: UUID
    deleted_at: datetime | None = None
    id: UUID
    parent_appropriation_id: UUID | None = None
    project_id: UUID | None = None
    recipient_entity_id: UUID | None = None
    source_citation_id: UUID | None = None
    unit_feature_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
