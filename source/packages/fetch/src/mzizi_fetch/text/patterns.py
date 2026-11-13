"""The only module in this package that runs a regular expression.

Interim home until the shared `patterns` package exists (task TSK-D2BC6AE00DFF).
"""

from __future__ import annotations

import re

_PLACEHOLDER_CONTACT = re.compile(r"example\.(invalid|com|org|net)|\.invalid\b|\.test\b|localhost", re.I)
CONTACT_MARKER = "@"


def is_placeholder_contact(value: str) -> bool:
    return _PLACEHOLDER_CONTACT.search(value) is not None


def has_contact_address(value: str) -> bool:
    return CONTACT_MARKER in value
