"""Audit Decision Type: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AuditDecisionType(StrEnum):
    APPROVAL = "approval"
    PUBLICATION = "publication"
    REVIEW = "review"
    SECURITY = "security"
