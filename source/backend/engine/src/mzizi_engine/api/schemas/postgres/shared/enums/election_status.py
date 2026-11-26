"""Election Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ElectionStatus(StrEnum):
    ANNULLED = "annulled"
    HELD = "held"
    SCHEDULED = "scheduled"
