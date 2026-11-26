"""Geometry Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class GeometryStatus(StrEnum):
    DRAFT = "draft"
    ESTABLISHED = "established"
    EXPECTED = "expected"
