"""Candidate Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CandidateKind(StrEnum):
    BUDGET_LINE = "budget-line"
    CLAIM = "claim"
    HOLDER = "holder"
    INSTITUTION = "institution"
    MANDATE = "mandate"
    OFFICE = "office"
