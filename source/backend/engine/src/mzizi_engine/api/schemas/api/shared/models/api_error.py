"""Api Error"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class ApiError(BaseModel):
    """Api Error"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    code: Annotated[str, Field(min_length=1, max_length=100)] | None = Field(default=None, alias="code")
    message: Annotated[str, Field(min_length=1, max_length=2000)] = Field(alias="message")
