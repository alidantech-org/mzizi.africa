"""Base types for fetch contracts."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class Frozen(BaseModel):
    """Our own contracts: immutable, strictly typed, no unknown fields."""

    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class External(BaseModel):
    """Manifest-supplied data validated at the parsing edge: unknown keys are ignored (the schema owns them)."""

    model_config = ConfigDict(frozen=True, extra="ignore")
