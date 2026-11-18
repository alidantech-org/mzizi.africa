"""Tagged List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.tagged_text import TaggedText


class TaggedList(BaseModel):
    """Tagged List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    items: list[TaggedText] = Field(alias="items")
