"""Names of places and bodies: translate the marker words and keep the proper noun.

A name such as `Member of County Assembly, Central Nyakach` or `Kiambu County` is mostly a proper noun with a few marker
words (a kind of place or office, a direction). The rules are data for one language pair: phrases that translate whole
segments, heads that lead into a name, and single markers with the template that places them around the name. The engine
never translates the proper noun, and returns `None` for a name it changed nothing in, so a name that is only a proper noun
stays as it is. Rules are proposals: a reviewer settles them, and every result is tier glossary.
"""

from __future__ import annotations

from collections.abc import Sequence
from typing import Literal

from pydantic import Field

from mzizi_patterns.features.tokenise.tokenise import normalise
from mzizi_translation.shared.contracts import Frozen, Tier


class Marker(Frozen):
    target: str
    #: `prefix`: the marker leads the name (East X); `suffix`: it ends the name (X County); `either`: either end.
    position: Literal["prefix", "suffix", "either"]
    #: Where the target goes relative to the rest: `before` (Kaunti ya X), `after` (X Mashariki), `before-bare` (Mlima X).
    place: Literal["before", "after", "before-bare"]
    #: The word joining target and rest when `place` is `before` (the language's linker); empty when none.
    linker: str = ""


class MarkerRules(Frozen):
    source_language: str
    target_language: str
    #: Whole segments (between commas), lower case: `member of county assembly` -> `Mjumbe wa Bunge la Kaunti`.
    phrases: dict[str, str] = Field(default_factory=dict)
    #: Leading phrases followed by a name: `county government of` -> `Serikali ya Kaunti ya`.
    heads: dict[str, str] = Field(default_factory=dict)
    markers: dict[str, Marker] = Field(default_factory=dict)


def _capital(text: str, like: str) -> str:
    return text[:1].upper() + text[1:] if like[:1].isupper() else text


class MarkerEngine:
    tier = Tier.GLOSSARY

    def __init__(self, name: str, version: str, rules: MarkerRules) -> None:
        self.name, self.version, self._rules = name, version, rules
        self._phrases = {normalise(k): v for k, v in rules.phrases.items()}
        self._heads = sorted(((normalise(k).split(), v) for k, v in rules.heads.items()), key=lambda h: -len(h[0]))
        self._markers = {normalise(k): v for k, v in rules.markers.items()}

    def supports(self, source_language: str, target_language: str) -> bool:
        return (source_language, target_language) == (self._rules.source_language, self._rules.target_language)

    def _segment(self, segment: str) -> str:
        text = " ".join(segment.split())
        whole = self._phrases.get(normalise(text))
        if whole is not None:
            return whole
        tokens = text.split(" ")
        keys = [normalise(t) for t in tokens]
        for head, target in self._heads:
            if keys[: len(head)] == head and len(tokens) > len(head):
                return f"{target} {' '.join(tokens[len(head) :])}"
        first, last = self._markers.get(keys[0]), self._markers.get(keys[-1])
        if len(tokens) > 1 and first is not None and first.position in ("prefix", "either"):
            return self._place(first, " ".join(tokens[1:]), tokens[0])
        if len(tokens) > 1 and last is not None and last.position in ("suffix", "either"):
            return self._place(last, " ".join(tokens[:-1]), tokens[-1])
        return text

    def _place(self, marker: Marker, rest: str, original: str) -> str:
        lone = self._markers.get(normalise(rest))
        if lone is not None and " " not in rest:
            rest = _capital(lone.target, rest)  # `Central Ward`: the rest is itself a marker word, so it is a noun here
        if marker.place == "after":
            return f"{rest} {marker.target}"
        word = _capital(marker.target, original)
        return f"{word} {marker.linker} {rest}" if marker.place == "before" and marker.linker else f"{word} {rest}"

    def translate(self, texts: Sequence[str], source_language: str, target_language: str) -> list[str | None]:
        out: list[str | None] = []
        for text in texts:
            result = ", ".join(self._segment(part) for part in text.split(","))
            out.append(result if result != text else None)
        return out
