"""Availability: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Availability(StrEnum):
    LIVE = "live"
    REMOVED = "removed"
    UNAVAILABLE = "unavailable"
