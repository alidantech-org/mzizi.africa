"""Evidence ranking: weighted, saturating, idf-scaled term matches per field, turned into tag confidences.

For a tag, each matched term adds `field_weight * idf(term) * c / (c + k)` where c is its count in that field. Terms
found in nearly every document (idf near 0) therefore carry little, while a rare term in a title carries a lot. The
total passes through `1 - exp(-score / scale)` to give a confidence between 0 and 1. These are heuristic ranking
scores, not calibrated probabilities; calibrate `scale` and `threshold` against reviewed decisions."""

from __future__ import annotations

import math
from collections import Counter

from mzizi_patterns.features.terms.terms import Phrase
from mzizi_patterns.features.tokenise.tokenise import phrases, words
from mzizi_patterns.shared.contracts import (
    Axis,
    DocumentScore,
    DocumentText,
    Field_,
    Impact,
    MatchedTerm,
    Profile,
    TagRule,
    TagScore,
)


def _field_texts(document: DocumentText) -> list[tuple[Field_, str]]:
    return [
        (Field_.FILENAME, document.filename),
        (Field_.TITLE, document.title),
        (Field_.HEADINGS, " ; ".join(document.headings)),
        (Field_.BODY, document.body),
    ]


def term_counts(
    document: DocumentText, index: dict[Phrase, str], stopwords: frozenset[str], longest: int
) -> dict[Field_, Counter[str]]:
    """Canonical term -> count, per field. Stop-words are dropped before phrases are formed."""
    found: dict[Field_, Counter[str]] = {}
    for field, text in _field_texts(document):
        sequence = [word for word in words(text) if word not in stopwords]
        counts: Counter[str] = Counter()
        for phrase in phrases(sequence, longest):
            term = index.get(phrase)
            if term is not None:
                counts[term] += 1
        if field is Field_.FILENAME:
            counts.update(_inside_run(sequence, index, counts))
        found[field] = counts
    return found


BODY_UNIT = 4000  # characters of body text before length starts to discount body matches
MIN_RUN_CHARS = 4  # a phrase this short inside a longer word is more likely chance than a joined word


def _inside_run(sequence: list[str], index: dict[Phrase, str], seen: Counter[str]) -> Counter[str]:
    """File names are often joined words ('politicalpartiesact11of2011'): find phrases inside a longer run of letters."""
    extra: Counter[str] = Counter()
    for token in sequence:
        if len(token) < 2 * MIN_RUN_CHARS:
            continue
        for phrase, term in index.items():
            joined = "".join(phrase)
            if len(joined) >= MIN_RUN_CHARS and joined in token and term not in seen:
                extra[term] += 1
    return extra


def document_frequency(all_counts: list[dict[Field_, Counter[str]]]) -> Counter[str]:
    frequency: Counter[str] = Counter()
    for counts in all_counts:
        seen: set[str] = set()
        for per_field in counts.values():
            seen.update(per_field)
        frequency.update(seen)
    return frequency


def idf(term: str, frequency: Counter[str], documents: int) -> float:
    return math.log(1 + (documents - frequency[term] + 0.5) / (frequency[term] + 0.5))


def score_document(
    document: DocumentText,
    counts: dict[Field_, Counter[str]],
    profile: Profile,
    tag_terms: dict[str, frozenset[str]],
    frequency: Counter[str],
    documents: int,
) -> DocumentScore:
    weights = dict(profile.field_weights)
    length = 1 + 0.5 * math.log(1 + len(document.body) / BODY_UNIT)  # long texts mention many things in passing
    scored: list[TagScore] = []
    for rule in profile.tags:
        terms = tag_terms[rule.tag]
        matches: list[MatchedTerm] = []
        total = 0.0
        for field, per_field in counts.items():
            for term, count in per_field.items():
                if term not in terms:
                    continue
                value = weights[field] * idf(term, frequency, documents) * count / (count + profile.saturation)
                if field is Field_.BODY:
                    value /= length
                matches.append(MatchedTerm(term=term, field=field, count=count, contribution=round(value, 4)))
                total += value
        total *= rule.weight
        confidence = 1 - math.exp(-total / profile.scale)
        if confidence >= profile.threshold:
            scored.append(
                TagScore(
                    tag=rule.tag,
                    axis=rule.axis,
                    impact=rule.impact,
                    score=round(total, 4),
                    confidence=round(confidence, 4),
                    matches=tuple(sorted(matches, key=lambda m: -m.contribution)[:8]),
                )
            )
    scored.sort(key=lambda s: -s.confidence)
    kind = next((s for s in scored if s.axis is Axis.KIND), None)
    subjects = tuple(s.tag for s in scored if s.axis is Axis.SUBJECT)
    return DocumentScore(
        name=document.name,
        impact=_impact(kind, [s for s in scored if s.axis is Axis.SUBJECT]),
        kind=kind.tag if kind else None,
        subjects=subjects,
        tags=tuple(scored),
        reason=_reason(scored),
    )


def _impact(kind: TagScore | None, subjects: list[TagScore]) -> Impact:
    """What the document is sets its level; subjects fill in when no kind is clear. A form, news item or noise
    document stays low however finance-heavy its words are."""
    if kind is not None:
        return kind.impact
    return subjects[0].impact if subjects else Impact.LOW


def _reason(scored: list[TagScore]) -> str:
    if not scored:
        return "no tag reached the confidence threshold"
    kind = next((s for s in scored if s.axis is Axis.KIND), None)
    parts = [f"kind {kind.tag} ({kind.confidence}: {', '.join(m.term for m in kind.matches[:3])})"] if kind else []
    subjects = [s for s in scored if s.axis is Axis.SUBJECT][:2]
    parts += [f"subject {s.tag} ({s.confidence})" for s in subjects]
    return "; ".join(parts) or "subject only"


def tag_term_sets(rules: tuple[TagRule, ...], list_terms: dict[str, frozenset[str]]) -> dict[str, frozenset[str]]:
    return {rule.tag: frozenset().union(*(list_terms[code] for code in rule.term_lists)) for rule in rules}
