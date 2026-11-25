"""Code Channel: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CodeChannel(StrEnum):
    EMAIL = "email"
    SMS = "sms"
