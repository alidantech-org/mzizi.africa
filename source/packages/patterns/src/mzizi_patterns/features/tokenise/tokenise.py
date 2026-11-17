"""Turn text into comparable word tokens and phrases. No language knowledge: stop-words come from term lists."""

from __future__ import annotations

import unicodedata


def normalise(text: str) -> str:
    """Unicode-compatible lowercase text with accents kept and marks that only decorate removed."""
    return unicodedata.normalize("NFKC", text).casefold()


def words(text: str) -> list[str]:
    """Runs of letters, or runs of digits. 'ppf3' becomes 'ppf', '3'; 'x-3' becomes 'x', '3'."""
    out: list[str] = []
    current: list[str] = []
    kind = ""
    for char in normalise(text):
        category = "d" if char.isdigit() else "a" if char.isalpha() else ""
        if category and category == kind:
            current.append(char)
            continue
        if current:
            out.append("".join(current))
        current, kind = ([char], category) if category else ([], "")
    if current:
        out.append("".join(current))
    return out


def tokens(text: str, stopwords: frozenset[str] = frozenset()) -> list[str]:
    return [word for word in words(text) if word not in stopwords]


def phrases(sequence: list[str], longest: int) -> list[tuple[str, ...]]:
    """Every run of 1 to `longest` consecutive tokens."""
    return [tuple(sequence[i : i + n]) for n in range(1, longest + 1) for i in range(len(sequence) - n + 1)]
