"""The in-memory governor waits on exhausted daily budgets and supports cancellation."""

from threading import Event, Thread

from mzizi_engine.config.engine_config import GovernorConfig
from mzizi_engine.runtime.runs.control import RunCancelled
from mzizi_engine.runtime.runs.governor import HostGovernor, MemoryHostStateStore


def test_exhausted_host_waits_and_never_consumes_another_permit() -> None:
    stop = Event()
    store = MemoryHostStateStore()
    policy = GovernorConfig(requests_per_second=1000, concurrency=2, daily_budget=1)
    governor = HostGovernor(policy, store, stop)
    with governor.permit("http://fixture.test/path"):
        pass
    refused = Event()
    started = Event()

    def wait_for_permit() -> None:
        started.set()
        try:
            with governor.permit("https://fixture.test./next"):
                pass
        except RunCancelled:
            refused.set()

    waiting = Thread(target=wait_for_permit)
    waiting.start()
    try:
        assert started.wait(1)
        assert not refused.wait(0.15)
        assert waiting.is_alive()
        snapshot = store.read("fixture.test")
        assert snapshot is not None and snapshot.state.used == 1 and not snapshot.state.permits
    finally:
        stop.set()
        waiting.join(timeout=2)
    assert refused.is_set()


def test_browser_stage_is_rejected_before_opening_a_worker_ledger() -> None:
    """A worker cannot navigate through an adapter that bypasses the shared governor."""
    import json

    import pytest

    from mzizi_engine.config import EngineConfig
    from mzizi_engine.runtime.assembly.workers import submit_worker_run

    config = EngineConfig.from_env(
        {
            "MZIZI_MONGO_URL": "mongodb://127.0.0.1:1",
            "MZIZI_MONGO_DATABASE": "unused",
            "MZIZI_USER_AGENT": "fixture",
            "ENGINE_RUN_LOG_RETENTION_DAYS": "1",
            "ENGINE_HOST_REQUESTS_PER_SECOND": "1",
            "ENGINE_HOST_CONCURRENCY": "1",
            "ENGINE_HOST_DAILY_BUDGET": "10",
        }
    )
    data = json.dumps(
        {
            "name": "fixture",
            "kind": "collection",
            "spec_version": 1,
            "stages": [
                {
                    "operation": "scraping.crawl",
                    "params": {"url": "http://127.0.0.1/", "out_dir": "./unused", "render": "auto"},
                },
            ],
        }
    ).encode()
    with pytest.raises(ValueError, match="require render=http"):
        submit_worker_run(data, config)
