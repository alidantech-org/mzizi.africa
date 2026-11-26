"""Domain Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class DomainStatus(StrEnum):
    EXPECTED = "expected"
    LIVE = "live"
    MOVED = "moved"
    RETIRED = "retired"
    UNREACHABLE = "unreachable"
