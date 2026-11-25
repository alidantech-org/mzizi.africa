"""Code Purpose: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CodePurpose(StrEnum):
    CHANGE = "change"
    SIGNIN = "signin"
    SIGNUP = "signup"
