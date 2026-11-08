"""Content sections of a site structure: a semantic label, path rules, file types and pagination hints.

A rule is an exact path or a regular expression with named slots (year, county, number, page ...).
The rule's origin is recorded as provenance on the rule (method, label, reference, confidence), never
as a free-text source column. Rules found by crawling only ever arrive with method `discovered` or
`ai-proposed` and are held for review.
"""
from __future__ import annotations

import re
from typing import Any

LABELS = frozenset({
    "publications", "downloads", "media", "tenders", "notices", "legislation", "reports", "press",
    "budgets", "bills", "gazettes", "careers", "projects", "events", "data", "contacts",
})
SLOTS = frozenset({"year", "county", "constituency", "ward", "number", "page", "month", "slug", "id"})
SLOT = re.compile(r"\(\?P<([A-Za-z_][A-Za-z0-9_]*)>")


def validate_sections(doc: dict) -> list[str]:
    errors: list[str] = []
    seen: set[str] = set()
    for i, section in enumerate(doc.get("sections", [])):
        where = f"sections.yml: sections[{i}]"
        label = section.get("label")
        if label not in LABELS:
            errors.append(f"{where}: unknown section label {label!r} (known: {', '.join(sorted(LABELS))})")
        elif label in seen:
            errors.append(f"{where}: label {label!r} is declared twice; give one section several rules instead")
        seen.add(str(label))
        for j, rule in enumerate(section.get("rules", [])):
            at = f"{where}.rules[{j}]"
            pattern = rule.get("pattern", "")
            if rule.get("kind") == "exact":
                if not pattern.startswith("/"):
                    errors.append(f"{at}: an exact path must start with '/'")
                continue
            try:
                compiled = re.compile(pattern)
            except re.error as error:
                errors.append(f"{at}: invalid regular expression ({error})")
                continue
            if not pattern.startswith("^/"):
                errors.append(f"{at}: a regex path rule must be anchored with '^/'")
            for slot in compiled.groupindex:
                if slot not in SLOTS:
                    errors.append(f"{at}: unknown slot {slot!r} (known: {', '.join(sorted(SLOTS))})")
    return errors


def match_rule(sections: list[dict], path: str) -> dict[str, Any] | None:
    """The first section rule matching a URL path: label, the rule and the slot values it captured."""
    for section in sections:
        for rule in section["rules"]:
            if rule["kind"] == "exact":
                if path.rstrip("/") == rule["pattern"].rstrip("/"):
                    return {"label": section["label"], "rule": rule, "slots": {}}
            else:
                found = re.match(rule["pattern"], path)
                if found:
                    return {"label": section["label"], "rule": rule, "slots": found.groupdict()}
    return None
