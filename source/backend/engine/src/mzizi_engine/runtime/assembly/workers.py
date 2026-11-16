"""Assemble the CLI supervisor and worker with the runtime's configured stores and capabilities."""

import signal
import sys
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime
from fcntl import LOCK_EX, LOCK_NB, flock
from pathlib import Path
from threading import Event
from uuid import UUID, uuid4

from mzizi_crawler import configure_activity
from mzizi_crawler.shared.engine.cancel import CANCEL
from mzizi_crawler.shared.engine.governor import configure_governor
from mzizi_crawler.shared.requests import CrawlRequest, Render, WatchRequest
from mzizi_engine import __version__
from mzizi_engine.config import ConfigError, EngineConfig
from mzizi_engine.config.engine_config import GovernorConfig
from mzizi_engine.persistence.mongo.activity import activity_opener
from mzizi_engine.persistence.mongo.host_governor import MongoHostStateStore
from mzizi_engine.persistence.mongo.run_ledger import MongoRunLedger
from mzizi_engine.persistence.redis.host_governor import RedisHostStateStore
from mzizi_engine.runtime.assembly import DRAIN_TIMEOUT_SECONDS
from mzizi_engine.runtime.assembly.crawler_settings import configure_acquisition
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.assembly.run_operations import local_run_root
from mzizi_engine.runtime.assembly.run_storage import run_store, scratch_root, scratch_space, sweep_scratch
from mzizi_engine.runtime.assembly.stage_upload import StageUploader
from mzizi_engine.runtime.contracts.config import RuntimeConfig
from mzizi_engine.runtime.operations import OperationRegistry
from mzizi_engine.runtime.runs.context import build_worker_context
from mzizi_engine.runtime.runs.contracts.records import RunRecord, RunState
from mzizi_engine.runtime.runs.contracts.spec import JobSpec
from mzizi_engine.runtime.runs.control import ACTIVE, RunControl
from mzizi_engine.runtime.runs.encode import spec_hash
from mzizi_engine.runtime.runs.governor import HostGovernor
from mzizi_engine.runtime.runs.lifecycle import expire_run, seal_run
from mzizi_engine.runtime.runs.parse import PHASE_ONE_OPERATIONS, parse_job_spec
from mzizi_engine.runtime.runs.runner import validate_execution_scope
from mzizi_engine.runtime.runs.s3_store import S3RunStore
from mzizi_engine.runtime.runs.supervisor import Admission, RunSupervisor
from mzizi_engine.runtime.runs.worker import Worker, WorkerExit
from mzizi_engine.runtime.runtime import EngineRuntime


def require_governor(config: EngineConfig) -> GovernorConfig:
    if config.governor is None:
        raise ConfigError(
            "Worker host limits require ENGINE_HOST_REQUESTS_PER_SECOND, ENGINE_HOST_CONCURRENCY "
            "and ENGINE_HOST_DAILY_BUDGET"
        )
    return config.governor


def _validate_spec(spec: JobSpec, registry: OperationRegistry, config: EngineConfig) -> None:
    validate_execution_scope(spec)
    build_worker_context(spec, registry, config, require_ledger=True)
    require_governor(config)
    for stage in spec.stages:
        params = stage.params
        if isinstance(params, CrawlRequest) and params.render != Render.HTTP:
            raise ValueError("Governed workers require render=http; browser background traffic cannot be governed yet")
        if config.runs.store == "s3" and isinstance(params, WatchRequest) and (params.download or params.hunt):
            raise ValueError(
                "S3 site.watch staging requires download=false and hunt=false until staged download support"
            )


@contextmanager
def _control(config: EngineConfig, registry: OperationRegistry) -> Iterator[RunControl]:
    store = run_store(config)
    ledger = MongoRunLedger(
        config.require_mongo(),
        registry,
        log_retention_days=config.runs.require_log_retention(),
    )
    try:
        ledger.initialize()
        yield RunControl(
            ledger,
            config.runs.lease_seconds,
            config.runs.max_attempts,
            config.runs.retry_seconds,
            store,
            gzip_logs=isinstance(store, S3RunStore),
        )
    finally:
        ledger.close()


def submit_worker_run(data: bytes, config: EngineConfig) -> RunRecord:
    registry = build_operation_registry()
    spec = parse_job_spec(data, registry)
    _validate_spec(spec, registry, config)
    record = RunRecord(
        run_id=uuid4(),
        spec_hash=spec_hash(spec),
        spec=spec,
        state=RunState.QUEUED,
        requested_at=datetime.now(UTC),
        run_store=config.runs.store,
    )
    with _control(config, registry) as control:
        control.ledger.create(record)
        control.event(record)
    return record


def read_worker_run(run_id: UUID, config: EngineConfig, *, cancel: bool = False) -> RunRecord | None:
    with _control(config, build_operation_registry()) as control:
        record = control.ledger.read(run_id)
        if not cancel or record is None:
            return record
        if record.run_store != config.runs.store:
            raise ConfigError("Cancellation storage configuration differs from the queued run")
        return control.cancel(run_id)


def _install_signals(stop: Event) -> None:
    def interrupt(_signum: int, _frame: object) -> None:
        stop.set()

    signal.signal(signal.SIGINT, interrupt)
    signal.signal(signal.SIGTERM, interrupt)


@contextmanager
def _single_supervisor(root: Path) -> Iterator[None]:
    root.mkdir(parents=True, exist_ok=True)
    with (root / ".supervisor.lock").open("a") as lock:
        try:
            flock(lock, LOCK_EX | LOCK_NB)
        except BlockingIOError as problem:
            raise RuntimeError("A supervisor is already running for this local run store") from problem
        yield


def supervise_workers(config: EngineConfig) -> None:
    require_governor(config)
    registry = build_operation_registry()
    root = local_run_root(config)
    scratch = config.runs.scratch_root or root
    scratch.mkdir(parents=True, exist_ok=True)
    limits = {
        name: min(
            registry.get(name).concurrency or config.server.default_concurrency,
            config.server.limits.get(name, config.server.default_concurrency),
        )
        for name in PHASE_ONE_OPERATIONS
    }
    limits["crawler"] = config.server.limits.get("crawler", config.server.default_concurrency)
    if any(value < 1 for value in limits.values()):
        raise ConfigError("Worker concurrency limits must be positive")
    stop = Event()
    _install_signals(stop)
    with _single_supervisor(root), _control(config, registry) as control:
        supervisor = RunSupervisor(
            control,
            Admission(config.runs.worker_ceiling, limits, config.crawler.min_free_bytes, scratch),
            (sys.executable, "-m", "mzizi_engine.cli.main", "worker"),
            grace_seconds=config.runs.cancel_grace_seconds,
            backend=config.runs.store,
        )
        maintenance = None
        if isinstance(control.store, S3RunStore):
            sweep_scratch(scratch_root(config), control.ledger)

            def is_live(run_id: UUID) -> bool:
                record = control.ledger.read(run_id)
                return record is not None and record.state in ACTIVE

            control.store.sweep_spool(is_live)
            if config.runs.retention_days is not None:
                store, retention, logs = control.store, config.runs.retention_days, config.runs.require_log_retention()

                def expire_due() -> None:
                    ledger = control.ledger
                    assert isinstance(ledger, MongoRunLedger)
                    now = datetime.now(UTC)
                    for run in ledger.expiry_candidates():
                        expire_run(ledger, store, run, now=now, run_days=retention, log_days=logs)

                maintenance = expire_due
        supervisor.serve(stop, maintenance=maintenance)


def execute_worker(run_id: UUID, expected_lease: UUID | None, config: EngineConfig) -> WorkerExit:
    registry = build_operation_registry()
    policy = require_governor(config)
    with _control(config, registry) as control:
        record = control.ledger.read(run_id)
        if record is None or record.lease_id is None or (expected_lease and record.lease_id != expected_lease):
            return WorkerExit.LEASE_LOST
        if record.run_store != config.runs.store:
            raise ConfigError("Worker storage configuration differs from the queued run")
        _validate_spec(record.spec, registry, config)
        context = build_worker_context(record.spec, registry, config, require_ledger=True)
        assert context.crawler is not None and context.mongo is not None
        configure_acquisition(context.crawler)
        configure_activity(activity_opener(config))
        CANCEL.clear()
        _install_signals(CANCEL)
        shared = (
            RedisHostStateStore(policy.redis_url, context.mongo.database)
            if policy.redis_url
            else MongoHostStateStore(context.mongo)
        )
        runtime = EngineRuntime(RuntimeConfig(drain_timeout_seconds=DRAIN_TIMEOUT_SECONDS), registry)
        configure_governor(HostGovernor(policy, shared, CANCEL, lease_seconds=config.runs.lease_seconds))
        try:
            runtime.start()
            if not isinstance(control.store, S3RunStore):
                return Worker(runtime, control, CANCEL).execute(run_id, record.lease_id)
            configure_activity(lambda: None)
            with scratch_space(scratch_root(config), run_id) as scratch:
                uploader = StageUploader(runtime, control.store, control.ledger, scratch, context.crawler, CANCEL)
                result = Worker(runtime, control, CANCEL, uploader.upload).execute(run_id, record.lease_id)
            if result == WorkerExit.COMPLETED:
                seal_run(control.ledger, control.store, run_id, __version__)
            return result
        finally:
            configure_governor(None)
            try:
                runtime.stop()
            finally:
                shared.close()
