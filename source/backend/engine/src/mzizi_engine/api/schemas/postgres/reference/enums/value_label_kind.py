"""Value Label Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ValueLabelKind(StrEnum):
    ABBREVIATION = "abbreviation"
    ALTERNATIVE = "alternative"
    DEFINITION = "definition"
    PREFERRED = "preferred"
