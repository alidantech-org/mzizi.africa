"""Run Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class RunStatus(StrEnum):
    CANCELLED = "cancelled"
    FAILED = "failed"
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
