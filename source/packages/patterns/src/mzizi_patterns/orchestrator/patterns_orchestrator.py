"""The one public class: fit corpus statistics, score documents and find near-duplicates."""

from __future__ import annotations

from collections import Counter

from mzizi_patterns.features.columns.columns import match_columns
from mzizi_patterns.features.dedupe.dedupe import jaccard, minhash, shingles, signature_similarity
from mzizi_patterns.features.score.score import (
    document_frequency,
    score_document,
    term_counts,
)
from mzizi_patterns.features.terms.terms import merge_groups, phrase_index, resolve
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.features.vocabulary.vocabulary import Vocabulary
from mzizi_patterns.shared.contracts import (
    ColumnProbe,
    ColumnProposal,
    Dictionary,
    DocumentScore,
    DocumentText,
    DuplicatePair,
    Field_,
    Profile,
    TermList,
)

MIN_SHINGLES = 20


def propose_columns(
    probes: tuple[ColumnProbe, ...],
    term_lists: tuple[TermList, ...],
    dictionaries: tuple[Dictionary, ...],
    scopes: tuple[str, ...] = ("global",),
    prefer: frozenset[str] = frozenset(),
    derived: dict[str, tuple[str, ...]] | None = None,
) -> tuple[ColumnProposal, ...]:
    """Match source columns to database columns with the term lists of `scopes` and the column dictionaries."""
    return match_columns(probes, Vocabulary(term_lists, scopes), dictionaries, prefer, derived)


class PatternOrchestrator:
    def __init__(self, profile: Profile, term_lists: tuple[TermList, ...]) -> None:
        by_code = {term_list.code: term_list for term_list in term_lists}
        merged = merge_groups(resolve(profile.term_lists, by_code))
        unknown = sorted({r.group for r in profile.tags} - set(merged))
        if unknown:
            raise ValueError(f"profile {profile.code} refers to groups no loaded list defines: {unknown}")
        self.profile = profile
        self.axes = {rule.tag: merged[rule.group].axis for rule in profile.tags}
        self._index = phrase_index([merged[rule.group] for rule in profile.tags])
        stop = merged.get(profile.stopword_group)
        self._stopwords = frozenset(word for form in (stop.surfaces if stop else {}) for word in words(form))
        self._tag_terms = {rule.tag: frozenset(merged[rule.group].surfaces) for rule in profile.tags}

    def score_corpus(self, documents: tuple[DocumentText, ...]) -> tuple[DocumentScore, ...]:
        longest = self.profile.max_ngram
        counts = [term_counts(d, self._index, self._stopwords, longest) for d in documents]
        frequency: Counter[str] = document_frequency(counts)
        return tuple(
            score_document(d, c, self.profile, self._tag_terms, self.axes, frequency, len(documents))
            for d, c in zip(documents, counts, strict=True)
        )

    def score_one(self, document: DocumentText) -> DocumentScore:
        """Score a single document, with every term treated as rare enough to count (there is no corpus to measure against)."""
        counts = term_counts(document, self._index, self._stopwords, self.profile.max_ngram)
        return score_document(document, counts, self.profile, self._tag_terms, self.axes, Counter(), 20)

    def preferred_schemas(self, score: DocumentScore) -> frozenset[str]:
        """The database schemas the document's kept tags point at."""
        wanted = {tag for tag in (t.tag for t in score.tags)}
        return frozenset(schema for rule in self.profile.tags if rule.tag in wanted for schema in rule.schemas)

    def near_duplicates(self, documents: tuple[DocumentText, ...], threshold: float = 0.8) -> tuple[DuplicatePair, ...]:
        items = [(d.name, shingles(d.body or d.title)) for d in documents]
        items = [(name, grams) for name, grams in items if len(grams) >= MIN_SHINGLES]  # no text, nothing to compare
        signatures = [minhash(s) for _, s in items]
        pairs: list[DuplicatePair] = []
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                if signature_similarity(signatures[i], signatures[j]) < threshold - 0.15:
                    continue  # the cheap signature rules it out; compute exact similarity only for likely pairs
                similarity = jaccard(items[i][1], items[j][1])
                if similarity >= threshold:
                    pairs.append(DuplicatePair(left=items[i][0], right=items[j][0], similarity=round(similarity, 4)))
        return tuple(sorted(pairs, key=lambda p: -p.similarity))


__all__ = ["Field_", "PatternOrchestrator", "propose_columns"]
