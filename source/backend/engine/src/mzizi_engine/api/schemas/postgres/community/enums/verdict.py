"""Verdict: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Verdict(StrEnum):
    FAIL = "fail"
    FLAG = "flag"
    PASS = "pass"
