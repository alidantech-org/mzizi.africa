"""Project Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ProjectStatus(StrEnum):
    ABANDONED = "abandoned"
    COMPLETE = "complete"
    ONGOING = "ongoing"
    PLANNED = "planned"
    STALLED = "stalled"
