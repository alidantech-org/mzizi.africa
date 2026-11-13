"""Exceptions that end or refuse a fetch. None of them is retried."""

from __future__ import annotations


class IdentityMissing(Exception):
    """No usable, monitored user agent is configured, so live requests are refused."""


class StopRun(Exception):
    """Ends the run. Raised for 401, 403, 429, repeated 5xx, access challenges and block notices; never retried."""

    def __init__(self, kind: str, message: str) -> None:
        super().__init__(message)
        self.kind = kind


class Denied(Exception):
    """The collection gate refused the request."""

    def __init__(self, reasons: list[str], assessment_id: str | None = None) -> None:
        super().__init__("; ".join(reasons))
        self.reasons, self.assessment_id = reasons, assessment_id


class UpstreamError(Exception):
    """The server kept answering with a 5xx status after the allowed retries."""

    def __init__(self, url: str, status: int) -> None:
        super().__init__(f"{status} from {url}")
        self.url, self.status = url, status


class RobotsDisallowed(Exception):
    """robots.txt disallows the path for our user agent."""


class TooLarge(Exception):
    """A response is larger than the effective size limit."""
