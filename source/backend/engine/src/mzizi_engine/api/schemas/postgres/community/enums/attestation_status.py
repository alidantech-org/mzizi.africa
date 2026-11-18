"""Attestation Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AttestationStatus(StrEnum):
    FAILED = "failed"
    NONE = "none"
    PASSED = "passed"
    UNAVAILABLE = "unavailable"
