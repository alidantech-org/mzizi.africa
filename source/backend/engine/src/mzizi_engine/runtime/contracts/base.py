"""The base type of every runtime contract: immutable, strictly typed, no unknown fields."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")
