"""What the runtime reports about itself and each capability."""

from __future__ import annotations

from enum import StrEnum

from pydantic import Field

from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.contracts.plan import Exposure


class RuntimeState(StrEnum):
    CREATED = "created"
    RUNNING = "running"
    DRAINING = "draining"
    STOPPED = "stopped"


class CapabilityHealth(Frozen):
    name: str
    exposure: Exposure
    generation: int = Field(ge=1)
    in_flight: int = Field(ge=0)
    max_concurrency: int = Field(ge=1)


class RuntimeHealth(Frozen):
    state: RuntimeState
    capabilities: tuple[CapabilityHealth, ...]
