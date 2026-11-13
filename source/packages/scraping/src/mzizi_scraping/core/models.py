"""Base types for scraping contracts."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class Frozen(BaseModel):
    """Our own contracts: immutable, strictly typed, no unknown fields."""

    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class External(BaseModel):
    """Manifest-supplied data validated at the parsing edge: immutable, unknown keys ignored (the schema owns them)."""

    model_config = ConfigDict(frozen=True, populate_by_name=True, extra="ignore")


class ScrapeError(ValueError):
    """A selector, transform or field could not be applied. Reported on the field, never guessed around."""
