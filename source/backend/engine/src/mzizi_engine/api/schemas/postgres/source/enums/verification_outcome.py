"""Verification Outcome: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class VerificationOutcome(StrEnum):
    CONTRADICTED = "contradicted"
    DISPUTED = "disputed"
    INSUFFICIENT = "insufficient"
    SUPPORTED = "supported"
