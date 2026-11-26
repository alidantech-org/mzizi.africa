"""Place Relation: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PlaceRelation(StrEnum):
    BORDERS = "borders"
    CONNECTS = "connects"
    FLOWS_THROUGH = "flows-through"
    INSIDE = "inside"
    LOCATED_ON = "located-on"
    PART_OF = "part-of"
    REPLACED_BY = "replaced-by"
