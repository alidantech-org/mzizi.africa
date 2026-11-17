"""Load term lists and index their phrases for exact, token-aligned lookup."""

from __future__ import annotations

from pathlib import Path

import yaml

from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import Profile, TermList

type Phrase = tuple[str, ...]


def load_term_list(path: Path) -> TermList:
    return TermList.model_validate(yaml.safe_load(path.read_text(encoding="utf-8")), strict=False)


def load_profile(path: Path) -> Profile:
    return Profile.model_validate(yaml.safe_load(path.read_text(encoding="utf-8")), strict=False)


def phrase_index(lists: tuple[TermList, ...]) -> dict[Phrase, str]:
    """Each phrase (a term or alias split into tokens) points to the canonical term it stands for."""
    index: dict[Phrase, str] = {}
    for term_list in lists:
        for entry in term_list.terms:
            for surface in (entry.value, *entry.aliases):
                phrase = tuple(words(surface))
                if phrase:
                    index.setdefault(phrase, entry.value)
    return index
