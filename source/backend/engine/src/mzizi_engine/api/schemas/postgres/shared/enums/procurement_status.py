"""Procurement Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ProcurementStatus(StrEnum):
    AWARDED = "awarded"
    CANCELLED = "cancelled"
    EVALUATION = "evaluation"
    OPEN = "open"
    PLANNED = "planned"
