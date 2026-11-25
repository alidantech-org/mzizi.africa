"""Good Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class GoodKind(StrEnum):
    GOOD = "good"
    SERVICE = "service"
    WORKS = "works"
