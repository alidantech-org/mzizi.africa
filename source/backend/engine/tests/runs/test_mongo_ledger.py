"""Scratch Mongo integration for the run ledger and both loopback collection operations."""

import json
import threading
from collections.abc import Iterator
from datetime import UTC, datetime, timedelta
from hashlib import sha256
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from uuid import uuid4

import pytest
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from mzizi_engine.config import EngineConfig
from mzizi_engine.persistence.mongo.run_codec import EVENT_EXPIRY, BsonDocument
from mzizi_engine.persistence.mongo.run_ledger import ARTIFACTS, EVENTS, RUNS, SUMMARIES, MongoRunLedger, StaleRunState
from mzizi_engine.runtime.assembly.default_operations import build_default_registry
from mzizi_engine.runtime.assembly.run_operations import run_job_spec
from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, EventLevel, RunEvent, RunState
from mzizi_engine.runtime.runs.local_store import LocalRunStore

_DATABASE = "mzizi_runs_test"
_URL = "mongodb://127.0.0.1:27017"
_PAGE = b"<html><head><title>Loopback</title></head><body><h1>Loopback fixture</h1></body></html>"
_ROBOTS = b"User-agent: *\nDisallow:\n"


class SiteHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        self._reply(send_body=True)

    def do_HEAD(self) -> None:
        self._reply(send_body=False)

    def _reply(self, *, send_body: bool) -> None:
        body, media = (_ROBOTS, "text/plain") if self.path == "/robots.txt" else (_PAGE, "text/html")
        self.send_response(200)
        self.send_header("Content-Type", media)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if send_body:
            self.wfile.write(body)


@pytest.fixture
def site() -> Iterator[str]:
    with ThreadingHTTPServer(("127.0.0.1", 0), SiteHandler) as server:
        worker = threading.Thread(target=server.serve_forever, daemon=True)
        worker.start()
        try:
            yield f"http://127.0.0.1:{server.server_port}/"
        finally:
            server.shutdown()
            worker.join()


@pytest.fixture
def scratch_mongo() -> Iterator[MongoClient[BsonDocument]]:
    config = EngineConfig.load(Path("/dev/null"))
    if config.mongo is None or config.mongo.url != _URL or config.mongo.database != _DATABASE:
        pytest.skip(f"requires MZIZI_MONGO_URL={_URL} and MZIZI_MONGO_DATABASE={_DATABASE}")
    with MongoClient[BsonDocument](_URL, serverSelectionTimeoutMS=2000, tz_aware=True) as client:
        if list(client.list_databases(filter={"name": _DATABASE}, nameOnly=True)):
            pytest.fail(f"Scratch database {_DATABASE} already exists")
        try:
            yield client
        finally:
            client.drop_database(_DATABASE)


def test_mongo_round_trip_ttl_and_loopback_runs(
    scratch_mongo: MongoClient[BsonDocument], site: str, tmp_path: Path
) -> None:
    config = EngineConfig.from_env(
        {
            "MZIZI_MONGO_URL": _URL,
            "MZIZI_MONGO_DATABASE": _DATABASE,
            "MZIZI_USER_AGENT": "MziziTest/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)",
            "MZIZI_DEV_ROOT": str(tmp_path / "dev"),
            "MZIZI_MARKDOWN_WORKERS": "1",
            "ENGINE_ACTIVITY_STORE": "files",
            "ENGINE_RUN_LOG_RETENTION_DAYS": "7",
        }
    )
    ledger = MongoRunLedger(config.require_mongo(), build_default_registry(config), log_retention_days=7)
    database = scratch_mongo[_DATABASE]
    store = LocalRunStore(tmp_path / "dev" / "runs")
    try:
        ledger.initialize()
        assert database[EVENTS].index_information()[f"{EVENT_EXPIRY}_1"]["expireAfterSeconds"] == 0
        assert ledger.read(uuid4()) is None
        for operation in ("scraping.crawl", "site.watch"):
            output = tmp_path / operation
            output.mkdir()
            params = {"out_dir": str(output), "url": site, "max_pages": 1, "delay": 0, "sitemap": False}
            if operation == "site.watch":
                params.update({"download": False, "hunt": False})
            spec = json.dumps(
                {
                    "spec_version": 1,
                    "name": operation,
                    "kind": "collection",
                    "sources": [{"url": site, "authority_ref": "loopback-fixture"}],
                    "stages": [{"operation": operation, "params": params}],
                }
            )
            result = run_job_spec(spec, config=config)
            record = result.record
            run_id = record.run_id
            assert result.outputs[0]
            assert ledger.read(run_id) == record and record.state is RunState.COMPLETED
            assert database[SUMMARIES].find_one(str(run_id)) is not None
            logs = store.list(run_id, "logs")
            assert len(logs) == 3
            assert database[EVENTS].count_documents({"runId": str(run_id)}) == len(logs)
            artifact_path = next(output.glob("raw/*.html"), None)
            if artifact_path is None:
                artifact_path = next((tmp_path / "dev" / "websites").rglob("*.html"))
            assert artifact_path.read_bytes() == _PAGE
            with artifact_path.open("rb") as stream:
                artifact = store.put(
                    run_id,
                    "artifacts/fixture.html",
                    stream,
                    ArtifactProvenance(media_type="text/html", stage=operation, source_url=site),
                )
            assert artifact.sha256 == sha256(_PAGE).hexdigest()
            ledger.record_artifact(run_id, artifact)
            ledger.record_artifact(run_id, artifact)
            with pytest.raises(DuplicateKeyError):
                ledger.record_artifact(run_id, artifact.model_copy(update={"sha256": "a" * 64}))
            assert database[ARTIFACTS].count_documents({"runId": str(run_id)}) == 1
            with pytest.raises(StaleRunState):
                ledger.transition(record, previous=RunState.QUEUED)
        assert database[RUNS].count_documents({}) == 2
        event = RunEvent(
            event_id=uuid4(),
            run_id=run_id,
            time=datetime.now(UTC),
            state=RunState.COMPLETED,
            level=EventLevel.INFO,
        )
        ledger.append(event)
        ledger.append(event)
        with pytest.raises(DuplicateKeyError):
            ledger.append(event.model_copy(update={"stage": "changed"}))
        stored = database[EVENTS].find_one(str(event.event_id))
        assert stored is not None
        expires = stored[EVENT_EXPIRY]
        assert isinstance(expires, datetime) and abs(expires - event.time - timedelta(days=7)) < timedelta(
            milliseconds=1
        )
    finally:
        ledger.close()
