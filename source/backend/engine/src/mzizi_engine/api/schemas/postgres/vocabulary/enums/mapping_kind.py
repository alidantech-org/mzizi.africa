"""Mapping Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class MappingKind(StrEnum):
    BROADER = "broader"
    CLOSE = "close"
    EXACT = "exact"
    NARROWER = "narrower"
    RELATED = "related"
