"""Jurisdiction Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class JurisdictionKind(StrEnum):
    APPELLATE = "appellate"
    SUBJECT_MATTER = "subject-matter"
    TERRITORIAL = "territorial"
