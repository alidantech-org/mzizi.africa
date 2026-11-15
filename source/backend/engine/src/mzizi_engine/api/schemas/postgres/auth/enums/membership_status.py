"""Membership Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class MembershipStatus(StrEnum):
    ACTIVE = "active"
    EXPIRED = "expired"
    PENDING = "pending"
    REVOKED = "revoked"
    SUSPENDED = "suspended"
