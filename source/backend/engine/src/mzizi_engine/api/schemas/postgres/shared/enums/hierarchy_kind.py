"""Hierarchy Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class HierarchyKind(StrEnum):
    ADMINISTRATIVE = "administrative"
    ELECTORAL = "electoral"
    STATISTICAL = "statistical"
    TRADITIONAL = "traditional"
