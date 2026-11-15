"""Places: one row of places."""

from __future__ import annotations

from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PlacesRow(BaseModel):
    """Optional physical-place attributes for a feature; does not create a separate identity."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "geography.places"

    feature_id: UUID
    is_inhabited: bool | None = None
