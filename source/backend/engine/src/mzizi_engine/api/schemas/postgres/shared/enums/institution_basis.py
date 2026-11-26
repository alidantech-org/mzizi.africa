"""Institution Basis: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class InstitutionBasis(StrEnum):
    ADMINISTRATIVE = "administrative"
    CONSTITUTIONAL = "constitutional"
    STATUTORY = "statutory"
