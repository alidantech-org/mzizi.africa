"""Review Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReviewStatus(StrEnum):
    ACCEPTED = "accepted"
    PROPOSED = "proposed"
    REJECTED = "rejected"
    REVIEWED = "reviewed"
