"""Case State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CaseState(StrEnum):
    DECIDED = "decided"
    ESCALATED = "escalated"
    IN_REVIEW = "in-review"
    OPEN = "open"
