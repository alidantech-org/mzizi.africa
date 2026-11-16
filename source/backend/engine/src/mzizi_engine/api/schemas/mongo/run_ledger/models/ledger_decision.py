"""Ledger Decision"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class LedgerDecision(BaseModel):
    """Ledger Decision"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    fetched: bool = Field(alias="fetched")
    reason: Annotated[str, Field(min_length=1)] = Field(alias="reason")
    score: float | None = Field(default=None, alias="score")
    source_url: Annotated[str, Field(min_length=1)] = Field(alias="sourceUrl")
