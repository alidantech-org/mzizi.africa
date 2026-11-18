"""Tagged Text"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.term_hit import TermHit


class TaggedText(BaseModel):
    """Tagged Text"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    hits: list[TermHit] = Field(alias="hits")
    text: Annotated[str, Field(max_length=4000000)] = Field(alias="text")
