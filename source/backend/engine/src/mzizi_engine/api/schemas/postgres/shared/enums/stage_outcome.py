"""Stage Outcome: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class StageOutcome(StrEnum):
    DEFERRED = "deferred"
    PASSED = "passed"
    REJECTED = "rejected"
