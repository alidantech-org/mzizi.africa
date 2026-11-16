"""EngineRuntime with a stub capability: configuration snapshots, concurrency, exposure, cancellation and lifecycle."""

from __future__ import annotations

import threading
from concurrent.futures import ThreadPoolExecutor

import pytest

from mzizi_engine.runtime import (
    CapabilityConfig,
    CapabilityNotExposedError,
    CapabilityNotRegisteredError,
    CapabilityRef,
    EngineRuntime,
    ExecutionPlan,
    Exposure,
    JobCancelledError,
    Lease,
    QueueTimeoutError,
    RuntimeConfig,
    RuntimeState,
    RuntimeStateError,
)


class StubConfig(CapabilityConfig):
    label: str


class OtherConfig(CapabilityConfig):
    size: int


class StubCapability:
    def __init__(self, log: list[str], name: str, fail_start: bool = False) -> None:
        self.log, self.name, self.fail_start = log, name, fail_start

    def start(self) -> None:
        if self.fail_start:
            raise RuntimeError("cannot start")
        self.log.append(f"start {self.name}")

    def stop(self) -> None:
        self.log.append(f"stop {self.name}")


def plan(exposure: Exposure = Exposure.EXPOSED, limit: int = 2, wait: float | None = 1.0) -> ExecutionPlan:
    return ExecutionPlan(exposure=exposure, max_concurrency=limit, queue_timeout_seconds=wait)


def runtime() -> EngineRuntime:
    return EngineRuntime(RuntimeConfig(drain_timeout_seconds=2.0))


def started(*, limit: int = 2, wait: float | None = 1.0) -> tuple[EngineRuntime, CapabilityRef[StubConfig], list[str]]:
    log: list[str] = []
    engine = runtime()
    ref = engine.register("stub", StubCapability(log, "stub"), StubConfig(label="a"), plan(limit=limit, wait=wait))
    engine.start()
    return engine, ref, log


def test_a_job_receives_the_registered_configuration():
    engine, ref, _ = started()
    assert engine.run(ref, lambda lease: (lease.config.label, lease.snapshot.generation)) == ("a", 1)


def test_reconfigure_bumps_the_generation_and_running_jobs_keep_their_snapshot():
    engine, ref, _ = started()
    inside, proceed = threading.Event(), threading.Event()

    def job(lease: Lease[StubConfig]) -> str:
        inside.set()
        proceed.wait(2)
        return lease.config.label

    with ThreadPoolExecutor(1) as pool:
        running = pool.submit(engine.run, ref, job)
        assert inside.wait(2)
        assert engine.reconfigure(ref, StubConfig(label="b")) == 2
        proceed.set()
        assert running.result(2) == "a"
    assert engine.run(ref, lambda lease: lease.config.label) == "b"
    assert engine.snapshot(ref).generation == 2


def test_the_concurrency_ceiling_makes_a_second_caller_wait_then_time_out():
    engine, ref, _ = started(limit=1, wait=0.05)
    inside, proceed = threading.Event(), threading.Event()

    def hold(_: Lease[StubConfig]) -> None:
        inside.set()
        proceed.wait(2)

    with ThreadPoolExecutor(1) as pool:
        running = pool.submit(engine.run, ref, hold)
        assert inside.wait(2)
        assert engine.health().capabilities[0].in_flight == 1
        with pytest.raises(QueueTimeoutError):
            engine.run(ref, lambda _: None)
        proceed.set()
        running.result(2)
    assert engine.health().capabilities[0].in_flight == 0


def test_replan_raises_the_ceiling_while_running():
    engine, _, _ = started(limit=1)
    engine.replan("stub", plan(limit=3))
    assert engine.health().capabilities[0].max_concurrency == 3


def test_front_doors_cannot_call_internal_capabilities():
    log: list[str] = []
    engine = runtime()
    inner = engine.register("inner", StubCapability(log, "inner"), StubConfig(label="x"), plan(Exposure.INTERNAL))
    outer = engine.register("outer", StubCapability(log, "outer"), StubConfig(label="y"), plan())
    engine.start()
    assert engine.exposed() == ("outer",)
    assert engine.run(inner, lambda lease: lease.config.label) == "x"
    assert engine.run(outer, lambda lease: lease.config.label, front_door=True) == "y"
    with pytest.raises(CapabilityNotExposedError):
        engine.run(inner, lambda _: None, front_door=True)


def test_a_reference_of_the_wrong_type_or_name_is_refused():
    engine, ref, _ = started()
    with pytest.raises(CapabilityNotRegisteredError):
        engine.run(CapabilityRef("missing", StubConfig), lambda _: None)
    with pytest.raises(CapabilityNotRegisteredError):
        engine.run(CapabilityRef("stub", OtherConfig), lambda _: None)
    assert ref.config_type is StubConfig


def test_lifecycle_order_state_and_misuse():
    log: list[str] = []
    engine = runtime()
    ref = engine.register("a", StubCapability(log, "a"), StubConfig(label="1"), plan())
    engine.register("b", StubCapability(log, "b"), StubConfig(label="2"), plan())
    with pytest.raises(RuntimeStateError):
        engine.run(ref, lambda _: None)
    with pytest.raises(RuntimeStateError):
        engine.register("a", StubCapability(log, "a"), StubConfig(label="3"), plan())
    engine.start()
    assert engine.state is RuntimeState.RUNNING
    with pytest.raises(RuntimeStateError):
        engine.register("c", StubCapability(log, "c"), StubConfig(label="4"), plan())
    with pytest.raises(RuntimeStateError):
        engine.start()
    engine.stop()
    assert log == ["start a", "start b", "stop b", "stop a"]
    assert engine.state is RuntimeState.STOPPED
    with pytest.raises(RuntimeStateError):
        engine.run(ref, lambda _: None)
    engine.stop()


def test_a_failing_start_stops_the_capabilities_already_started():
    log: list[str] = []
    engine = runtime()
    engine.register("a", StubCapability(log, "a"), StubConfig(label="1"), plan())
    engine.register("b", StubCapability(log, "b", fail_start=True), StubConfig(label="2"), plan())
    with pytest.raises(RuntimeError, match="cannot start"):
        engine.start()
    assert log == ["start a", "stop a"]
    assert engine.state is RuntimeState.STOPPED


def test_stop_cancels_running_jobs_and_waits_for_them():
    engine, ref, log = started()
    inside = threading.Event()

    def job(lease: Lease[StubConfig]) -> str:
        inside.set()
        for _ in range(200):
            lease.token.raise_if_cancelled()
            threading.Event().wait(0.01)
        return "finished"

    with ThreadPoolExecutor(1) as pool:
        running = pool.submit(engine.run, ref, job)
        assert inside.wait(2)
        engine.stop()
        with pytest.raises(JobCancelledError):
            running.result(2)
    assert log == ["start stub", "stop stub"]


def test_cancel_targets_one_capability_and_drain_refuses_new_jobs():
    engine, ref, _ = started()
    inside = threading.Event()

    def job(lease: Lease[StubConfig]) -> bool:
        inside.set()
        threading.Event().wait(0.3)
        return lease.token.cancelled

    with ThreadPoolExecutor(1) as pool:
        running = pool.submit(engine.run, ref, job)
        assert inside.wait(2)
        engine.cancel(ref)
        assert running.result(2) is True
    assert engine.drain(1.0) is True
    assert engine.state is RuntimeState.DRAINING
    with pytest.raises(RuntimeStateError):
        engine.run(ref, lambda _: None)


def test_health_lists_each_capability():
    engine, _, _ = started()
    health = engine.health()
    assert health.state is RuntimeState.RUNNING
    assert [(c.name, c.generation, c.in_flight) for c in health.capabilities] == [("stub", 1, 0)]


def test_the_runtime_exposes_operations_and_calls_them_by_name():
    from mzizi_engine.runtime import Operation, OperationRegistry

    registry = OperationRegistry()
    registry.register(Operation("echo.say", "1", "tests", "echoes", lambda payload: {"said": payload["text"]}, {}))
    with pytest.raises(ValueError, match="already registered"):
        registry.register(Operation("echo.say", "1", "tests", "again", lambda payload: payload, {}))
    engine = EngineRuntime(RuntimeConfig(drain_timeout_seconds=1.0), registry)
    with pytest.raises(RuntimeStateError):
        engine.call("echo.say", {"text": "hi"})
    engine.start()
    assert engine.operations.names() == ("echo.say",)
    assert [info.name for info in engine.operations.describe()] == ["echo.say"]
    assert engine.call("echo.say", {"text": "hi"}) == {"said": "hi"}
    with pytest.raises(KeyError):
        engine.call("missing", {})


def test_the_default_runtime_registers_its_packages_and_reports_their_health():
    from mzizi_engine.runtime.assembly import build_default_runtime
    from mzizi_engine.runtime.http.settings import Settings

    engine = build_default_runtime(Settings(limits={"crawler": 2}))
    engine.start()
    try:
        health = engine.health()
        assert health.state is RuntimeState.RUNNING
        by_name = {c.name: c for c in health.capabilities}
        assert set(by_name) == {"crawler", "browser"} and by_name["crawler"].max_concurrency == 2
        assert "scraping.links" in engine.operations.names()
        assert engine.call("scraping.links", {"html": '<a href="/x">X</a>', "base_url": "https://a.org/"})["links"]
    finally:
        engine.stop()
    assert engine.state is RuntimeState.STOPPED
