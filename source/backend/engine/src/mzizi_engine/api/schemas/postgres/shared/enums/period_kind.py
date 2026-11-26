"""Period Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PeriodKind(StrEnum):
    FISCAL_YEAR = "fiscal-year"
    MONTH = "month"
    QUARTER = "quarter"
