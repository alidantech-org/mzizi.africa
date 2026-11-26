"""Report Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReportStatus(StrEnum):
    DUE = "due"
    FOUND_ELSEWHERE = "found-elsewhere"
    LATE = "late"
    MISSING = "missing"
    NOT_APPLICABLE = "not-applicable"
    ON_TIME = "on-time"
