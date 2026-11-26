"""Count Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CountKind(StrEnum):
    EXACT = "exact"
    MAXIMUM = "maximum"
    MINIMUM = "minimum"
    RANGE = "range"
