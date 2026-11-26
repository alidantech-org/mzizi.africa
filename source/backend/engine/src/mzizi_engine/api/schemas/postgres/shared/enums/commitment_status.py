"""Commitment Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CommitmentStatus(StrEnum):
    BROKEN = "broken"
    FULFILLED = "fulfilled"
    IN_PROGRESS = "in-progress"
    NOT_STARTED = "not-started"
