"""Language Name Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LanguageNameKind(StrEnum):
    ABBREVIATION = "abbreviation"
    ALTERNATIVE = "alternative"
    ENDONYM = "endonym"
    EXONYM = "exonym"
