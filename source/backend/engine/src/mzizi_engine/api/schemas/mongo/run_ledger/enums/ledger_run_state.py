"""Ledger Run State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LedgerRunState(StrEnum):
    APPROVED = "approved"
    CANCELLED = "cancelled"
    CHECKING = "checking"
    COMPLETED = "completed"
    EXPIRED = "expired"
    EXPIRING = "expiring"
    FAILED = "failed"
    LEASED = "leased"
    PARTIAL = "partial"
    PROMOTED = "promoted"
    QUEUED = "queued"
    REJECTED = "rejected"
    SEALED = "sealed"
    WORKING = "working"
