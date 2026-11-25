"""Aggregation: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Aggregation(StrEnum):
    MEAN = "mean"
    NONE = "none"
    SUM = "sum"
    WEIGHTED = "weighted"
