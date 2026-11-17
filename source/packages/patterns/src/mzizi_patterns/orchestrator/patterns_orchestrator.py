"""The one public class: fit corpus statistics, score documents and find near-duplicates."""

from __future__ import annotations

from collections import Counter

from mzizi_patterns.features.dedupe.dedupe import jaccard, minhash, shingles, signature_similarity
from mzizi_patterns.features.score.score import (
    document_frequency,
    score_document,
    tag_term_sets,
    term_counts,
)
from mzizi_patterns.features.terms.terms import phrase_index
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import DocumentScore, DocumentText, DuplicatePair, Field_, Profile, TermList

MIN_SHINGLES = 20


class PatternOrchestrator:
    def __init__(self, profile: Profile, term_lists: tuple[TermList, ...]) -> None:
        by_code = {term_list.code: term_list for term_list in term_lists}
        missing = [c for rule in profile.tags for c in rule.term_lists if c not in by_code]
        missing += [c for c in profile.stopword_lists if c not in by_code]
        if missing:
            raise ValueError(
                f"profile {profile.code} refers to term lists that were not supplied: {sorted(set(missing))}"
            )
        self.profile = profile
        self._index = phrase_index(tuple(by_code[c] for rule in profile.tags for c in rule.term_lists))
        self._stopwords = frozenset(
            word for code in profile.stopword_lists for entry in by_code[code].terms for word in words(entry.value)
        )
        self._tag_terms = tag_term_sets(
            profile.tags,
            {
                code: frozenset(entry.value for entry in by_code[code].terms)
                for rule in profile.tags
                for code in rule.term_lists
            },
        )

    def score_corpus(self, documents: tuple[DocumentText, ...]) -> tuple[DocumentScore, ...]:
        longest = self.profile.max_ngram
        counts = [term_counts(d, self._index, self._stopwords, longest) for d in documents]
        frequency: Counter[str] = document_frequency(counts)
        return tuple(
            score_document(d, c, self.profile, self._tag_terms, frequency, len(documents))
            for d, c in zip(documents, counts, strict=True)
        )

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


__all__ = ["Field_", "PatternOrchestrator"]
