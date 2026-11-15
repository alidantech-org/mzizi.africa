"""Health State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class HealthState(StrEnum):
    DEGRADED = "degraded"
    DOWN = "down"
    OK = "ok"
