"""Selection Method: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class SelectionMethod(StrEnum):
    ACTING = "acting"
    APPOINTED = "appointed"
    ELECTED = "elected"
    ELECTED_BY_MEMBERS = "elected-by-members"
    EX_OFFICIO = "ex-officio"
    NOMINATED = "nominated"
    RUNNING_MATE = "running-mate"
