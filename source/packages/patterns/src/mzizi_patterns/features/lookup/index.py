"""Find the known record a piece of text names: exact, key, trigram and edit-distance tiers, with words that name a kind
(county, town, limited) read as meaning.

The tiers mirror what the database offers (`pg_trgm` similarity, `fuzzystrmatch` edit distance, `unaccent`), so the index
built from seed CSVs behaves like the SQL lookup that replaces it once the data is loaded. Matches are proposals with the
tier and evidence that produced them; nothing here decides a merge."""

from __future__ import annotations

import re
import unicodedata
from collections import defaultdict
from dataclasses import dataclass, field

TRIGRAM_FLOOR = 0.45
EDIT_FLOOR = 0.8
KIND_AGREES = 0.97
KIND_UNKNOWN = 0.93
KIND_CLASH = 0.8
AMBIGUOUS_MARGIN = 0.05
Filler = dict[str, str]  # a word that names a kind -> the kind code it points at ("" when it only names a form)


def normalise(text: str) -> str:
    folded = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").casefold()
    return " ".join(re.sub(r"[^a-z0-9]+", " ", folded).split())


def trigrams(text: str) -> frozenset[str]:
    """pg_trgm's rule: each word padded with two spaces before and one after, then every three characters."""
    grams: set[str] = set()
    for word in text.split():
        padded = f"  {word} "
        grams.update(padded[i : i + 3] for i in range(len(padded) - 2))
    return frozenset(grams)


def similarity(a: frozenset[str], b: frozenset[str]) -> float:
    return len(a & b) / len(a | b) if a and b else 0.0


def edit_ratio(a: str, b: str) -> float:
    if a == b:
        return 1.0
    if not a or not b:
        return 0.0
    previous = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        current = [i]
        for j, cb in enumerate(b, 1):
            current.append(min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (ca != cb)))
        previous = current
    return 1 - previous[-1] / max(len(a), len(b))


@dataclass(frozen=True)
class KnownName:
    table: str
    code: str
    text: str
    language: str = ""
    kind: str = ""  # the kind code of the record, such as geo.feature.kind.county


@dataclass(frozen=True)
class Match:
    table: str
    code: str
    text: str
    score: float
    tier: str  # exact, key, trigram or edit
    kind_agrees: bool | None
    evidence: str


@dataclass
class _Entry:
    name: KnownName
    norm: str
    key: str
    grams: frozenset[str]


@dataclass
class NameIndex:
    names: list[KnownName]
    filler: Filler = field(default_factory=dict)

    def __post_init__(self) -> None:
        self._entries = [self._entry(n) for n in self.names]
        self._by_norm: dict[str, list[int]] = defaultdict(list)
        self._by_key: dict[str, list[int]] = defaultdict(list)
        self._posting: dict[str, list[int]] = defaultdict(list)
        for i, entry in enumerate(self._entries):
            self._by_norm[entry.norm].append(i)
            self._by_key[entry.key].append(i)
            for gram in entry.grams:
                self._posting[gram].append(i)

    def _split(self, text: str) -> tuple[str, str, set[str]]:
        """The normalised text, its key (kind words removed) and the kind codes those words point at."""
        norm = normalise(text)
        words = norm.split()
        kinds = {self.filler[w] for w in words if self.filler.get(w)}
        kept = [w for w in words if w not in self.filler] or words
        return norm, " ".join(kept), kinds

    def _entry(self, name: KnownName) -> _Entry:
        norm, key, _ = self._split(name.text)
        return _Entry(name, norm, key, trigrams(key))

    @staticmethod
    def _kind_segment(code: str) -> str:
        return code.rsplit(".", 1)[-1]

    def _agreement(self, kinds: set[str], entry: _Entry) -> tuple[bool | None, float]:
        if not kinds:
            return None, KIND_UNKNOWN if entry.name.kind else 1.0
        if not entry.name.kind:
            return None, KIND_UNKNOWN
        agree = any(self._kind_segment(k) == self._kind_segment(entry.name.kind) for k in kinds)
        return agree, KIND_AGREES if agree else KIND_CLASH

    def resolve(self, text: str, table: str = "", limit: int = 5) -> list[Match]:
        norm, key, kinds = self._split(text)
        if not key:
            return []
        grams = trigrams(key)
        best: dict[str, Match] = {}

        def offer(i: int, score: float, tier: str, note: str) -> None:
            entry = self._entries[i]
            if table and entry.name.table != table:
                return
            agrees, factor = self._agreement(kinds, entry)
            final = round(min(1.0, score * factor) if tier != "exact" else score, 4)
            slot = f"{entry.name.table}:{entry.name.code}"
            if slot not in best or final > best[slot].score:
                best[slot] = Match(entry.name.table, entry.name.code, entry.name.text, final, tier, agrees, note)

        for i in self._by_norm.get(norm, ()):
            offer(i, 1.0, "exact", "the whole text is a known name")
        for i in self._by_key.get(key, ()):
            offer(i, 0.99, "key", "the same name once kind words are removed" if norm != key else "the same name")
        votes: dict[int, int] = defaultdict(int)
        for gram in grams:
            for i in self._posting.get(gram, ()):
                votes[i] += 1
        for i in votes:
            entry = self._entries[i]
            if entry.key == key:
                continue
            sim = similarity(grams, entry.grams)
            if sim >= TRIGRAM_FLOOR:
                offer(i, sim * 0.9, "trigram", f"trigram similarity {sim:.2f}")
            else:
                ratio = edit_ratio(key, entry.key)
                if ratio >= EDIT_FLOOR:
                    offer(i, ratio * 0.85, "edit", f"edit similarity {ratio:.2f}")
        ranked = sorted(best.values(), key=lambda m: (-m.score, m.code))
        return ranked[:limit]

    def is_ambiguous(self, matches: list[Match]) -> bool:
        """The best two matches are different records with scores within the margin."""
        return len(matches) > 1 and matches[0].score - matches[1].score < AMBIGUOUS_MARGIN
