"""Actor Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ActorStatus(StrEnum):
    ACTIVE = "active"
    BLOCKED = "blocked"
    CLOSED = "closed"
