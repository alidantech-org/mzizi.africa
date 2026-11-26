"""Texts: one row of texts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.name_kind import NameKind
from mzizi_engine.api.schemas.postgres.template.enums.text_purpose import TextPurpose


class TemplateTextsRow(BaseModel):
    """A text template for a code, a name per language, a web domain or a contact value."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "template.texts"

    body: Annotated[str, Field(min_length=1, max_length=1000)]
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    language_id: UUID | None = None
    name_kind: NameKind | None = None
    purpose: TextPurpose
    template_id: UUID
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
