"""Do two sites share a template? Compares profiles and finds the part of the address that varies."""

from __future__ import annotations

from mzizi_scraping.profile.models import FamilyReport, SiteProfile

SAME_FAMILY = 0.75
LIKELY_FAMILY = 0.5
WEIGHTS = (0.35, 0.25, 0.3, 0.1)  # sections, navigation, templates, generator


def _jaccard(left: set[str], right: set[str]) -> float:
    return len(left & right) / len(left | right) if left | right else 0.0


def host_variable(left: str, right: str) -> str:
    """The labels that differ between two hosts, e.g. `kasarani` versus `westlands`; empty when the shapes differ."""
    a, b = left.split("."), right.split(".")
    if len(a) != len(b):
        return ""
    differing = [(x, y) for x, y in zip(a, b, strict=True) if x != y]
    return ",".join(f"{x}|{y}" for x, y in differing)


def compare_profiles(left: SiteProfile, right: SiteProfile) -> FamilyReport:
    sections = (
        {s.segment for s in left.sections},
        {s.segment for s in right.sections},
    )
    nav = (set(left.nav_labels), set(right.nav_labels))
    templates = ({t.signature for t in left.templates}, {t.signature for t in right.templates})
    section_score, nav_score, template_score = _jaccard(*sections), _jaccard(*nav), _jaccard(*templates)
    same_generator = bool(left.generator) and left.generator == right.generator
    score = round(
        sum(w * v for w, v in zip(WEIGHTS, (section_score, nav_score, template_score, float(same_generator)), strict=True)),
        3,
    )
    verdict = "same family" if score >= SAME_FAMILY else "likely same family" if score >= LIKELY_FAMILY else "different"
    return FamilyReport(
        left=left.host,
        right=right.host,
        score=score,
        host_variable=host_variable(left.host, right.host),
        shared_sections=tuple(sorted(sections[0] & sections[1])),
        left_only_sections=tuple(sorted(sections[0] - sections[1])),
        right_only_sections=tuple(sorted(sections[1] - sections[0])),
        shared_nav_labels=tuple(sorted(nav[0] & nav[1])),
        shared_template_signatures=tuple(sorted(templates[0] & templates[1])),
        same_generator=same_generator,
        section_similarity=round(section_score, 3),
        nav_similarity=round(nav_score, 3),
        template_similarity=round(template_score, 3),
        verdict=verdict,
    )
