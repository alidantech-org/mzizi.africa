"""Term Group List"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.explore.models.term_group import TermGroup


class TermGroupList(BaseModel):
    """Term Group List"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    groups: list[TermGroup] = Field(alias="groups")
