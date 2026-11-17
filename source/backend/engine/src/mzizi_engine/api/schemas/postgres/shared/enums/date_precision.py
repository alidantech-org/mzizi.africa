"""Date Precision: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class DatePrecision(StrEnum):
    APPROXIMATE = "approximate"
    END_APPROXIMATE = "end-approximate"
    EXACT = "exact"
    START_APPROXIMATE = "start-approximate"
    UNKNOWN = "unknown"
