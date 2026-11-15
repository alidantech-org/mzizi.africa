"""Job Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class JobStatus(StrEnum):
    CANCELLED = "cancelled"
    FAILED = "failed"
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
