"""Price Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PriceKind(StrEnum):
    CONTRACT = "contract"
    FARM_GATE = "farm-gate"
    MODELLED = "modelled"
    RETAIL = "retail"
    STANDARD_COST = "standard-cost"
    WHOLESALE = "wholesale"
