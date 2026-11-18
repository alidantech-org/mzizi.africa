"""Term Group"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class TermGroup(BaseModel):
    """Term Group"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    domain: Annotated[str, Field(min_length=1, max_length=80)] = Field(alias="domain")
    group: Annotated[str, Field(min_length=1, max_length=500)] = Field(alias="group")
    label: Annotated[str, Field(max_length=4000000)] = Field(alias="label")
    terms: list[Annotated[str, Field(min_length=1, max_length=500)]] = Field(alias="terms")
