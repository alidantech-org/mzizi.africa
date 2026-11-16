"""Resolve only the configuration a run's stages need before starting work."""

from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from mzizi_engine.config import (
    ConfigError,
    CrawlerConfig,
    EngineConfig,
    MongoConfig,
    PostgresConfig,
    S3Config,
    SearchKeys,
)
from mzizi_engine.runtime.operations import OperationRegistry, Requirement
from mzizi_engine.runtime.runs.contracts.spec import JobSpec


@dataclass(frozen=True)
class WorkerContext:
    requires: frozenset[Requirement]
    crawler: CrawlerConfig | None
    postgres: PostgresConfig | None
    mongo: MongoConfig | None
    s3: S3Config | None
    search: SearchKeys | None
    input_root: Path | None
    log_retention_days: int | None


def build_worker_context(
    spec: JobSpec, registry: OperationRegistry, config: EngineConfig, *, require_ledger: bool = False
) -> WorkerContext:
    requires = frozenset(requirement for stage in spec.stages for requirement in registry.get(stage.operation).requires)
    failures: list[str] = []

    def read[T](needed: bool, require: Callable[[], T]) -> T | None:
        if needed:
            try:
                return require()
            except ConfigError as problem:
                failures.append(str(problem))
        return None

    agent = read(Requirement.USER_AGENT in requires, config.require_user_agent)
    postgres = read(Requirement.POSTGRES in requires, config.require_postgres)
    mongo = read(require_ledger or Requirement.MONGO in requires, config.require_mongo)
    s3 = read(Requirement.S3 in requires, config.require_s3)
    search = read(Requirement.SEARCH_KEYS in requires, config.require_search_keys)
    input_root = read(Requirement.INPUT_ROOT in requires, config.require_input_root)
    log_retention_days = read(require_ledger, config.runs.require_log_retention)
    if failures:
        raise ConfigError("Worker settings missing: " + "; ".join(failures))
    # Browsers have no credentials or environment settings. The acquisition package opens them on demand.
    crawler = config.crawler if agent is not None or Requirement.BROWSER in requires else None
    return WorkerContext(requires, crawler, postgres, mongo, s3, search, input_root, log_retention_days)
