"""Quality findings on a translation. Heuristics for review triage, not a verdict."""

from __future__ import annotations

from mzizi_patterns.features.tokenise.tokenise import normalise, words
from mzizi_translation.features.glossary.glossary import Glossary
from mzizi_translation.features.protect.protect import protected_spans
from mzizi_translation.shared.contracts import Flag

LENGTH_RANGE = (0.4, 3.5)
SENTENCE_END = ".;:!?)”\"'"


def similarity(a: str, b: str) -> float:
    """Share of distinct word tokens two texts have in common (Jaccard)."""
    left, right = set(words(a)), set(words(b))
    return len(left & right) / len(left | right) if left | right else 1.0


def _digit_tokens(text: str) -> list[str]:
    return sorted(normalise(text[a:b]) for a, b in protected_spans(text) if any(c.isdigit() for c in text[a:b]))


def check(
    source: str, output: str, protected: tuple[str, ...], glossary: Glossary | None, context: str = ""
) -> tuple[Flag, ...]:
    flags: list[Flag] = []
    if not output.strip():
        return (Flag.EMPTY,)
    if normalise(output) == normalise(source) and len(words(source)) >= 3:
        flags.append(Flag.UNTRANSLATED)
    ratio = len(output) / max(len(source), 1)
    if not LENGTH_RANGE[0] <= ratio <= LENGTH_RANGE[1] and len(source) > 12:
        flags.append(Flag.LENGTH)
    if source.rstrip()[-1:] in SENTENCE_END and output.rstrip()[-1:] not in SENTENCE_END:
        flags.append(Flag.TRUNCATED)
    if _digit_tokens(source) != _digit_tokens(output):
        flags.append(Flag.NUMBERS_CHANGED)
    if any(p not in output for p in protected):
        flags.append(Flag.PLACEHOLDER_LOST)
    if glossary is not None:
        src_words = " ".join(words(source))
        out_words = " ".join(words(output))
        if any(
            f" {' '.join(words(e.source))} " in f" {src_words} "
            and f" {' '.join(words(e.target))} " not in f" {out_words} "
            for e in glossary.resolve(context).values()
        ):
            flags.append(Flag.GLOSSARY_MISSED)
    return tuple(flags)
