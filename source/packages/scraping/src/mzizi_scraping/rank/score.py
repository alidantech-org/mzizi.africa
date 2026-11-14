"""Rule-based ranking: score each rule by the weighted share of its conditions the file's facts satisfy."""

from __future__ import annotations

from mzizi_scraping.rank.models import (
    Evidence,
    Expectation,
    ExpectationMap,
    FileFeatures,
    RankingRules,
    RankRule,
    Signal,
)


def _normalise(text: str) -> str:
    """Lower case with every run of non-alphanumeric characters turned into one space, so '2015-16_x.pdf' == '2015 16 x pdf'."""
    out: list[str] = []
    for char in text.lower():
        out.append(char if char.isalnum() else " ")
    return " ".join("".join(out).split())


def _fact(features: FileFeatures, signal: Signal) -> str:
    return {
        Signal.SECTION: features.section,
        Signal.ANCHOR_TEXT: features.anchor_text,
        Signal.FILENAME: features.filename,
        Signal.SOURCE_PAGE_TITLE: features.source_page_title,
        Signal.SOURCE_PAGE_PATH: features.source_page_path,
        Signal.EXTENSION: features.extension,
    }[signal]


def score_rule(features: FileFeatures, rule: RankRule) -> Expectation | None:
    evidence: list[Evidence] = []
    total = sum(condition.weight for condition in rule.conditions)
    for condition in rule.conditions:
        fact = _normalise(_fact(features, condition.signal))
        hit = next((word for word in condition.contains if _normalise(word) and _normalise(word) in fact), None)
        if hit is not None:
            evidence.append(Evidence(signal=condition.signal, matched=hit, weight=condition.weight))
    if not evidence:
        return None
    share = sum(item.weight for item in evidence) / total
    return Expectation(
        target=rule.target,
        label=rule.label,
        score=round(share * rule.confidence_cap, 3),
        evidence=tuple(evidence),
        rule_provenance=rule.provenance,
    )


def rank_file(features: FileFeatures, rules: RankingRules) -> ExpectationMap:
    found = [item for rule in rules.rules if (item := score_rule(features, rule)) is not None]
    found.sort(key=lambda item: (-item.score, item.target, item.label))
    return ExpectationMap(url=features.url, expectations=tuple(found))
