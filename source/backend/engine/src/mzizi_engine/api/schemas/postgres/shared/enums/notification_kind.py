"""Notification Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class NotificationKind(StrEnum):
    EVENT_REMINDER = "event-reminder"
    NEW_FIGURE = "new-figure"
    REPLY = "reply"
