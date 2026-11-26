"""Dispute Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class DisputeStatus(StrEnum):
    OPEN = "open"
    RESOLVED = "resolved"
    UNRESOLVABLE = "unresolvable"
