"""Template Product: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TemplateProduct(StrEnum):
    CONTACT = "contact"
    DOMAIN = "domain"
    EVENT_RULE = "event-rule"
    INSTITUTION = "institution"
    OFFICE = "office"
    POSITION = "position"
