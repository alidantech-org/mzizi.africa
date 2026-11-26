"""Contribution Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ContributionStatus(StrEnum):
    DECLARED = "declared"
    DISPUTED = "disputed"
    REPORTED = "reported"
