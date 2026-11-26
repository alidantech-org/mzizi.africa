"""A table of known translations: curated sources (tier curated) or glossary terms (tier glossary)."""

from __future__ import annotations

from collections.abc import Mapping, Sequence

from mzizi_patterns.features.tokenise.tokenise import normalise
from mzizi_translation.shared.contracts import Tier


class LookupEngine:
    """Exact, case-insensitive whole-text lookup for one language pair."""

    def __init__(
        self, name: str, version: str, tier: Tier, source_language: str, target_language: str, table: Mapping[str, str]
    ) -> None:
        self.name, self.version, self.tier = name, version, tier
        self._pair = (source_language, target_language)
        self._table = {normalise(" ".join(k.split())): v for k, v in table.items() if v}

    def supports(self, source_language: str, target_language: str) -> bool:
        return (source_language, target_language) == self._pair

    def translate(self, texts: Sequence[str], source_language: str, target_language: str) -> list[str | None]:
        return [self._table.get(normalise(" ".join(t.split()))) for t in texts]
