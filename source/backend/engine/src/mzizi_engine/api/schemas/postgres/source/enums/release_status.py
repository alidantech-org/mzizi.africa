"""Release Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReleaseStatus(StrEnum):
    APPROVED = "approved"
    RETIRED = "retired"
    WITHDRAWN = "withdrawn"
