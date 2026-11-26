"""Instrument Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class InstrumentStatus(StrEnum):
    IN_FORCE = "in-force"
    PENDING = "pending"
    REPEALED = "repealed"
