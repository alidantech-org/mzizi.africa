"""Sort Direction: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class SortDirection(StrEnum):
    ASCENDING = "asc"
    DESCENDING = "desc"
