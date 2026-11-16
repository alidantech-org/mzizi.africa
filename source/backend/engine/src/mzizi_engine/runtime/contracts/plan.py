"""How the runtime schedules one capability: who may call it, how many run at once and how long a caller waits."""

from __future__ import annotations

from enum import StrEnum

from pydantic import Field

from mzizi_engine.runtime.contracts.base import Frozen


class Exposure(StrEnum):
    """`exposed` capabilities may be called by front doors (CLI, HTTP, agent); `internal` ones only by other capabilities."""

    EXPOSED = "exposed"
    INTERNAL = "internal"


class ExecutionPlan(Frozen):
    """There are no defaults: every capability states its own ceiling. A capability that must run alone sets 1."""

    exposure: Exposure
    max_concurrency: int = Field(ge=1)
    #: Longest a caller waits for a free slot before the call fails; `None` waits without limit.
    queue_timeout_seconds: float | None = Field(gt=0)
