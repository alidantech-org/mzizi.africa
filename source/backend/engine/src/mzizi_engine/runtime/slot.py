"""The runtime's record of one registered capability: the capability, its plan, its current snapshot and its jobs."""

from __future__ import annotations

from dataclasses import dataclass, field

from mzizi_engine.runtime.cancel import CancellationToken
from mzizi_engine.runtime.capability import RuntimeCapability
from mzizi_engine.runtime.contracts.config import CapabilityConfig, ConfigSnapshot
from mzizi_engine.runtime.contracts.plan import ExecutionPlan
from mzizi_engine.runtime.limiter import Limiter


@dataclass
class Slot:
    name: str
    capability: RuntimeCapability
    plan: ExecutionPlan
    snapshot: ConfigSnapshot[CapabilityConfig]
    limiter: Limiter
    tokens: set[CancellationToken] = field(default_factory=set)
