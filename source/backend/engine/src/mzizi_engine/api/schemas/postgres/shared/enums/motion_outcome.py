"""Motion Outcome: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class MotionOutcome(StrEnum):
    CARRIED = "carried"
    NEGATIVED = "negatived"
    WITHDRAWN = "withdrawn"
