"""Errors the database service's named operations raise. Messages never carry credentials or
raw database detail; the service itself already withholds that at its own boundary."""

from __future__ import annotations


class ApiError(Exception):
    """A non-2xx response. `code` is the service's own short code (`forbidden`, `not_found`,
    `validation_error`, `unavailable`, `internal_error`); `status` is the HTTP status."""

    def __init__(self, status: int, code: str) -> None:
        super().__init__(f"{status} {code}")
        self.status = status
        self.code = code


class Denied(ApiError):
    """The acting account does not hold the permission the operation requires."""


class Conflict(ApiError):
    """The request contradicts already-registered state (for example, a duplicate code)."""
