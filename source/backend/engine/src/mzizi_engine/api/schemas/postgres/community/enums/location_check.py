"""Location Check: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LocationCheck(StrEnum):
    INSIDE = "inside"
    NEAR = "near"
    OUTSIDE = "outside"
    SUSPECTED_MOCK = "suspected-mock"
    UNAVAILABLE = "unavailable"
