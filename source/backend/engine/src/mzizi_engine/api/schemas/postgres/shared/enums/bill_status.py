"""Bill Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class BillStatus(StrEnum):
    ASSENTED = "assented"
    IN_COMMITTEE = "in-committee"
    LAPSED = "lapsed"
    PASSED = "passed"
    PUBLISHED = "published"
    WITHDRAWN = "withdrawn"
