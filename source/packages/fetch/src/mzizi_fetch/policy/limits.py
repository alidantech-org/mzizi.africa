"""Global ceilings and the most-conservative-limit rule.

The ceilings are policy, not protocol: they are versioned data owned by the compliance document and are kept here
until a policy manifest carries them.
"""

from __future__ import annotations

from ..models import External, Frozen

GLOBAL_MAX_RPS = 2.0
GLOBAL_MAX_CONCURRENCY = 4
GLOBAL_MAX_RESPONSE_BYTES = 256 * 1024 * 1024
GLOBAL_MAX_TIMEOUT = 120.0
GLOBAL_MAX_RETRIES = 5
DEFAULT_RPS = 0.5
DEFAULT_TIMEOUT = 30.0
DEFAULT_RETRIES = 2


class Rate(External):
    requests_per_second: float = DEFAULT_RPS
    max_concurrency: int = 1


class Sizes(External):
    max_response_bytes: int = GLOBAL_MAX_RESPONSE_BYTES
    timeout_seconds: float = DEFAULT_TIMEOUT


class Retries(External):
    max: int = DEFAULT_RETRIES


class Identify(External):
    user_agent: str | None = None


class FetchPolicy(External):
    """The part of a site manifest policy block that the fetcher reads."""

    rate: Rate = Rate()
    limits: Sizes = Sizes()
    retries: Retries = Retries()
    identify: Identify = Identify()


class Limits(Frozen):
    requests_per_second: float
    max_concurrency: int
    max_response_bytes: int
    timeout_seconds: float
    max_retries: int


def effective_limits(policy: FetchPolicy, gate_requests_per_second: float | None = None) -> Limits:
    """The most conservative of the structure policy, the approved scope (via the gate) and the global ceilings."""
    rps = min(policy.rate.requests_per_second, GLOBAL_MAX_RPS)
    if gate_requests_per_second is not None:
        rps = min(rps, gate_requests_per_second)
    return Limits(
        requests_per_second=rps,
        max_concurrency=min(policy.rate.max_concurrency, GLOBAL_MAX_CONCURRENCY),
        max_response_bytes=min(policy.limits.max_response_bytes, GLOBAL_MAX_RESPONSE_BYTES),
        timeout_seconds=min(policy.limits.timeout_seconds, GLOBAL_MAX_TIMEOUT),
        max_retries=min(policy.retries.max, GLOBAL_MAX_RETRIES),
    )
