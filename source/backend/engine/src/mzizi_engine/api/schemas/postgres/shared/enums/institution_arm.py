"""Institution Arm: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class InstitutionArm(StrEnum):
    COUNTY = "county"
    DEVOLVED_GOVERNMENT = "devolved-government"
    EXECUTIVE = "executive"
    FUNDS = "funds"
    INDEPENDENT = "independent"
    INDEPENDENT_COMMISSION = "independent-commission"
    JUDICIARY = "judiciary"
    LEGISLATURE = "legislature"
