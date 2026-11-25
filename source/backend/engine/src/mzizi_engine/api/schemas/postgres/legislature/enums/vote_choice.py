"""Vote Choice: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class VoteChoice(StrEnum):
    ABSENT = "absent"
    ABSTAIN = "abstain"
    NO = "no"
    YES = "yes"
