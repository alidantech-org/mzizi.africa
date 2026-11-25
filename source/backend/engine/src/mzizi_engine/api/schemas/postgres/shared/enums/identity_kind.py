"""Identity Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class IdentityKind(StrEnum):
    APP = "app"
    BILL = "bill"
    COALITION = "coalition"
    COLLECTION = "collection"
    COUNTRY = "country"
    CURRENCY = "currency"
    DEBT = "debt"
    ELECTION = "election"
    ENTITY = "entity"
    ERA = "era"
    EVENT = "event"
    FEATURE = "feature"
    FUNCTION = "function"
    FUND = "fund"
    HIERARCHY = "hierarchy"
    INDICATOR = "indicator"
    INDIVIDUAL = "individual"
    INSTRUMENT = "instrument"
    LANGUAGE = "language"
    LEVEL = "level"
    METRIC = "metric"
    OCCURRENCE = "occurrence"
    OFFICE = "office"
    POSITION = "position"
    PROCEDURE = "procedure"
    PROCUREMENT = "procurement"
    PRODUCT = "product"
    PROJECT = "project"
    SERVICE = "service"
    TIMEZONE = "timezone"
    UNIT = "unit"
