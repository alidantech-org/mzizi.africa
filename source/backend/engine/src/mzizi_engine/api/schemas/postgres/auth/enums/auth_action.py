"""Auth Action: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AuthAction(StrEnum):
    ADMIN = "admin"
    CREATE = "create"
    DELETE = "delete"
    EXPORT = "export"
    PUBLISH = "publish"
    READ = "read"
    REVIEW = "review"
    UPDATE = "update"
