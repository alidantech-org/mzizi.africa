"""Operational compliance controls (LEGALITY_SAFETY_AND_COMPLIANCE.md sections 5.3, 6 and 10).

Global ceilings, the most-conservative-limit rule, rate limiting, access-challenge detection, the
stop exception that ends a run (no code path retries around a restriction) and the detector for
unexpected personal data.
"""
from __future__ import annotations

import re
import time
from dataclasses import dataclass
from typing import Any, Callable, Iterable

GLOBAL_MAX_RPS = 2.0
GLOBAL_MAX_CONCURRENCY = 4
GLOBAL_MAX_RESPONSE_BYTES = 256 * 1024 * 1024
GLOBAL_MAX_TIMEOUT = 120.0
GLOBAL_MAX_RETRIES = 5
DEFAULT_RPS = 0.5


class IdentityMissing(Exception):
    """No usable, monitored user agent is configured, so live requests are refused."""


def resolve_user_agent(policy: dict, environ: dict[str, str] | None = None) -> str:
    """The user agent the engine sends: MZIZI_USER_AGENT from the deployment wins over the manifest.

    The string must name a monitored contact (compliance document section 5.3). A placeholder
    contact (an .invalid or example host, or an empty value) fails closed, so a bundle written
    before a real contact channel exists can never be run live by accident.
    """
    import os

    value = ((environ if environ is not None else os.environ).get("MZIZI_USER_AGENT") or (policy.get("identify") or {}).get("user_agent") or "").strip()
    if not value or re.search(r"example\.(invalid|com|org|net)|\.invalid\b|\.test\b|localhost", value, re.I) or "@" not in value:
        raise IdentityMissing("no monitored contact is configured: set MZIZI_USER_AGENT to a user agent with a real contact address and bot page")
    return value


class StopRun(Exception):
    """Ends the run. Raised for 401, 403, 429, repeated 5xx, access challenges and block notices; never retried."""

    def __init__(self, kind: str, message: str):
        super().__init__(message)
        self.kind = kind


class Denied(Exception):
    """The collection gate refused the request."""

    def __init__(self, reasons: list[str], assessment_id: str | None = None):
        super().__init__("; ".join(reasons))
        self.reasons, self.assessment_id = reasons, assessment_id


@dataclass(frozen=True)
class Limits:
    requests_per_second: float
    max_concurrency: int
    max_response_bytes: int
    timeout_seconds: float
    max_retries: int


def effective_limits(policy: dict, gate_requests_per_second: float | None = None) -> Limits:
    """The most conservative of the structure policy, the approved scope (via the gate) and the global ceilings."""
    rate = policy.get("rate") or {}
    rps = min(float(rate.get("requests_per_second", DEFAULT_RPS)), GLOBAL_MAX_RPS)
    if gate_requests_per_second is not None:
        rps = min(rps, gate_requests_per_second)
    limits = policy.get("limits") or {}
    return Limits(
        requests_per_second=rps,
        max_concurrency=min(int(rate.get("max_concurrency", 1)), GLOBAL_MAX_CONCURRENCY),
        max_response_bytes=min(int(limits.get("max_response_bytes", GLOBAL_MAX_RESPONSE_BYTES)), GLOBAL_MAX_RESPONSE_BYTES),
        timeout_seconds=min(float(limits.get("timeout_seconds", 30)), GLOBAL_MAX_TIMEOUT),
        max_retries=min(int((policy.get("retries") or {}).get("max", 2)), GLOBAL_MAX_RETRIES),
    )


class RateLimiter:
    """Spaces requests at least 1/rps seconds apart (per limiter instance, i.e. per host)."""

    def __init__(self, requests_per_second: float, clock: Callable[[], float] = time.monotonic, sleep: Callable[[float], None] = time.sleep):
        self.interval = 1.0 / requests_per_second
        self.clock, self.sleep = clock, sleep
        self._next = 0.0

    def wait(self) -> float:
        now = self.clock()
        delay = max(0.0, self._next - now)
        if delay:
            self.sleep(delay)
        self._next = max(now, self._next) + self.interval
        return delay


CHALLENGE_MARKERS = (
    "captcha", "g-recaptcha", "h-captcha", "cf-chl", "attention required! | cloudflare", "just a moment...", "verify you are human",
    "access denied", "request blocked", "you have been blocked", "unusual traffic", "checking your browser",
)


def detect_challenge(status: int, headers: dict[str, str], body_head: bytes) -> str | None:
    """Returns a reason when the response is an access challenge or block notice, which stops the run."""
    lowered = {k.lower(): v for k, v in headers.items()}
    if lowered.get("cf-mitigated", "").lower() == "challenge":
        return "challenge header"
    text = body_head[:8000].decode("utf-8", errors="ignore").lower()
    for marker in CHALLENGE_MARKERS:
        if marker in text:
            return f"marker {marker!r}"
    return None


# --- personal data -------------------------------------------------------------------------

FIELD_CATEGORIES = {
    "national_id": re.compile(r"(national[_ ]?id|id[_ ]?(no|number)|passport|kra[_ ]?pin|nin|ssn)", re.I),
    "phone": re.compile(r"(phone|mobile|msisdn|tel(ephone)?\b)", re.I),
    "email": re.compile(r"(e[-_ ]?mail)", re.I),
    "date_of_birth": re.compile(r"(date[_ ]?of[_ ]?birth|\bdob\b|birth[_ ]?date)", re.I),
    "precise_address": re.compile(r"(home[_ ]?address|residen|physical[_ ]?address|street)", re.I),
    "health": re.compile(r"(diagnos|medical|health[_ ]?status|hiv|disabilit)", re.I),
    "children": re.compile(r"(\bminor\b|child(ren)?[_ ]?name|pupil|student[_ ]?name)", re.I),
    "criminal": re.compile(r"(convict|arrest|criminal|charge[ds]?\b|offence)", re.I),
    "political_opinion": re.compile(r"(party[_ ]?member|political[_ ]?affiliation|religio|ethnic|tribe)", re.I),
}
VALUE_PATTERNS = {
    "email": re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"),
    "phone": re.compile(r"(?<!\d)(?:\+254|254|0)[17]\d{8}(?!\d)"),
    "national_id": re.compile(r"(?i)\b(?:id|passport)\s*(?:no\.?|number|#)?\s*[:#]?\s*\d{7,9}\b"),
}


def scan_personal_data(record: dict[str, Any], ignore_fields: Iterable[str] = ()) -> set[str]:
    """Categories of personal data suggested by field names and values in an extracted record. A hint, never a clearance."""
    found: set[str] = set()
    skip = set(ignore_fields)
    for name, value in record.items():
        if name in skip or value in (None, ""):
            continue
        for category, pattern in FIELD_CATEGORIES.items():
            if pattern.search(name):
                found.add(category)
        if isinstance(value, str):
            for category, pattern in VALUE_PATTERNS.items():
                if pattern.search(value):
                    found.add(category)
    return found


def unexpected_categories(found: set[str], allowed: Iterable[str], excluded: Iterable[str] = ()) -> set[str]:
    """Detected categories that the assessment did not anticipate, plus any that the policy excludes outright."""
    allowed_set = {c for c in allowed if c != "none_known"}
    return {c for c in found if c in set(excluded) or c not in allowed_set}
