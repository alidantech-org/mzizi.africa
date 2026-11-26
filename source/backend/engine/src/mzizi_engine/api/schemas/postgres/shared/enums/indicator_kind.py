"""Indicator Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class IndicatorKind(StrEnum):
    AMOUNT = "amount"
    COUNT = "count"
    CURRENCY = "currency"
    INDEX = "index"
    OTHER = "other"
    PERCENT = "percent"
    RATE = "rate"
    RATIO = "ratio"
    SHARE = "share"
