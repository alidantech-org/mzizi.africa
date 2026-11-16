"""Typed handles: registration returns a reference that carries the capability's configuration type to every call."""

from __future__ import annotations

from dataclasses import dataclass

from mzizi_engine.runtime.contracts.config import CapabilityConfig, ConfigSnapshot
from mzizi_engine.runtime.tools.cancel import CancellationToken


@dataclass(frozen=True)
class CapabilityRef[C: CapabilityConfig]:
    name: str
    config_type: type[C]


@dataclass(frozen=True)
class Lease[C: CapabilityConfig]:
    """What a running job receives: the configuration it started with, which later `reconfigure` calls never change."""

    snapshot: ConfigSnapshot[C]
    token: CancellationToken

    @property
    def config(self) -> C:
        return self.snapshot.config
