"""Score Basis: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ScoreBasis(StrEnum):
    CONTRACTS = "contracts"
    MODELLED = "modelled"
    STANDARD_COST = "standard-cost"
    SURVEY = "survey"
