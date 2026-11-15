"""Account Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AccountStatus(StrEnum):
    ACTIVE = "active"
    CLOSED = "closed"
    SUSPENDED = "suspended"
