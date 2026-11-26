"""Occurrence Change: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class OccurrenceChange(StrEnum):
    BROUGHT_FORWARD = "brought-forward"
    CANCELLED = "cancelled"
    MOVED = "moved"
    POSTPONED = "postponed"
