"""A thin, typed wrapper over one MongoDB database. It refuses to touch any database other than the configured dev one."""

from __future__ import annotations

import importlib
from collections.abc import Sequence
from typing import TYPE_CHECKING

from mzizi_engine.devservices.errors import ServiceRefused, ServiceUnavailable
from mzizi_engine.devservices.settings import ServiceSettings
from mzizi_engine.jsonvalue import JsonValue

if TYPE_CHECKING:
    from pymongo import MongoClient
    from pymongo.collection import Collection

type Document = dict[str, JsonValue]
SERVER_SELECTION_MS = 2000
PROBE_COLLECTION = "_probe"


class MongoSandbox:
    def __init__(self, settings: ServiceSettings) -> None:
        try:
            pymongo = importlib.import_module("pymongo")
        except ModuleNotFoundError as problem:
            raise ServiceUnavailable(
                "pymongo is not installed: run `uv sync --all-packages --extra services`"
            ) from problem
        self.settings = settings
        self._client: MongoClient[Document] = pymongo.MongoClient(
            settings.mongo_url, serverSelectionTimeoutMS=SERVER_SELECTION_MS
        )
        self._database = self._client[settings.mongo_database]

    def _collection(self, name: str) -> Collection[Document]:
        collection: Collection[Document] = self._database[name]
        return collection

    def ping(self) -> str:
        """The server version; raises `ServiceUnavailable` when MongoDB cannot be reached."""
        try:
            return str(self._client.server_info().get("version", "unknown"))
        except Exception as problem:
            raise ServiceUnavailable(
                f"MongoDB at {self.settings.mongo_url} is not reachable: {str(problem)[:150]}"
            ) from problem

    def round_trip(self) -> bool:
        """Writes, reads and deletes one document in a probe collection."""
        probe = self._collection(PROBE_COLLECTION)
        probe.replace_one({"_id": "probe"}, {"_id": "probe", "ok": True}, upsert=True)
        found = probe.find_one({"_id": "probe"})
        probe.delete_one({"_id": "probe"})
        return bool(found and found.get("ok") is True)

    def upsert_many(self, collection: str, documents: Sequence[Document]) -> int:
        """Idempotent writes keyed by `_id`; returns how many documents were new or changed."""
        target, changed = self._collection(collection), 0
        for document in documents:
            result = target.replace_one({"_id": document["_id"]}, document, upsert=True)
            changed += int(result.upserted_id is not None or result.modified_count > 0)
        return changed

    def find(self, collection: str, query: Document, limit: int) -> list[Document]:
        return list(self._collection(collection).find(query).limit(max(1, limit)))

    def counts(self) -> dict[str, int]:
        return {
            name: self._collection(name).estimated_document_count()
            for name in sorted(self._database.list_collection_names())
            if name != PROBE_COLLECTION
        }

    def drop_dev_database(self, name: str | None = None) -> str:
        """Drops the configured dev database. A different name is refused."""
        if name is not None and name != self.settings.mongo_database:
            raise ServiceRefused(f"refusing to drop {name!r}: only {self.settings.mongo_database!r} is a dev database")
        self._client.drop_database(self.settings.mongo_database)
        return self.settings.mongo_database

    def close(self) -> None:
        self._client.close()
