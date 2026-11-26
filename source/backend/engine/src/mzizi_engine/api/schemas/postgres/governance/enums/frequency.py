"""Frequency: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Frequency(StrEnum):
    ANNUAL = "annual"
    DAILY = "daily"
    IRREGULAR = "irregular"
    MONTHLY = "monthly"
    ON_EVENT = "on-event"
    PER_TERM = "per-term"
    QUARTERLY = "quarterly"
    WEEKLY = "weekly"
