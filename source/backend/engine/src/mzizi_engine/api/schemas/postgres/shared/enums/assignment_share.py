"""Assignment Share: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AssignmentShare(StrEnum):
    CONCURRENT = "concurrent"
    EXCLUSIVE = "exclusive"
