"""Audit Decision: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AuditDecision(StrEnum):
    APPROVE = "approve"
    REJECT = "reject"
    REQUEST_CHANGES = "request_changes"
