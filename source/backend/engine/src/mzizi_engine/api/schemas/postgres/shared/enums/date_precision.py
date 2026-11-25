"""Date Precision: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class DatePrecision(StrEnum):
    CIRCA = "circa"
    DAY = "day"
    DECADE = "decade"
    MONTH = "month"
    YEAR = "year"
