"""Bind artifact reads to the engine's Mongo run ledger and configured run stores."""

from uuid import UUID

from mzizi_engine.config import ConfigError, EngineConfig
from mzizi_engine.persistence.mongo.run_ledger import MongoRunLedger
from mzizi_engine.runtime.assembly.run_storage import run_store
from mzizi_engine.runtime.operations import OperationRegistry
from mzizi_engine.runtime.runs.artifacts import ArtifactReader
from mzizi_engine.runtime.runs.contracts.records import RunRecord
from mzizi_engine.runtime.runs.store import RunStore


def artifact_reader(registry: OperationRegistry) -> ArtifactReader:
    def read_run(run_id: UUID) -> RunRecord | None:
        config = EngineConfig.load()
        ledger = MongoRunLedger(
            config.require_mongo(), registry, log_retention_days=config.runs.require_log_retention()
        )
        try:
            return ledger.read(run_id)
        finally:
            ledger.close()

    def select_store(run: RunRecord) -> RunStore:
        config = EngineConfig.load()
        if config.runs.store != run.run_store:
            raise ConfigError("Engine run store does not match this run's backing store")
        return run_store(config)

    return ArtifactReader(read_run, select_store)
