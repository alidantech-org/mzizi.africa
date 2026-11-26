"""Geometry Role: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class GeometryRole(StrEnum):
    CENTRELINE = "centreline"
    CENTROID = "centroid"
    CLAIMED_OUTLINE = "claimed-outline"
    LABEL_POINT = "label-point"
    OUTLINE = "outline"
    POINT = "point"
