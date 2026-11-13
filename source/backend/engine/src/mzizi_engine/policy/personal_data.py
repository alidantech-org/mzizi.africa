"""Personal-data hints for extracted records. A hint, never a clearance.

The category tables below are classification data and belong in a policy manifest; they stay here only until the
`patterns` package and manifest rule sets exist (tasks TSK-D2BC6AE00DFF and TSK-382DD9E38552).
"""

from __future__ import annotations

import re
from collections.abc import Iterable, Mapping

FIELD_CATEGORIES = {
    "national_id": re.compile(r"(national[_ ]?id|id[_ ]?(no|number)|passport|kra[_ ]?pin|nin|ssn)", re.I),
    "phone": re.compile(r"(phone|mobile|msisdn|tel(ephone)?\b)", re.I),
    "email": re.compile(r"(e[-_ ]?mail)", re.I),
    "date_of_birth": re.compile(r"(date[_ ]?of[_ ]?birth|\bdob\b|birth[_ ]?date)", re.I),
    "precise_address": re.compile(r"(home[_ ]?address|residen|physical[_ ]?address|street)", re.I),
    "health": re.compile(r"(diagnos|medical|health[_ ]?status|hiv|disabilit)", re.I),
    "children": re.compile(r"(\bminor\b|child(ren)?[_ ]?name|pupil|student[_ ]?name)", re.I),
    "criminal": re.compile(r"(convict|arrest|criminal|charge[ds]?\b|offence)", re.I),
    "political_opinion": re.compile(r"(party[_ ]?member|political[_ ]?affiliation|religio|ethnic|tribe)", re.I),
}
VALUE_PATTERNS = {
    "email": re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"),
    "phone": re.compile(r"(?<!\d)(?:\+254|254|0)[17]\d{8}(?!\d)"),
    "national_id": re.compile(r"(?i)\b(?:id|passport)\s*(?:no\.?|number|#)?\s*[:#]?\s*\d{7,9}\b"),
}


def scan_personal_data(
    record: Mapping[str, str | int | float | bool | None], ignore_fields: Iterable[str] = ()
) -> set[str]:
    """Categories of personal data suggested by field names and values in an extracted record. A hint, never a clearance."""
    found: set[str] = set()
    skip = set(ignore_fields)
    for name, value in record.items():
        if name in skip or value in (None, ""):
            continue
        for category, pattern in FIELD_CATEGORIES.items():
            if pattern.search(name):
                found.add(category)
        if isinstance(value, str):
            for category, pattern in VALUE_PATTERNS.items():
                if pattern.search(value):
                    found.add(category)
    return found


def unexpected_categories(found: set[str], allowed: Iterable[str], excluded: Iterable[str] = ()) -> set[str]:
    """Detected categories that the assessment did not anticipate, plus any that the policy excludes outright."""
    allowed_set = {c for c in allowed if c != "none_known"}
    return {c for c in found if c in set(excluded) or c not in allowed_set}
