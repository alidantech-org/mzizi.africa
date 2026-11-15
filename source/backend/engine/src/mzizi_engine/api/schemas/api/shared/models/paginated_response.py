"""Paginated Response"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.shared.models.pagination_meta import PaginationMeta


class PaginatedResponse(BaseModel):
    """Paginated Response"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    meta: PaginationMeta = Field(alias="meta")
