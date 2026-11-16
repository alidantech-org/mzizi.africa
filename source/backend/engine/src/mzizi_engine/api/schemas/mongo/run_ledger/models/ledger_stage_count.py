"""Ledger Stage Count"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class LedgerStageCount(BaseModel):
    """Ledger Stage Count"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    files: Annotated[int, Field(ge=0)] = Field(alias="files")
    stage: Annotated[str, Field(min_length=1)] = Field(alias="stage")
