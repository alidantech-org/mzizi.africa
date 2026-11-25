"""Evidence Role: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class EvidenceRole(StrEnum):
    CONTRADICTS = "contradicts"
    ORIGIN = "origin"
    SUPPORTS = "supports"
