"""Audit Subject Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AuditSubjectKind(StrEnum):
    ACCOUNT = "account"
    CANDIDATE = "candidate"
    INVITATION = "invitation"
    MEMBERSHIP = "membership"
    PUBLICATION = "publication"
    RECORD = "record"
    ROLE = "role"
    SCOPE = "scope"
