"""Term Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TermStatus(StrEnum):
    ACTIVE = "active"
    DEPRECATED = "deprecated"
    RETIRED = "retired"
