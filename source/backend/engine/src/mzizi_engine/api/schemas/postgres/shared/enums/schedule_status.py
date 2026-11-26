"""Schedule Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ScheduleStatus(StrEnum):
    DRAFT = "draft"
    EXPECTED = "expected"
    PUBLISHED = "published"
    SUPERSEDED = "superseded"
