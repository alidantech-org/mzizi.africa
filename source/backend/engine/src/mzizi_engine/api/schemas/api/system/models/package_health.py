"""Package Health"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class PackageHealth(BaseModel):
    """Package Health"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    exposure: Annotated[str, Field(max_length=1000)] = Field(alias="exposure")
    in_flight: int = Field(alias="inFlight")
    max_concurrency: int = Field(alias="maxConcurrency")
    name: Annotated[str, Field(max_length=1000)] = Field(alias="name")
