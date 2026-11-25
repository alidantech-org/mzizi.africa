"""Crosswalk Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CrosswalkKind(StrEnum):
    EXACT = "exact"
    PARTIAL = "partial"
