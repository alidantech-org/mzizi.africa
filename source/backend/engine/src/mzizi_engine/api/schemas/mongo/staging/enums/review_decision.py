"""Review Decision: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReviewDecision(StrEnum):
    APPROVE = "approve"
    DEFER = "defer"
    REJECT = "reject"
