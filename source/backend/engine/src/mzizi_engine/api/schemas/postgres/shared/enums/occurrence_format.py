"""Occurrence Format: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class OccurrenceFormat(StrEnum):
    HYBRID = "hybrid"
    IN_PERSON = "in-person"
    ONLINE = "online"
