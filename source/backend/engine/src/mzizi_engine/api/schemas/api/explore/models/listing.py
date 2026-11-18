"""Listing"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.entry import Entry


class Listing(BaseModel):
    """Listing"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    entries: list[Entry] = Field(alias="entries")
    parent: Annotated[str, Field(max_length=2000)] | None = Field(default=None, alias="parent")
    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
    root: Annotated[str, Field(min_length=1, max_length=40)] = Field(alias="root")
