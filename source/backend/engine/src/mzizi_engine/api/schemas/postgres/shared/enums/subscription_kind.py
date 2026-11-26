"""Subscription Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class SubscriptionKind(StrEnum):
    ALERTS = "alerts"
    FOLLOW = "follow"
