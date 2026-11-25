"""Figure Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FigureStatus(StrEnum):
    ESTIMATED = "estimated"
    FINAL = "final"
    MISSING = "missing"
    PROJECTED = "projected"
    PROVISIONAL = "provisional"
    REVISED = "revised"
    SUPPRESSED = "suppressed"
