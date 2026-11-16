"""Mongo run ledger over Dryv documents, with append-only events and a native TTL index."""

from collections.abc import Iterator
from datetime import datetime, timedelta
from uuid import UUID

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from mzizi_engine.config import MongoConfig
from mzizi_engine.persistence.mongo.run_codec import (
    EVENT_EXPIRY,
    RUN_AVAILABLE_AT,
    RUN_LEASE_EXPIRY,
    RUN_REQUESTED_AT,
    RUN_REVISION,
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
from mzizi_engine.runtime.runs.contracts.records import (
    ArtifactRecord,
    ArtifactState,
    RunEvent,
    RunRecord,
    RunState,
    RunSummary,
)

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
            timeoutMS=3000,
            tz_aware=True,
        )
        self._database = self._client[config.database]

    def initialize(self) -> None:
        self._database[EVENTS].create_index(EVENT_EXPIRY, expireAfterSeconds=0)
        self._database[RUNS].create_index([(RUN_STATE, 1), (RUN_AVAILABLE_AT, 1), (RUN_REQUESTED_AT, 1)])
        self._database[RUNS].create_index([(RUN_STATE, 1), (RUN_LEASE_EXPIRY, 1)])

    def close(self) -> None:
        self._client.close()

    def create(self, record: RunRecord) -> None:
        self._database[RUNS].insert_one(encode_run(record))

    def read(self, run_id: UUID) -> RunRecord | None:
        document = self._database[RUNS].find_one(str(run_id))
        return decode_run(document, self._registry) if document is not None else None

    def ready(self, now: datetime, *, limit: int) -> tuple[RunRecord, ...]:
        query = {
            RUN_STATE: RunState.QUEUED.value,
            "$or": [{RUN_AVAILABLE_AT: None}, {RUN_AVAILABLE_AT: {"$lte": now}}],
        }
        rows = self._database[RUNS].find(query).sort([(RUN_AVAILABLE_AT, 1), (RUN_REQUESTED_AT, 1)]).limit(limit)
        return tuple(decode_run(row, self._registry) for row in rows)

    def active_leases(self, now: datetime) -> tuple[RunRecord, ...]:
        query = {
            RUN_STATE: {"$in": [RunState.LEASED.value, RunState.WORKING.value]},
            RUN_LEASE_EXPIRY: {"$gt": now, "$type": "date"},
        }
        return tuple(decode_run(row, self._registry) for row in self._database[RUNS].find(query))

    def expired_leases(self, now: datetime, *, limit: int) -> tuple[RunRecord, ...]:
        query = {
            RUN_STATE: {"$in": [RunState.LEASED.value, RunState.WORKING.value]},
            RUN_LEASE_EXPIRY: {"$lte": now, "$type": "date"},
        }
        rows = self._database[RUNS].find(query).sort(RUN_LEASE_EXPIRY).limit(limit)
        return tuple(decode_run(row, self._registry) for row in rows)

    def update_if(self, previous: RunRecord, updated: RunRecord) -> bool:
        if previous.run_id != updated.run_id or previous.spec_hash != updated.spec_hash:
            raise ValueError("Run identity cannot change")
        if updated.revision != previous.revision + 1:
            raise ValueError("Run revision must advance by one")
        query: BsonDocument = {
            "_id": str(previous.run_id),
            RUN_STATE: previous.state.value,
            RUN_SPEC_HASH: previous.spec_hash,
            RUN_REVISION: previous.revision if previous.revision else {"$in": [0, None]},
        }
        return self._database[RUNS].replace_one(query, encode_run(updated)).matched_count == 1

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

    def mark_promoted(self, run_id: UUID, artifact: ArtifactRecord) -> None:
        collection = self._database[ARTIFACTS]
        previous = encode_artifact(run_id, artifact)
        final = encode_artifact(run_id, artifact.model_copy(update={"state": ArtifactState.PROMOTED}))
        if collection.replace_one(previous, final).matched_count != 1 and collection.find_one(final["_id"]) != final:
            raise ValueError(f"Artifact {artifact.path} is missing or no longer matches the manifest")

    def expiry_candidates(self) -> Iterator[RunRecord]:
        states = [
            state.value
            for state in (
                RunState.COMPLETED,
                RunState.SEALED,
                RunState.REJECTED,
                RunState.PROMOTED,
                RunState.CANCELLED,
                RunState.FAILED,
                RunState.EXPIRING,
                RunState.EXPIRED,
            )
        ]
        for raw in self._database[RUNS].find({RUN_STATE: {"$in": states}}):
            yield decode_run(raw, self._registry)

    def summarize(self, record: RunSummary) -> None:
        document = encode_summary(record)
        self._database[SUMMARIES].replace_one({"_id": document["_id"]}, document, upsert=True)
