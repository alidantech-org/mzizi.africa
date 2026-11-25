"""Frequency: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Frequency(StrEnum):
    ANNUAL = "annual"
    DECENNIAL = "decennial"
    INTERCENSAL = "intercensal"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
