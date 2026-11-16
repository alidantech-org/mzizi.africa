"""Configuration contracts: the runtime's own settings and the base type of every capability's settings."""

from __future__ import annotations

from dataclasses import dataclass

from pydantic import Field

from mzizi_engine.runtime.contracts.base import Frozen


class RuntimeConfig(Frozen):
    #: Longest `stop` waits for running jobs to finish before the capabilities are stopped anyway.
    drain_timeout_seconds: float = Field(gt=0)


class CapabilityConfig(Frozen):
    """Base of every capability's configuration. Each package defines its own subclass with named, typed fields."""


@dataclass(frozen=True)
class ConfigSnapshot[C: CapabilityConfig]:
    """One immutable configuration plus the generation number that identifies it."""

    generation: int
    config: C
