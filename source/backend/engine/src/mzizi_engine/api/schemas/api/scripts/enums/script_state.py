"""Script State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ScriptState(StrEnum):
    CANCELLED = "cancelled"
    FAILED = "failed"
    INTERRUPTED = "interrupted"
    OUTPUT_LIMIT = "output_limit"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    TIMED_OUT = "timed_out"
