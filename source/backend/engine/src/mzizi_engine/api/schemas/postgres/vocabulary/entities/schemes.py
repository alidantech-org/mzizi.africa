"""Schemes: one row of schemes."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.vocabulary.enums.scheme_answers import SchemeAnswers
from mzizi_engine.api.schemas.postgres.vocabulary.enums.scheme_shape import SchemeShape


class SchemesRow(BaseModel):
    """A controlled list such as feature kind, institution arm, topic, sex or age group. Its words are `vocabulary.labels`; it holds no display text."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "vocabulary.schemes"

    answers: SchemeAnswers
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    is_dated: bool
    is_open: bool
    shape: SchemeShape
    steward_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
