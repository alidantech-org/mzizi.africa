"""Labels: one row of labels."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.vocabulary.enums.label_kind import LabelKind


class LabelsRow(BaseModel):
    """Every word for a term or scheme, per language and optional country. Labels have no dates; a changed meaning is a new term."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "vocabulary.labels"

    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    kind: LabelKind
    language_id: UUID
    scheme_id: UUID | None = None
    term_id: UUID | None = None
    text: Annotated[str, Field(min_length=1, max_length=1000)]
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
