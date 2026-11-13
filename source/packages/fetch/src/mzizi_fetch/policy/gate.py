"""The collection-gate request and answer shapes. The rule itself is evaluated by the caller (the engine)."""

from __future__ import annotations

from collections.abc import Callable
from enum import StrEnum

from pydantic import Field

from ..models import Frozen


class Purpose(StrEnum):
    ASSESS = "assess"
    COLLECT = "collect"
    PUBLISH = "publish"


class FetchMode(StrEnum):
    HTTP = "http"
    API = "api"
    BROWSER = "browser"


class GateRequest(Frozen):
    site_id: str
    host: str
    scheme: str
    path: str
    method: str = "GET"
    fetch_mode: FetchMode = FetchMode.HTTP
    purpose: Purpose
    requests_per_second: float


class Decision(Frozen):
    allowed: bool
    reasons: list[str] = Field(default_factory=list)
    assessment_id: str | None = None
    requests_per_second: float | None = None


type GateCheck = Callable[[GateRequest], Decision]
