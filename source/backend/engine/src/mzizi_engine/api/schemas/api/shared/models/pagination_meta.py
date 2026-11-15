"""Pagination Meta"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class PaginationMeta(BaseModel):
    """Pagination Meta"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    limit: Annotated[int, Field(ge=0)] = Field(alias="limit")
    page: Annotated[int, Field(ge=0)] = Field(alias="page")
    total: Annotated[int, Field(ge=0)] = Field(alias="total")
    total_pages: Annotated[int, Field(ge=0)] = Field(alias="totalPages")
