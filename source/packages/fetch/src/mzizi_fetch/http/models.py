"""Typed results and events of a fetch."""

from __future__ import annotations

from typing import Literal

from ..models import Frozen


class FetchResult(Frozen):
    url: str
    status: int
    headers: dict[str, str]
    body: bytes
    from_cache: bool = False
    assessment_id: str | None = None


class CacheHit(Frozen):
    event: Literal["cache_hit"] = "cache_hit"
    url: str


class Fetched(Frozen):
    event: Literal["fetch"] = "fetch"
    url: str
    status: int
    size: int


class RobotsBlocked(Frozen):
    event: Literal["robots_disallowed"] = "robots_disallowed"
    url: str


class Stopped(Frozen):
    event: Literal["stop"] = "stop"
    kind: str
    message: str


type FetchEvent = CacheHit | Fetched | RobotsBlocked | Stopped
