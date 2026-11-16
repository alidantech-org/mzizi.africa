"""Basis Relation: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class BasisRelation(StrEnum):
    DEFINED_BY = "defined-by"
    DERIVES_FROM = "derives-from"
    ESTABLISHED_BY = "established-by"
    GOVERNED_BY = "governed-by"
    IMPLEMENTS = "implements"
    LIMITED_BY = "limited-by"
