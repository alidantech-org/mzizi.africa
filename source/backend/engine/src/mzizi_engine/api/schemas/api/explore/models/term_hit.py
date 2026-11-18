"""Term Hit"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class TermHit(BaseModel):
    """Term Hit"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    domain: Annotated[str, Field(min_length=1, max_length=80)] = Field(alias="domain")
    group: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="group")
    surface: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="surface")
    term: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="term")
