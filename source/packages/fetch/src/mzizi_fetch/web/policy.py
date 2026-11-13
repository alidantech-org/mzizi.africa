"""Source collection policy: what may be requested, how fast, and what the robots decision rests on.

`robots_mode` defaults to `respect`. `override` is accepted only with a recorded authorisation (reference, approved
scope hosts, rationale) and applies to those hosts alone; every decision is returned as an auditable record. The
policy cannot verify an authorisation: it requires that one is stated and keeps the statement with each decision.
"""

from __future__ import annotations

from enum import StrEnum
from urllib.parse import urlparse

from mzizi_fetch.models import Frozen
from mzizi_fetch.web.urls import host_of, same_site


class RobotsMode(StrEnum):
    RESPECT = "respect"
    OVERRIDE = "override"


class Authorization(Frozen):
    reference: str
    hosts: tuple[str, ...]
    rationale: str


class SourcePolicy(Frozen):
    site_id: str = "adhoc"
    robots_mode: RobotsMode = RobotsMode.RESPECT
    authorization: Authorization | None = None
    allowed_hosts: tuple[str, ...] = ()  # empty: the start host only (decided by the caller)
    allowed_paths: tuple[str, ...] = ()  # path prefixes; empty means every path
    excluded_paths: tuple[str, ...] = ()
    include_subdomains: bool = False
    max_requests: int = 1000
    max_concurrency: int = 2
    requests_per_second: float = 1.0

    def validate_authorization(self) -> None:
        if self.robots_mode is RobotsMode.OVERRIDE:
            auth = self.authorization
            if auth is None or not auth.reference.strip() or not auth.rationale.strip() or not auth.hosts:
                raise ValueError(
                    "robots_mode=override needs an authorization with a reference, approved hosts and a rationale"
                )


class Decision(Frozen):
    url: str
    allowed: bool
    reason: str
    robots_mode: str
    robots_observation: str  # what robots.txt said: allowed, disallowed, unavailable, not_checked
    authorization_reference: str | None = None


def scope_decision(policy: SourcePolicy, url: str, start_hosts: tuple[str, ...]) -> tuple[bool, str]:
    """Host, path and subdomain scope only; robots is decided separately."""
    host = host_of(url)
    hosts = policy.allowed_hosts or start_hosts
    if not any(same_site(h, host, policy.include_subdomains) for h in hosts):
        return False, f"host {host} is outside the allowed hosts"
    path = urlparse(url).path or "/"
    if policy.excluded_paths and path.startswith(policy.excluded_paths):
        return False, "path is excluded"
    if policy.allowed_paths and not path.startswith(policy.allowed_paths):
        return False, "path is outside the allowed paths"
    return True, ""


def robots_decision(policy: SourcePolicy, url: str, observation: str) -> Decision:
    """`observation` is what robots.txt said for this URL: allowed, disallowed or unavailable."""
    mode = policy.robots_mode.value
    if observation == "allowed":
        return Decision(url=url, allowed=True, reason="", robots_mode=mode, robots_observation=observation)
    reason = "disallowed by robots.txt" if observation == "disallowed" else "robots.txt could not be read reliably"
    auth = policy.authorization
    host = host_of(url)
    if (
        policy.robots_mode is RobotsMode.OVERRIDE
        and auth
        and any(same_site(h, host, policy.include_subdomains) for h in auth.hosts)
    ):
        return Decision(
            url=url,
            allowed=True,
            reason=f"{reason}; overridden under authorization {auth.reference}",
            robots_mode=mode,
            robots_observation=observation,
            authorization_reference=auth.reference,
        )
    return Decision(url=url, allowed=False, reason=reason, robots_mode=mode, robots_observation=observation)
