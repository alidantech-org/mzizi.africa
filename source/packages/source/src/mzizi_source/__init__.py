"""Source client: polite identified fetching, limits and the collection-gate rule. Source policy data comes from callers."""

from .compliance import (
    Denied,
    IdentityMissing,
    Limits,
    RateLimiter,
    StopRun,
    detect_challenge,
    effective_limits,
    resolve_user_agent,
)
from .fetch import FetchResult, PoliteFetcher, RobotsDisallowed, TooLarge
from .gate import Decision, evaluate

__all__ = [
    "Decision",
    "Denied",
    "FetchResult",
    "IdentityMissing",
    "Limits",
    "PoliteFetcher",
    "RateLimiter",
    "RobotsDisallowed",
    "StopRun",
    "TooLarge",
    "detect_challenge",
    "effective_limits",
    "evaluate",
    "resolve_user_agent",
]
__version__ = "0.1.0"
