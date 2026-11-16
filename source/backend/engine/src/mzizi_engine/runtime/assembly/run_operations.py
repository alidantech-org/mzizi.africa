"""Assemble a phase-one run using configured Mongo metadata and local artifact storage."""

from pathlib import Path

from mzizi_crawler import configure_activity
from mzizi_crawler.shared.layout import DevLayout
from mzizi_engine.config import ConfigError, EngineConfig
from mzizi_engine.persistence.mongo.activity import activity_opener
from mzizi_engine.persistence.mongo.run_ledger import MongoRunLedger
from mzizi_engine.runtime.assembly import DRAIN_TIMEOUT_SECONDS
from mzizi_engine.runtime.assembly.crawler_settings import configure_acquisition
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.contracts.config import RuntimeConfig
from mzizi_engine.runtime.runs.context import build_worker_context
from mzizi_engine.runtime.runs.local_store import LocalRunStore
from mzizi_engine.runtime.runs.parse import parse_job_spec
from mzizi_engine.runtime.runs.runner import RunResult, run_in_process, validate_execution_scope
from mzizi_engine.runtime.runtime import EngineRuntime


def local_run_root(config: EngineConfig) -> Path:
    return config.runs.local_root or DevLayout.resolve(config.crawler.dev_root).runs


def run_job_spec(
    data: bytes | str, *, config: EngineConfig | None = None, requested_by: str | None = None
) -> RunResult:
    config = config or EngineConfig.load()
    if config.runs.store != "local":
        raise ConfigError("Phase-one runs require ENGINE_RUN_STORE=local")
    registry = build_operation_registry()
    spec = parse_job_spec(data, registry)
    validate_execution_scope(spec)
    context = build_worker_context(spec, registry, config, require_ledger=True)
    assert context.crawler is not None and context.mongo is not None and context.log_retention_days is not None
    configure_acquisition(context.crawler)
    configure_activity(activity_opener(config))
    runtime = EngineRuntime(RuntimeConfig(drain_timeout_seconds=DRAIN_TIMEOUT_SECONDS), registry)
    store = LocalRunStore(local_run_root(config))
    ledger = MongoRunLedger(context.mongo, registry, log_retention_days=context.log_retention_days)
    try:
        ledger.initialize()
        runtime.start()
        return run_in_process(runtime, spec, context, ledger, store, requested_by=requested_by)
    finally:
        try:
            runtime.stop()
        finally:
            ledger.close()
