"""Revision Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class RevisionStatus(StrEnum):
    APPROVED = "approved"
    ENACTED = "enacted"
    PROPOSED = "proposed"
