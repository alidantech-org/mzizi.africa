"""Mongo run ledger over Dryv documents, with append-only events and a native TTL index."""

from datetime import timedelta
from uuid import UUID

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from mzizi_engine.config import MongoConfig
from mzizi_engine.persistence.mongo.run_codec import (
    EVENT_EXPIRY,
    RUN_SPEC_HASH,
    RUN_STATE,
    BsonDocument,
    decode_run,
    encode_artifact,
    encode_event,
    encode_run,
    encode_summary,
)
from mzizi_engine.persistence.mongo.store import POOL_SIZE, SERVER_SELECTION_MS
from mzizi_engine.runtime.operations import OperationRegistry
from mzizi_engine.runtime.runs.contracts.records import ArtifactRecord, RunEvent, RunRecord, RunState, RunSummary

RUNS = "runs"
EVENTS = "run_events"
ARTIFACTS = "run_artifacts"
SUMMARIES = "run_summaries"


class StaleRunState(RuntimeError):
    """A caller attempted to transition a run that no longer matches its snapshot."""


class MongoRunLedger:
    def __init__(self, config: MongoConfig, registry: OperationRegistry, *, log_retention_days: int) -> None:
        if log_retention_days <= 0:
            raise ValueError("Run event retention must be positive")
        self._registry = registry
        self._retention = timedelta(days=log_retention_days)
        self._client: MongoClient[BsonDocument] = MongoClient(
            config.url,
            serverSelectionTimeoutMS=SERVER_SELECTION_MS,
            maxPoolSize=POOL_SIZE,
            tz_aware=True,
        )
        self._database = self._client[config.database]

    def initialize(self) -> None:
        self._database[EVENTS].create_index(EVENT_EXPIRY, expireAfterSeconds=0)

    def close(self) -> None:
        self._client.close()

    def create(self, record: RunRecord) -> None:
        self._database[RUNS].insert_one(encode_run(record))

    def read(self, run_id: UUID) -> RunRecord | None:
        document = self._database[RUNS].find_one(str(run_id))
        return decode_run(document, self._registry) if document is not None else None

    def transition(self, record: RunRecord, *, previous: RunState) -> None:
        result = self._database[RUNS].replace_one(
            {"_id": str(record.run_id), RUN_STATE: previous.value, RUN_SPEC_HASH: record.spec_hash},
            encode_run(record),
        )
        if result.matched_count != 1:
            raise StaleRunState(f"Run {record.run_id} is no longer {previous}")

    def append(self, event: RunEvent) -> None:
        collection = self._database[EVENTS]
        document = encode_event(event, self._retention)
        try:
            collection.insert_one(document)
        except DuplicateKeyError:
            existing = collection.find_one(document["_id"])
            # BSON dates round to milliseconds. The immutable event fields retain their original precision.
            if existing is None or any(
                existing.get(key) != value for key, value in document.items() if key != EVENT_EXPIRY
            ):
                raise

    def record_artifact(self, run_id: UUID, record: ArtifactRecord) -> None:
        document = encode_artifact(run_id, record)
        collection = self._database[ARTIFACTS]
        try:
            collection.insert_one(document)
        except DuplicateKeyError:
            if collection.find_one(document["_id"]) != document:
                raise

    def summarize(self, record: RunSummary) -> None:
        document = encode_summary(record)
        self._database[SUMMARIES].replace_one({"_id": document["_id"]}, document, upsert=True)
