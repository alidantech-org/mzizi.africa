"""Lineage Role: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LineageRole(StrEnum):
    DERIVED = "derived"
    LOOKUP = "lookup"
    RAW = "raw"
