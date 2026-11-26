"""Station Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class StationStatus(StrEnum):
    CLOSED = "closed"
    GAZETTED = "gazetted"
    OPEN = "open"
    RELOCATED = "relocated"
