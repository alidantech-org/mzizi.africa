"""Language Name: one row of language_names."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.reference.enums.language_name_kind import LanguageNameKind


class LanguageNameRow(BaseModel):
    """A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.language_names"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    in_language_id: UUID
    language_id: UUID
    name: Annotated[str, Field(min_length=1, max_length=300)]
    name_kind: LanguageNameKind
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
