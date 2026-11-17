"""Match source columns to database columns through column dictionaries, heading rules and cell patterns.

For each source column the matcher (1) reads how the heading is built ("Amount (ksh)" is a base and a unit), (2) compares
the base with the heading words of every dictionary column (weighted Dice similarity of word sets; an exact phrase scores
1), (3) looks at the cells: their shape, whether they fit the column's value patterns, and what they are (person,
organisation, address), (4) notices two columns collapsed into one, and (5) ranks the candidates. Scores are ranking
evidence, not probabilities."""

from __future__ import annotations

import math
from collections import Counter
from dataclasses import dataclass

from mzizi_patterns.features.columns.shapes import shape_shares
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.features.vocabulary.vocabulary import Vocabulary, domain_of
from mzizi_patterns.shared.contracts import (
    ColumnCandidate,
    ColumnProbe,
    ColumnProposal,
    DictColumn,
    Dictionary,
    DictLink,
    HeadingParts,
    Shape,
    SplitProposal,
)

MIN_HEADER_SCORE = 0.5
MATCHED_SCORE = 0.75
AMBIGUOUS_MARGIN = 0.08
SHAPE_FIT = 0.6
VALUE_ONLY_SHARE = 0.6
EXCLUDE_SCORE = 0.9
ROW_NUMBERS = "sys.trm.global.headings#row-numbers"
CLOSE_FIT: dict[Shape, tuple[Shape, ...]] = {
    Shape.MONEY: (Shape.MONEY, Shape.INTEGER),
    Shape.CODE: (Shape.CODE, Shape.INTEGER),
}
SAY_ORDER = ("organisation", "person")  # an organisation suffix settles a name that also looks like a person


@dataclass(frozen=True)
class Entry:
    column: str
    spec: DictColumn
    domain: str


def entries_of(dictionaries: tuple[Dictionary, ...]) -> list[Entry]:
    """One entry per database column: dictionaries of several scopes add their links to the same column."""
    merged: dict[str, Entry] = {}
    for dictionary in dictionaries:
        domain = domain_of(dictionary.code.replace("sys.col.", "sys.trm."))
        for column, spec in dictionary.columns.items():
            if column in merged:
                old = merged[column]
                merged[column] = Entry(
                    column,
                    DictColumn(
                        means=old.spec.means,
                        shape=old.spec.shape or spec.shape,
                        says=old.spec.says,
                        terms=(*old.spec.terms, *spec.terms),
                    ),
                    old.domain,
                )
            else:
                merged[column] = Entry(column, spec, domain)
    return list(merged.values())


def token_weights(vocab: Vocabulary, entries: list[Entry]) -> dict[str, float]:
    """A word found in many headings (no, of, date) says little; a rare one (serial, abbreviation) says a lot."""
    frequency: Counter[str] = Counter()
    total = 0
    for entry in entries:
        for link in entry.spec.terms:
            if link.role == "heading":
                for surface in vocab.surfaces(f"{link.list}#{link.key}", entry.domain):
                    total += 1
                    frequency.update(set(words(surface)))
    weights = {t: math.log(1 + (total or 1) / n) for t, n in frequency.items()}
    weights[""] = sum(weights.values()) / len(weights) if weights else 1.0  # a word no heading uses is informative too
    return weights


def _dice(a: set[str], b: set[str], weight: dict[str, float]) -> float:
    def mass(tokens: set[str]) -> float:
        return sum(weight.get(t, weight.get("", 1.0)) for t in tokens)

    return 2 * mass(a & b) / (mass(a) + mass(b)) if a and b else 0.0


STOP = frozenset(
    {"the", "of", "to", "in", "on", "for", "and", "a", "an", "at", "by", "ya", "wa", "na", "za", "la", "kwa"}
)


def _content(tokens: list[str]) -> list[str]:
    kept = [t for t in tokens if t not in STOP]
    return kept or tokens


def header_score(text: str, surfaces: dict[str, str], weight: dict[str, float]) -> tuple[float, str]:
    tokens = _content(words(text))
    best, term = 0.0, ""
    for surface, canonical in surfaces.items():
        other = _content(words(surface))
        score = 1.0 if tokens == other else _dice(set(tokens), set(other), weight)
        if score > best:
            best, term = score, canonical
    return best, term


def parse_heading(vocab: Vocabulary, header: str) -> HeadingParts | None:
    for domain, key in vocab.rules:
        captures = vocab.match(key, domain, header, heading=True)
        if captures and "base" in captures:
            rule = vocab.rules[(domain, key)]
            return HeadingParts(
                base=captures["base"], qualifier=captures.get("qualifier", ""), qualifier_is=rule.qualifier_is, rule=key
            )
    return None


def _has_phrase(cell_words: list[str], phrases: list[list[str]]) -> bool:
    return any(
        phrase and any(cell_words[i : i + len(phrase)] == phrase for i in range(len(cell_words))) for phrase in phrases
    )


def value_support(vocab: Vocabulary, entry: Entry, cells: list[str]) -> float:
    """The best share of cells that fit one of the column's value links (a pattern, or words from a group)."""
    best = 0.0
    for link in entry.spec.terms:
        if link.role != "value" or not cells:
            continue
        ref = f"{link.list}#{link.key}"
        if vocab.key(ref, entry.domain) in vocab.patterns:
            hits = sum(vocab.match(ref, entry.domain, cell) is not None for cell in cells)
        else:
            phrases = vocab.phrases(ref, entry.domain)
            hits = sum(_has_phrase(words(cell), phrases) for cell in cells)
        best = max(best, link.weight * hits / len(cells))
    return min(best, 1.0)


def what_cells_say(vocab: Vocabulary, cells: list[str]) -> tuple[tuple[str, int], ...]:
    counts: Counter[str] = Counter()
    for cell in cells:
        means = {
            p.means
            for (domain, key), p in vocab.patterns.items()
            if p.means and vocab.match(key, domain, cell) is not None
        }
        for preferred in SAY_ORDER:
            if preferred in means:
                means = {preferred}
                break
        counts.update(means)
    return tuple(counts.most_common())


def _shape_factor(expected: Shape | None, shares: dict[Shape, float]) -> tuple[float, float | None]:
    if expected is None or expected is Shape.TEXT:
        return 1.0, None
    if not shares:
        return 0.8, None
    fit = max(shares.get(shape, 0.0) for shape in CLOSE_FIT.get(expected, (expected,)))
    return (1.0 if fit >= SHAPE_FIT else 0.35), round(fit, 2)


def _split(vocab: Vocabulary, probe: ColumnProbe, parts: HeadingParts | None) -> SplitProposal | None:
    if parts is None:
        return None
    cells = [c for c in probe.samples if c.strip()]
    for (domain, _), (split, _) in vocab.splits.items():
        if split.heading_rule.rpartition("#")[2] != parts.rule or not cells:
            continue
        captured = [vocab.match(split.cell_pattern, domain, cell) for cell in cells]
        share = sum(c is not None for c in captured) / len(cells)
        if share >= split.min_share:
            first, second = split.into[0].from_capture, split.into[1].from_capture
            rows = [c for c in captured if c]
            return SplitProposal(
                split=split.split,
                share=round(share, 2),
                main_heading=parts.base,
                qualifier_heading="abbreviation" if parts.qualifier_is == "abbreviation" else parts.qualifier,
                main_cells=tuple(r.get(first, "") for r in rows),
                qualifier_cells=tuple(r.get(second, "") for r in rows),
            )
    return None


def match_columns(
    probes: tuple[ColumnProbe, ...],
    vocab: Vocabulary,
    dictionaries: tuple[Dictionary, ...],
    prefer: frozenset[str] = frozenset(),
) -> tuple[ColumnProposal, ...]:
    entries = entries_of(dictionaries)
    weight = token_weights(vocab, entries)
    proposals: list[ColumnProposal] = []
    for probe in probes:
        parts = parse_heading(vocab, probe.header)
        split = _split(vocab, probe, parts)
        if split is not None:
            main = ColumnProbe(header=split.main_heading, samples=split.main_cells)
            extra = ColumnProbe(header=split.qualifier_heading, samples=split.qualifier_cells)
            first = _one(vocab, entries, weight, main, prefer, None, split)
            proposals += [first, _one(vocab, entries, weight, extra, prefer, None, None)]
        else:
            proposals.append(_one(vocab, entries, weight, probe, prefer, parts, None))
    return tuple(proposals)


def _one(
    vocab: Vocabulary,
    entries: list[Entry],
    weight: dict[str, float],
    probe: ColumnProbe,
    prefer: frozenset[str],
    parts: HeadingParts | None,
    split: SplitProposal | None,
) -> ColumnProposal:
    cells = [c for c in probe.samples if c.strip()]
    detected = shape_shares(probe.samples)
    shares = dict(detected)
    base = parts.base if parts else probe.header
    says = what_cells_say(vocab, cells)
    note = f"collapsed column: {split.split}" if split else ""
    if (
        header_score(base, vocab.surfaces(ROW_NUMBERS, "headings"), weight)[0] >= 0.95
        and shares.get(Shape.INTEGER, 0) >= 0.8
    ):
        return ColumnProposal(
            header=probe.header,
            status="index",
            chosen=None,
            alternatives=(),
            detected=detected[:3],
            heading=parts,
            note="counts the rows",
        )
    candidates: list[ColumnCandidate] = []
    for entry in entries:
        heading_hits = [
            (link, *header_score(base, vocab.surfaces(f"{link.list}#{link.key}", entry.domain), weight))
            for link in entry.spec.terms
            if link.role == "heading"
        ]
        excluded = any(
            header_score(base, vocab.surfaces(f"{link.list}#{link.key}", entry.domain), weight)[0] >= EXCLUDE_SCORE
            for link in entry.spec.terms
            if link.role == "exclude"
        )
        if excluded:
            continue
        best_link, best, term = max(
            ((link, s * link.weight, t) for link, s, t in heading_hits), key=lambda x: x[1], default=(None, 0.0, "")
        )
        support = value_support(vocab, entry, cells)
        factor, share = _shape_factor(entry.spec.shape, shares)
        unit = bool(
            parts
            and parts.qualifier_is == "unit"
            and any(
                link.role == "unit"
                and parts.qualifier.casefold()
                in {s.casefold() for s in vocab.surfaces(f"{link.list}#{link.key}", entry.domain)}
                for link in entry.spec.terms
            )
        )
        if best >= MIN_HEADER_SCORE:
            score = min(1.0, best * factor + 0.1 * support * factor + (0.05 if unit else 0.0))
        elif support >= VALUE_ONLY_SHARE and not base.strip():
            score, term = 0.55 * support * factor, "(cells)"
        else:
            continue
        candidates.append(
            ColumnCandidate(
                target=entry.column,
                group=best_link.key if best_link else "value-pattern",
                reads_as=best_link.says if best_link else "",
                score=round(score, 4),
                matched_term=term,
                header_score=round(best, 4),
                shape=entry.spec.shape,
                shape_share=share,
                specificity=0,
                preferred=entry.column.split(".")[0] in prefer,
            )
        )
    candidates.sort(key=lambda c: (-c.score, -c.preferred, c.target))
    unit_text = parts.qualifier if parts and parts.qualifier_is == "unit" else ""
    return _proposal(probe.header, candidates, detected, parts, unit_text, says, split, note)


def _proposal(
    header: str,
    candidates: list[ColumnCandidate],
    detected: tuple[tuple[Shape, float], ...],
    parts: HeadingParts | None,
    unit: str,
    says: tuple[tuple[str, int], ...],
    split: SplitProposal | None,
    note: str,
) -> ColumnProposal:
    best = candidates[0] if candidates else None
    rivals = [
        c
        for c in candidates[1:]
        if best
        and c.target != best.target
        and best.score - c.score < AMBIGUOUS_MARGIN
        and c.preferred >= best.preferred
    ]
    status = (
        "unmatched" if best is None else "ambiguous" if rivals else "weak" if best.score < MATCHED_SCORE else "matched"
    )
    return ColumnProposal(
        header=header,
        status=status,
        chosen=best,
        alternatives=tuple(candidates[1:4]),
        detected=detected[:3],
        heading=parts,
        unit=unit,
        says=says,
        split=split,
        note=note,
    )


__all__ = ["DictLink", "Entry", "match_columns", "parse_heading"]
