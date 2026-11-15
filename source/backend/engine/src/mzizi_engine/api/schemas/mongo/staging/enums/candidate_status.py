"""Candidate Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CandidateStatus(StrEnum):
    APPLIED = "applied"
    APPROVED = "approved"
    IN_REVIEW = "in-review"
    PROPOSED = "proposed"
    REJECTED = "rejected"
