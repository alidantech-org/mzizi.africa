"""Geometry Basis: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class GeometryBasis(StrEnum):
    APPROXIMATE = "approximate"
    DERIVED = "derived"
    DIGITISED = "digitised"
    ILLUSTRATIVE = "illustrative"
    RECONSTRUCTED = "reconstructed"
    SURVEYED = "surveyed"
    TRADITIONAL_CLAIM = "traditional-claim"
