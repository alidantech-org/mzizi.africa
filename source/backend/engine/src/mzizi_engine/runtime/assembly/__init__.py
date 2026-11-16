"""Builds the runtime the engine ships with: its configuration and every default operation registered.

The `filesystem_*` modules beside this one are the composition root for the filesystem package: its settings from the
environment and its `filesystem.*` operations. No filesystem rule or placement lives here.
"""

from __future__ import annotations

from mzizi_engine.capabilities import build_default_registry
from mzizi_engine.runtime.contracts.config import RuntimeConfig
from mzizi_engine.runtime.runtime import EngineRuntime

DRAIN_TIMEOUT_SECONDS = 30.0


def build_default_runtime() -> EngineRuntime:
    """A runtime exposing the default operations. The caller starts and stops it."""
    return EngineRuntime(RuntimeConfig(drain_timeout_seconds=DRAIN_TIMEOUT_SECONDS), build_default_registry())
