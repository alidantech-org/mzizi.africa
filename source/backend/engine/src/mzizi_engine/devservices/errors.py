"""Failures of the dev services, with a message that says what to do."""

from __future__ import annotations


class ServiceUnavailable(RuntimeError):
    """A dev service or its client library is missing or unreachable."""


class ServiceRefused(RuntimeError):
    """The request would touch something outside the dev sandbox."""
