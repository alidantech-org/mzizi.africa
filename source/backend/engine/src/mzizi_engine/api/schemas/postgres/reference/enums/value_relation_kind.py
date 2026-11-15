"""Value Relation Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ValueRelationKind(StrEnum):
    BROADER_THAN = "broader_than"
    NARROWER_THAN = "narrower_than"
    RELATED_TO = "related_to"
