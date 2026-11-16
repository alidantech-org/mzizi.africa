"""EngineRuntime: the one class that assembles capabilities, holds their configuration and schedules their work.

A capability is a package orchestrator registered with a typed configuration and an execution plan. The runtime does
not know what a capability does. It starts and stops it, hands each job the configuration snapshot current when the job
began, limits how many jobs run at once and cancels them on stop. Front doors (CLI, HTTP, agent) call `run`.
"""

from __future__ import annotations

import threading
import time
from collections.abc import Callable

from mzizi_engine.runtime.cancel import CancellationToken
from mzizi_engine.runtime.capability import RuntimeCapability
from mzizi_engine.runtime.contracts.config import CapabilityConfig, ConfigSnapshot, RuntimeConfig
from mzizi_engine.runtime.contracts.errors import (
    CapabilityNotExposedError,
    CapabilityNotRegisteredError,
    QueueTimeoutError,
    RuntimeStateError,
)
from mzizi_engine.runtime.contracts.health import CapabilityHealth, RuntimeHealth, RuntimeState
from mzizi_engine.runtime.contracts.plan import ExecutionPlan, Exposure
from mzizi_engine.runtime.handles import CapabilityRef, Lease
from mzizi_engine.runtime.limiter import Limiter
from mzizi_engine.runtime.slot import Slot


class EngineRuntime:
    def __init__(self, config: RuntimeConfig) -> None:
        self._config = config
        self._slots: dict[str, Slot] = {}
        self._state = RuntimeState.CREATED
        self._lock = threading.RLock()

    @property
    def state(self) -> RuntimeState:
        with self._lock:
            return self._state

    def register[C: CapabilityConfig](
        self, name: str, capability: RuntimeCapability, config: C, plan: ExecutionPlan
    ) -> CapabilityRef[C]:
        """Add a capability before `start`. The returned reference is how it is called and reconfigured."""
        with self._lock:
            if self._state is not RuntimeState.CREATED:
                raise RuntimeStateError("capabilities can only be registered before the runtime starts")
            if name in self._slots:
                raise RuntimeStateError(f"capability {name!r} is already registered")
            self._slots[name] = Slot(name, capability, plan, ConfigSnapshot(1, config), Limiter(plan.max_concurrency))
            return CapabilityRef(name, type(config))

    def snapshot[C: CapabilityConfig](self, ref: CapabilityRef[C]) -> ConfigSnapshot[C]:
        with self._lock:
            return self._typed_snapshot(ref, self._slot(ref.name))

    def reconfigure[C: CapabilityConfig](self, ref: CapabilityRef[C], config: C) -> int:
        """Swap the configuration and return its new generation. Running jobs keep the snapshot they started with."""
        with self._lock:
            slot = self._slot(ref.name)
            self._require_not_stopped()
            slot.snapshot = ConfigSnapshot(slot.snapshot.generation + 1, config)
            return slot.snapshot.generation

    def replan(self, name: str, plan: ExecutionPlan) -> None:
        """Change a capability's exposure, queue timeout and concurrency ceiling while the runtime runs."""
        with self._lock:
            slot = self._slot(name)
            self._require_not_stopped()
            slot.plan = plan
            slot.limiter.set_limit(plan.max_concurrency)

    def start(self) -> None:
        """Start every capability in registration order. If one fails, those already started are stopped again."""
        with self._lock:
            if self._state is not RuntimeState.CREATED:
                raise RuntimeStateError("the runtime can only be started once")
            started: list[Slot] = []
            try:
                for slot in self._slots.values():
                    slot.capability.start()
                    started.append(slot)
            except BaseException:
                for slot in reversed(started):
                    slot.capability.stop()
                self._state = RuntimeState.STOPPED
                raise
            self._state = RuntimeState.RUNNING

    def run[C: CapabilityConfig, R](
        self, ref: CapabilityRef[C], job: Callable[[Lease[C]], R], *, front_door: bool = False
    ) -> R:
        """Run a job under the capability's plan. `front_door=True` refuses capabilities marked internal."""
        token = CancellationToken()
        with self._lock:
            if self._state is not RuntimeState.RUNNING:
                raise RuntimeStateError(f"jobs only run while the runtime is running (state: {self._state})")
            slot = self._slot(ref.name)
            if front_door and slot.plan.exposure is not Exposure.EXPOSED:
                raise CapabilityNotExposedError(f"capability {ref.name!r} is internal")
            limiter, timeout = slot.limiter, slot.plan.queue_timeout_seconds
        if not limiter.acquire(timeout):
            raise QueueTimeoutError(f"no slot for {ref.name!r} within {timeout} seconds")
        try:
            with self._lock:
                if self._state is not RuntimeState.RUNNING:
                    raise RuntimeStateError("the runtime stopped while the job waited")
                lease = Lease(self._typed_snapshot(ref, slot), token)
                slot.tokens.add(token)
            try:
                return job(lease)
            finally:
                with self._lock:
                    slot.tokens.discard(token)
        finally:
            limiter.release()

    def cancel(self, ref: CapabilityRef[CapabilityConfig]) -> None:
        """Ask every running job of one capability to stop at its next check."""
        with self._lock:
            for token in self._slot(ref.name).tokens:
                token.cancel()

    def drain(self, timeout: float) -> bool:
        """Refuse new jobs and wait until running ones finish. Returns False if some were still running at the timeout."""
        with self._lock:
            if self._state is RuntimeState.RUNNING:
                self._state = RuntimeState.DRAINING
            slots = list(self._slots.values())
        deadline = time.monotonic() + timeout
        return all(slot.limiter.wait_idle(max(0.0, deadline - time.monotonic())) for slot in slots)

    def stop(self) -> None:
        """Cancel running jobs, wait up to the drain timeout, then stop every capability in reverse order."""
        with self._lock:
            if self._state in (RuntimeState.CREATED, RuntimeState.STOPPED):
                self._state = RuntimeState.STOPPED
                return
            for slot in self._slots.values():
                for token in slot.tokens:
                    token.cancel()
        self.drain(self._config.drain_timeout_seconds)
        failures: list[Exception] = []
        with self._lock:
            for slot in reversed(list(self._slots.values())):
                try:
                    slot.capability.stop()
                except Exception as error:
                    failures.append(error)
            self._state = RuntimeState.STOPPED
        if failures:
            raise failures[0]

    def exposed(self) -> tuple[str, ...]:
        """Names of the capabilities front doors may call."""
        with self._lock:
            return tuple(s.name for s in self._slots.values() if s.plan.exposure is Exposure.EXPOSED)

    def health(self) -> RuntimeHealth:
        with self._lock:
            return RuntimeHealth(
                state=self._state,
                capabilities=tuple(
                    CapabilityHealth(
                        name=s.name,
                        exposure=s.plan.exposure,
                        generation=s.snapshot.generation,
                        in_flight=s.limiter.in_flight,
                        max_concurrency=s.limiter.limit,
                    )
                    for s in self._slots.values()
                ),
            )

    def _slot(self, name: str) -> Slot:
        slot = self._slots.get(name)
        if slot is None:
            raise CapabilityNotRegisteredError(f"capability {name!r} is not registered")
        return slot

    def _require_not_stopped(self) -> None:
        if self._state is RuntimeState.STOPPED:
            raise RuntimeStateError("the runtime is stopped")

    @staticmethod
    def _typed_snapshot[C: CapabilityConfig](ref: CapabilityRef[C], slot: Slot) -> ConfigSnapshot[C]:
        config = slot.snapshot.config
        if not isinstance(config, ref.config_type):
            raise CapabilityNotRegisteredError(f"capability {ref.name!r} has a different configuration type")
        return ConfigSnapshot(slot.snapshot.generation, config)
