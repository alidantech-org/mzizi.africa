"""Release Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReleaseStatus(StrEnum):
    LIVE = "live"
    PAUSED = "paused"
    PREPARING = "preparing"
    WITHDRAWN = "withdrawn"
