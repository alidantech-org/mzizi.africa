"""The MongoDB activity store: records spool to disk when the server is down and replay when it is back. No server needed."""

from __future__ import annotations

from pathlib import Path

import pytest

from mzizi_engine.config import ConfigError, EngineConfig
from mzizi_engine.persistence.mongo import activity as module
from mzizi_engine.persistence.mongo.store import Document, MongoStore


class Down:
    def upsert_many(self, collection: str, documents: list[Document]) -> int:
        raise ConnectionError("server gone")


class Up:
    def __init__(self) -> None:
        self.stored: list[Document] = []

    def upsert_many(self, collection: str, documents: list[Document]) -> int:
        self.stored.extend(documents)
        return len(documents)


def activity(store: object) -> module.MongoActivity:
    assert isinstance(store, (Down, Up))
    return module.MongoActivity(store)  # type: ignore[arg-type]


def test_records_are_spooled_when_mongodb_is_down_and_replayed_later(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(module, "RETRY_WAITS", ())
    monkeypatch.setattr(module, "_spool_dir", lambda: tmp_path / "spool")
    assert activity(Down()).put("pages", [{"_id": "a", "n": 1}, {"_id": "b", "n": 2}]) == 0
    assert list((tmp_path / "spool").glob("*.jsonl"))
    up = Up()
    assert module.replay_spool(activity(up)) == 2
    assert [d["_id"] for d in up.stored] == ["a", "b"] and not list((tmp_path / "spool").glob("*.jsonl"))


def test_mongo_is_configured_from_the_engine_config_and_the_store_can_be_switched_off() -> None:
    with pytest.raises(ConfigError, match="MZIZI_MONGO_URL, MZIZI_MONGO_DATABASE"):
        EngineConfig.from_env({}).require_mongo()
    configured = EngineConfig.from_env({"MZIZI_MONGO_URL": "mongodb://x", "MZIZI_MONGO_DATABASE": "d"})
    assert configured.require_mongo().database == "d"
    assert module.activity_opener(EngineConfig.from_env({"ENGINE_ACTIVITY_STORE": "files"}))() is None
    assert module.activity_opener(EngineConfig.from_env({}))() is None  # unconfigured: files only, no crash


def test_the_store_type_is_importable_without_a_server() -> None:
    assert MongoStore.__name__ == "MongoStore"
