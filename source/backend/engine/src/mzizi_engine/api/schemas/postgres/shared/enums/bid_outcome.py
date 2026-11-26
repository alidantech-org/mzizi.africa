"""Bid Outcome: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class BidOutcome(StrEnum):
    DISQUALIFIED = "disqualified"
    LOST = "lost"
    WITHDRAWN = "withdrawn"
    WON = "won"
