"""Occurrence Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class OccurrenceStatus(StrEnum):
    CANCELLED = "cancelled"
    EXPECTED = "expected"
    HELD = "held"
    POSTPONED = "postponed"
    SCHEDULED = "scheduled"
