"""Fetch policy: identity, limits, gate shapes and stop/deny errors."""

from mzizi_fetch.policy.errors import Denied, IdentityMissing, RobotsDisallowed, StopRun, TooLarge, UpstreamError
from mzizi_fetch.policy.gate import Decision, FetchMode, GateCheck, GateRequest, Purpose
from mzizi_fetch.policy.identity import resolve_user_agent
from mzizi_fetch.policy.limits import FetchPolicy, Limits, effective_limits

__all__ = [
    "Decision",
    "Denied",
    "FetchMode",
    "FetchPolicy",
    "GateCheck",
    "GateRequest",
    "IdentityMissing",
    "Limits",
    "Purpose",
    "RobotsDisallowed",
    "StopRun",
    "TooLarge",
    "UpstreamError",
    "effective_limits",
    "resolve_user_agent",
]
