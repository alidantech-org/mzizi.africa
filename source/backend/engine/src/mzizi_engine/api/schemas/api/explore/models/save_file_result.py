"""Save File Result"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class SaveFileResult(BaseModel):
    """Save File Result"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    path: Annotated[str, Field(max_length=2000)] = Field(alias="path")
