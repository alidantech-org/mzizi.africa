"""Fulfilment Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FulfilmentStatus(StrEnum):
    CLAIMED = "claimed"
    DISPUTED = "disputed"
    VERIFIED = "verified"
