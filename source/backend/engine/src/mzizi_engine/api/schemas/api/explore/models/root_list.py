"""Root List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.root_info import RootInfo


class RootList(BaseModel):
    """Root List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    roots: list[RootInfo] = Field(alias="roots")
