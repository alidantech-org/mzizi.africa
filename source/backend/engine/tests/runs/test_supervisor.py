"""Exercise real subprocesses, lease recovery and shared quotas against a loopback site."""

import json
import sys
from collections.abc import Callable, Iterator
from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from itertools import pairwise
from pathlib import Path
from signal import SIGKILL
from threading import Event, Lock, Thread
from time import monotonic, sleep
from uuid import uuid4

import pytest
from pymongo import MongoClient
from redis import Redis

from mzizi_engine.config import EngineConfig
from mzizi_engine.persistence.mongo.run_codec import BsonDocument
from mzizi_engine.persistence.mongo.run_ledger import MongoRunLedger
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.assembly.workers import submit_worker_run
from mzizi_engine.runtime.runs.contracts.records import RunRecord, RunState
from mzizi_engine.runtime.runs.control import LeaseLost, RunControl
from mzizi_engine.runtime.runs.supervisor import Admission, RunSupervisor

MONGO = "mongodb://127.0.0.1:27017"
REDIS = "redis://127.0.0.1:6379"


@dataclass
class Site:
    url: str
    requests: list[tuple[str, float]] = field(default_factory=list)
    slow_seen: Event = field(default_factory=Event)
    release_slow: Event = field(default_factory=Event)
    lock: Lock = field(default_factory=Lock)
    active: int = 0
    peak: int = 0


@pytest.fixture
def local_site() -> Iterator[Site]:
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            with site.lock:
                site.active += 1
                site.peak = max(site.peak, site.active)
                site.requests.append((self.path, monotonic()))
            try:
                if self.path == "/slow":
                    site.slow_seen.set()
                    site.release_slow.wait(20)
                else:
                    sleep(0.04)
                robots = self.path == "/robots.txt"
                body = b"User-agent: *\nDisallow:\n" if robots else b"<html><title>fixture</title><p>Test</p></html>"
                self.send_response(200)
                self.send_header("Content-Type", "text/plain" if robots else "text/html")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except BrokenPipeError:
                pass
            finally:
                with site.lock:
                    site.active -= 1

    with ThreadingHTTPServer(("127.0.0.1", 0), Handler) as server:
        site = Site(f"http://127.0.0.1:{server.server_port}")
        serving = Thread(target=server.serve_forever, daemon=True)
        serving.start()
        try:
            yield site
        finally:
            site.release_slow.set()
            server.shutdown()
            serving.join()


@dataclass
class Running:
    config: EngineConfig
    control: RunControl
    supervisor: RunSupervisor
    root: Path


@pytest.fixture
def running(request: pytest.FixtureRequest, monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> Iterator[Running]:
    outside = EngineConfig.load(Path("/dev/null"))
    enabled = outside.mongo
    if enabled is None or enabled.url != MONGO or enabled.database != "mzizi_runs_test":
        pytest.skip("worker integration requires the local Mongo test opt-in")
    use_redis = bool(request.param)
    if use_redis and (outside.governor is None or outside.governor.redis_url != REDIS):
        pytest.skip("set ENGINE_REDIS_URL and the governor settings for the local Redis integration")
    name = f"mzizi_runs_phase2_{uuid4().hex}"
    settings = {
        "MZIZI_ENV_FILE": "/dev/null",
        "ENGINE_ACTIVITY_STORE": "files",
        "MZIZI_MONGO_URL": MONGO,
        "MZIZI_MONGO_DATABASE": name,
        "MZIZI_DEV_ROOT": str(tmp_path),
        "MZIZI_USER_AGENT": "MziziTest/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)",
        "MZIZI_MIN_FREE_GB": "0",
        "MZIZI_MARKDOWN_WORKERS": "1",
        "ENGINE_RUN_LOG_RETENTION_DAYS": "1",
        "ENGINE_RUN_LEASE_SECONDS": "3",
        "ENGINE_HOST_REQUESTS_PER_SECOND": "4",
        "ENGINE_HOST_CONCURRENCY": "1",
        "ENGINE_HOST_DAILY_BUDGET": "100",
    }
    if use_redis:
        settings["ENGINE_REDIS_URL"] = REDIS
    else:
        monkeypatch.delenv("ENGINE_REDIS_URL", raising=False)
    for key, value in settings.items():
        monkeypatch.setenv(key, value)
    config = EngineConfig.from_env(settings)
    registry = build_operation_registry()
    ledger = MongoRunLedger(config.require_mongo(), registry, log_retention_days=1)
    control = RunControl(ledger, 3, 3, 0.1)
    supervisor = RunSupervisor(
        control,
        Admission(2, {"scraping.crawl": 1, "site.watch": 1, "crawler": 2}, 0, tmp_path),
        (sys.executable, "-m", "mzizi_engine.cli.main", "worker"),
        grace_seconds=0.2,
    )
    try:
        ledger.initialize()
        yield Running(config, control, supervisor, tmp_path)
    finally:
        try:
            supervisor.close()
        finally:
            ledger.close()
            with MongoClient[BsonDocument](MONGO) as client:
                client.drop_database(name)
            if use_redis:
                with Redis.from_url(REDIS) as redis:
                    for key in redis.scan_iter(match=f"mzizi:{name}:host-permits:*"):
                        redis.delete(key)


def _submit(running: Running, site: Site, *stages: tuple[str, str, str]) -> RunRecord:
    operations = []
    for operation, path, folder in stages:
        out = running.root / folder
        out.mkdir()
        params = {"url": site.url + path, "out_dir": str(out), "max_pages": 1, "delay": 0, "sitemap": False}
        if operation == "site.watch":
            params.update({"download": False, "hunt": False})
        operations.append({"operation": operation, "params": params})
    return submit_worker_run(
        json.dumps(
            {
                "spec_version": 1,
                "kind": "collection",
                "name": "loopback",
                "stages": operations,
                "sources": [{"url": site.url, "authority_ref": "loopback fixture"}],
            }
        ).encode(),
        running.config,
    )


def _await(running: Running, predicate: Callable[[], bool], *, seconds: int = 20) -> None:
    deadline = monotonic() + seconds
    while monotonic() < deadline:
        running.supervisor.step()
        if predicate():
            return
        sleep(0.03)
    pytest.fail("Run supervisor did not reach the expected state")


def _state(running: Running, record: RunRecord) -> RunState:
    found = running.control.ledger.read(record.run_id)
    assert found is not None
    return found.state


@pytest.mark.parametrize("running", [False, True], indirect=True, ids=["mongo", "redis"])
def test_shared_budget_two_workers_and_ceiling(running: Running, local_site: Site) -> None:
    crawl = _submit(running, local_site, ("scraping.crawl", "/crawl", "crawl"))
    watch = _submit(running, local_site, ("site.watch", "/watch", "watch"))
    waiting = _submit(running, local_site, ("scraping.crawl", "/later", "later"))
    _await(running, lambda: len(running.supervisor.children) == 2)
    assert _state(running, waiting) is RunState.QUEUED
    _await(running, lambda: all(_state(running, run) is RunState.COMPLETED for run in (crawl, watch, waiting)))
    _await(running, lambda: not running.supervisor.children)
    ordered = sorted(timestamp for _, timestamp in local_site.requests)
    assert len(ordered) == 6
    assert local_site.peak == 1
    assert min(b - a for a, b in pairwise(ordered)) >= 0.19


@pytest.mark.parametrize("running", [False], indirect=True)
def test_killed_worker_reuses_checkpoint_and_cancellation_reaps_process(running: Running, local_site: Site) -> None:
    record = _submit(
        running,
        local_site,
        ("scraping.crawl", "/first", "first"),
        ("scraping.crawl", "/slow", "slow"),
    )
    _await(running, local_site.slow_seen.is_set)
    checkpoint = running.control.ledger.read(record.run_id)
    assert checkpoint is not None and checkpoint.stages_completed == 1 and checkpoint.attempts == 1
    first = running.supervisor.children[record.run_id].process
    first.send_signal(SIGKILL)
    first.wait(timeout=2)
    local_site.release_slow.set()
    _await(running, lambda: _state(running, record) is RunState.COMPLETED)
    _await(running, lambda: not running.supervisor.children)
    done = running.control.ledger.read(record.run_id)
    assert done is not None and done.attempts == 2 and done.stages_completed == 2
    assert [path for path, _ in local_site.requests].count("/first") == 1

    local_site.slow_seen.clear()
    local_site.release_slow.clear()
    cancelled = _submit(running, local_site, ("scraping.crawl", "/slow", "cancelled"))
    _await(running, local_site.slow_seen.is_set)
    child = running.supervisor.children[cancelled.run_id].process
    running.control.cancel(cancelled.run_id)
    _await(running, lambda: _state(running, cancelled) is RunState.CANCELLED and not running.supervisor.children)
    assert child.poll() is not None


@pytest.mark.parametrize("running", [False], indirect=True)
def test_expired_lease_is_requeued_and_its_old_owner_is_fenced(running: Running, local_site: Site) -> None:
    record = _submit(running, local_site, ("scraping.crawl", "/unused", "unused"))
    claimed = running.control.claim(record)
    assert claimed is not None and claimed.lease_id is not None
    expired = claimed.model_copy(
        update={
            "lease_expires_at": datetime.now(UTC) - timedelta(seconds=1),
            "revision": claimed.revision + 1,
        }
    )
    assert running.control.ledger.update_if(claimed, expired)
    running.supervisor.step()
    found = running.control.ledger.read(record.run_id)
    assert found is not None and found.state is RunState.QUEUED
    assert found.attempts == 1 and found.lease_id is None and found.failure_type == "LeaseExpired"
    with pytest.raises(LeaseLost):
        running.control.heartbeat(record.run_id, claimed.lease_id)
