"""Subject Role: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class SubjectRole(StrEnum):
    MAIN = "main"
    MENTIONED = "mentioned"
