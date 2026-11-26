"""Facility Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FacilityStatus(StrEnum):
    CLOSED = "closed"
    OPERATIONAL = "operational"
    UNDER_CONSTRUCTION = "under-construction"
