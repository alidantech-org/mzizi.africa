"""A term glossary built from translations that already exist, so the same term is translated the same way everywhere.

Short aligned pairs (a heading, a label, a defined term) are terms in their own right. An entry belongs to a context (a dotted
code such as a vocabulary scheme or a message-key prefix) and applies to texts in that context or below it. A term that has the
same translation in every context also gets a context-free entry; a term that does not is a conflict and gets none, so an
ambiguous word is never applied outside the contexts that settled it. Several translations in one context: the most frequent
wins and the others are listed as conflicts for a person to settle.
"""

from __future__ import annotations

from collections import Counter

from pydantic import Field

from mzizi_patterns.features.tokenise.tokenise import normalise, words
from mzizi_translation.shared.contracts import Frozen, Pair


class GlossaryEntry(Frozen):
    source: str
    target: str
    count: int
    #: Where the entry applies: this context and those below it. Empty means everywhere.
    context: str = ""


def _applies(entry_context: str, context: str) -> bool:
    return entry_context == "" or context == entry_context or context.startswith(entry_context + ".")


class Glossary(Frozen):
    entries: tuple[GlossaryEntry, ...] = ()
    conflicts: tuple[str, ...] = ()
    longest_term: int = Field(default=1, ge=1)

    def resolve(self, context: str) -> dict[str, GlossaryEntry]:
        """The entry that applies to each term in `context`: the most specific context wins."""
        best: dict[str, GlossaryEntry] = {}
        for e in self.entries:
            if _applies(e.context, context):
                key = normalise(" ".join(e.source.split()))
                if key not in best or len(e.context) > len(best[key].context):
                    best[key] = e
        return best

    def table(self, context: str = "") -> dict[str, str]:
        return {e.source: e.target for e in self.resolve(context).values()}


def build_glossary(pairs: list[Pair], *, max_words: int, min_count: int = 1) -> Glossary:
    """Terms of at most `max_words` words, taken from pairs that are themselves that short."""
    votes: dict[str, dict[str, Counter[str]]] = {}
    spelling: dict[str, str] = {}
    for pair in pairs:
        n = len(words(pair.source))
        if not pair.target.strip() or not 0 < n <= max_words:
            continue
        key = normalise(" ".join(pair.source.split()))
        spelling.setdefault(key, " ".join(pair.source.split()))
        votes.setdefault(key, {}).setdefault(pair.context, Counter())[" ".join(pair.target.split())] += 1
    entries: list[GlossaryEntry] = []
    conflicts: list[str] = []
    for key, by_context in votes.items():
        for context, counter in by_context.items():
            (best, count), *rest = counter.most_common()
            if count >= min_count:
                entries.append(GlossaryEntry(source=spelling[key], target=best, count=count, context=context))
            if rest:
                conflicts.append(f"{spelling[key]} [{context or '-'}]: {', '.join([best, *(t for t, _ in rest)])}")
        winners = {c.most_common(1)[0][0] for c in by_context.values()}
        total = sum(sum(c.values()) for c in by_context.values())
        if len(winners) == 1 and "" not in by_context and total >= min_count:
            entries.append(GlossaryEntry(source=spelling[key], target=next(iter(winners)), count=total, context=""))
        elif len(winners) > 1:
            conflicts.append(f"{spelling[key]}: differs by context ({', '.join(sorted(winners))})")
    entries.sort(key=lambda e: (-len(words(e.source)), e.source, e.context))
    return Glossary(
        entries=tuple(entries),
        conflicts=tuple(sorted(set(conflicts))),
        longest_term=max((len(words(e.source)) for e in entries), default=1),
    )
