"""Mongo compare-and-set store for host permits using the Dryv document contract."""

from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from mzizi_engine.api.schemas.mongo.run_ledger.models.host_governor_document import HostGovernorDocument
from mzizi_engine.config import MongoConfig
from mzizi_engine.persistence.mongo.run_codec import BsonDocument, alias
from mzizi_engine.persistence.mongo.store import SERVER_SELECTION_MS
from mzizi_engine.runtime.runs.governor import STATE_RETENTION_SECONDS, HostSnapshot, HostState

_EXPIRY = alias(HostGovernorDocument, "expires_at")
_REVISION = alias(HostGovernorDocument, "revision")


class MongoHostStateStore:
    def __init__(self, config: MongoConfig) -> None:
        self._client: MongoClient[BsonDocument] = MongoClient(
            config.url,
            tz_aware=True,
            serverSelectionTimeoutMS=SERVER_SELECTION_MS,
            timeoutMS=3000,
        )
        self._collection = self._client[config.database]["host_governor"]
        self._collection.create_index(_EXPIRY, expireAfterSeconds=0)

    def close(self) -> None:
        self._client.close()

    def read(self, host: str) -> HostSnapshot | None:
        raw = self._collection.find_one(host)
        if raw is None:
            return None
        model = HostGovernorDocument.model_validate({key: value for key, value in raw.items() if key != "_id"})
        return HostSnapshot(str(model.revision), HostState.model_validate_json(model.state_json))

    def compare_and_set(self, host: str, previous: HostSnapshot | None, state: HostState) -> bool:
        model = HostGovernorDocument(
            revision=uuid4(),
            state_json=state.model_dump_json(),
            expires_at=datetime.now(UTC) + timedelta(seconds=STATE_RETENTION_SECONDS),
        )
        document: BsonDocument = {
            "_id": host,
            _REVISION: str(model.revision),
            alias(HostGovernorDocument, "state_json"): model.state_json,
            _EXPIRY: model.expires_at,
        }
        if previous is None:
            try:
                self._collection.insert_one(document)
            except DuplicateKeyError:
                return False
            return True
        return (
            self._collection.replace_one({"_id": host, _REVISION: str(UUID(previous.revision))}, document).matched_count
            == 1
        )
