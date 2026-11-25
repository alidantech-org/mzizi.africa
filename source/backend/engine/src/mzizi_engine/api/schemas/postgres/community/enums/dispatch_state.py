"""Dispatch State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class DispatchState(StrEnum):
    FAILED = "failed"
    OPENED = "opened"
    QUEUED = "queued"
    SENT = "sent"
