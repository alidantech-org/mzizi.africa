"""Base types for engine policy contracts."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class Frozen(BaseModel):
    """Our own contracts: immutable, strictly typed, no unknown fields."""

    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class External(BaseModel):
    """Database-row or manifest data validated at the parsing edge: unknown keys are ignored."""

    model_config = ConfigDict(frozen=True, populate_by_name=True, extra="ignore")
