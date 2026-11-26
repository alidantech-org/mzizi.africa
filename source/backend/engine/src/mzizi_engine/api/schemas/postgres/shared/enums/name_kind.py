"""Name Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class NameKind(StrEnum):
    ABBREVIATION = "abbreviation"
    ALTERNATIVE = "alternative"
    DEFINITION = "definition"
    HISTORICAL = "historical"
    LOCAL = "local"
    OFFICIAL = "official"
    PREFERRED = "preferred"
    SHORT = "short"
    TRANSLITERATION = "transliteration"
