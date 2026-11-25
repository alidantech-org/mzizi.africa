"""Figure Basis: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FigureBasis(StrEnum):
    AGGREGATED = "aggregated"
    ESTIMATED = "estimated"
    MEASURED = "measured"
    MODELLED = "modelled"
    PROJECTED = "projected"
