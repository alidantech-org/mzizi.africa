"""Finding Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FindingStatus(StrEnum):
    OPEN = "open"
    REFERRED = "referred"
    RESOLVED = "resolved"
