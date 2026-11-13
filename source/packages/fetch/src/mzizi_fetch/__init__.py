"""Fetch client: polite identified HTTP/API fetching, limits and stop rules. Gate and challenge checks are injected."""

from .http import ChallengeCheck, FetchEvent, FetchResult, PoliteFetcher, RateLimiter
from .parse import parse_policy
from .policy import (
    Decision,
    Denied,
    FetchMode,
    FetchPolicy,
    GateCheck,
    GateRequest,
    IdentityMissing,
    Limits,
    Purpose,
    RobotsDisallowed,
    StopRun,
    TooLarge,
    UpstreamError,
    effective_limits,
    resolve_user_agent,
)

__all__ = [
    "ChallengeCheck",
    "Decision",
    "Denied",
    "FetchEvent",
    "FetchMode",
    "FetchPolicy",
    "FetchResult",
    "GateCheck",
    "GateRequest",
    "IdentityMissing",
    "Limits",
    "PoliteFetcher",
    "Purpose",
    "RateLimiter",
    "RobotsDisallowed",
    "StopRun",
    "TooLarge",
    "UpstreamError",
    "effective_limits",
    "parse_policy",
    "resolve_user_agent",
]
__version__ = "0.1.0"
