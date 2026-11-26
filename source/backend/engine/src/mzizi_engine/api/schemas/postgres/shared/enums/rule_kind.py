"""Rule Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class RuleKind(StrEnum):
    FIXED_DATE = "fixed-date"
    INTERVAL = "interval"
    NTH_WEEKDAY = "nth-weekday"
    RRULE = "rrule"
