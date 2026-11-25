"""Preferences: one row of preferences."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.theme_choice import ThemeChoice


class PreferencesRow(BaseModel):
    """An actor's saved country, language, theme and home place."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.preferences"

    actor_id: UUID
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    home_feature_id: UUID | None = None
    id: UUID
    language_id: UUID | None = None
    theme: ThemeChoice | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
