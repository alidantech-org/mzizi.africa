"""Value Label: one row of value_labels."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.reference.enums.value_label_kind import ValueLabelKind


class ValueLabelRow(BaseModel):
    """A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.value_labels"

    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    label: Annotated[str, Field(min_length=1, max_length=300)]
    label_kind: ValueLabelKind
    language_tag: Annotated[str, Field(min_length=2, max_length=35)]
    updated_at: datetime
    valid_from: date | None = None
    valid_until: date | None = None
    value_id: UUID
    version: Annotated[int, Field(ge=1)]
