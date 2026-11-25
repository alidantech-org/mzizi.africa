"""Scheme Shape: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class SchemeShape(StrEnum):
    FLAT = "flat"
    GRAPH = "graph"
    TREE = "tree"
