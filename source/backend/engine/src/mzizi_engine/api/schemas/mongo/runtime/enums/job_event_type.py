"""Job Event Type: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class JobEventType(StrEnum):
    CANCELLED = "cancelled"
    FAILED = "failed"
    LOG = "log"
    PROGRESS = "progress"
    QUEUED = "queued"
    STARTED = "started"
    SUCCEEDED = "succeeded"
