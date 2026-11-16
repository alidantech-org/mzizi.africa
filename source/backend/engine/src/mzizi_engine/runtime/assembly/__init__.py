"""Builds the runtime the engine ships with: its configuration and every default operation registered.

The `filesystem_*` modules beside this one are the composition root for the filesystem package: its settings from the
environment and its `filesystem.*` operations. No filesystem rule or placement lives here.
"""

from __future__ import annotations

from mzizi_browser import BrowserOrchestrator
from mzizi_crawler import CrawlerOrchestrator
from mzizi_engine.runtime.assembly.default_operations import build_default_registry
from mzizi_engine.runtime.contracts.config import CapabilityConfig, RuntimeConfig
from mzizi_engine.runtime.contracts.plan import ExecutionPlan, Exposure
from mzizi_engine.runtime.http.settings import Settings
from mzizi_engine.runtime.runtime import EngineRuntime

DRAIN_TIMEOUT_SECONDS = 30.0
QUEUE_TIMEOUT_SECONDS = 600.0


class PackageConfig(CapabilityConfig):
    """What the runtime records about a registered package: which distribution and which version of its operations."""

    package: str
    version: str


def build_default_runtime(settings: Settings | None = None) -> EngineRuntime:
    """The runtime the engine ships with: every default operation exposed and each capability package registered.

    Concurrency per capability comes from the settings (`ENGINE_CAPABILITY_LIMITS`, else the default); the caller starts and
    stops the runtime.
    """
    settings = settings or Settings()
    runtime = EngineRuntime(RuntimeConfig(drain_timeout_seconds=DRAIN_TIMEOUT_SECONDS), build_default_registry())
    for name, capability, package in (
        ("crawler", CrawlerOrchestrator(), "mzizi-crawler"),
        ("browser", BrowserOrchestrator(), "mzizi-browser"),
    ):
        runtime.register(
            name,
            capability,
            PackageConfig(package=package, version="0.2.0"),
            ExecutionPlan(
                exposure=Exposure.EXPOSED,
                max_concurrency=settings.limits.get(name, settings.default_concurrency),
                queue_timeout_seconds=QUEUE_TIMEOUT_SECONDS,
            ),
        )
    return runtime
