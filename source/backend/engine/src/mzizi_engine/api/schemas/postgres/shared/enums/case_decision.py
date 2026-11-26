"""Case Decision: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CaseDecision(StrEnum):
    APPROVE = "approve"
    ESCALATE = "escalate"
    REJECT = "reject"
    REMOVE = "remove"
