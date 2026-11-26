"""Product: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Product(StrEnum):
    AREA = "area"
    BUDGET = "budget"
    CONTACT = "contact"
    CONTEST = "contest"
    DOMAIN = "domain"
    ELECTION_CYCLE = "election-cycle"
    EVENT_RULE = "event-rule"
    EVENT_SCHEDULE = "event-schedule"
    FUND = "fund"
    HOLDER = "holder"
    INSTITUTION = "institution"
    OFFICE = "office"
    POSITION = "position"
    PREMISES = "premises"
    TERM = "term"
