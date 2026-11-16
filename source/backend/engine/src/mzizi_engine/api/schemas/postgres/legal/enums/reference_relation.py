"""Reference Relation: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReferenceRelation(StrEnum):
    AMENDS = "amends"
    AS_DEFINED_IN = "as-defined-in"
    IN_ACCORDANCE_WITH = "in-accordance-with"
    READ_WITH = "read-with"
    REFERS_TO = "refers-to"
    REPEALS = "repeals"
    SUBJECT_TO = "subject-to"
    UNDER = "under"
