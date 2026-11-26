"""Items: one row of items."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TemplateItemsRow(BaseModel):
    """One fixed list entry of a template with the list scope (the Article 250 commissions, the cabinet portfolios)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "template.items"

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
    key: Annotated[str, Field(min_length=1, max_length=100)]
    language_id: UUID
    name: Annotated[str, Field(min_length=1, max_length=255)]
    position: Annotated[int, Field(ge=0)]
    template_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
