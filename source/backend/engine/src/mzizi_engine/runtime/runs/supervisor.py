"""Admit, track and reap one process group per claimed run."""

from collections.abc import Callable
from contextlib import suppress
from dataclasses import dataclass
from datetime import UTC, datetime
from os import killpg
from pathlib import Path
from shutil import disk_usage
from signal import SIGKILL
from subprocess import Popen, TimeoutExpired
from threading import Event
from time import monotonic
from typing import Literal
from uuid import UUID

from mzizi_engine.runtime.runs.contracts.records import RunRecord
from mzizi_engine.runtime.runs.control import ACTIVE, RunControl

POLL_SECONDS = 0.1
RECOVERY_PAGE = 100
MAINTENANCE_INTERVAL_SECONDS = 60


@dataclass(frozen=True)
class Admission:
    ceiling: int
    limits: dict[str, int]
    min_free_bytes: int
    scratch_root: Path


@dataclass
class Child:
    run_id: UUID
    lease: UUID
    capabilities: frozenset[str]
    process: Popen[bytes]
    terminate_at: float | None = None


class RunSupervisor:
    def __init__(
        self,
        control: RunControl,
        admission: Admission,
        worker_command: tuple[str, ...],
        *,
        grace_seconds: float,
        backend: Literal["local", "s3"] = "local",
    ) -> None:
        self.control, self.admission, self.worker_command = control, admission, worker_command
        self.grace_seconds = grace_seconds
        self.backend = backend
        self.children: dict[UUID, Child] = {}

    def step(self) -> None:
        self._reap()
        now = datetime.now(UTC)
        for record in self.control.ledger.expired_leases(now, limit=RECOVERY_PAGE):
            if record.run_store == self.backend and record.run_id not in self.children:
                self.control.recover(record, "LeaseExpired")
        active = {child.run_id: child.capabilities for child in self.children.values()}
        for run in self.control.ledger.active_leases(now):
            # A worker can outlive a supervisor crash. Its lease still reserves capacity.
            active.setdefault(run.run_id, self._capabilities(run))
        if len(active) >= self.admission.ceiling:
            return
        if disk_usage(self.admission.scratch_root).free < self.admission.min_free_bytes:
            return
        for record in self.control.ledger.ready(now, limit=RECOVERY_PAGE):
            if len(active) >= self.admission.ceiling:
                break
            if record.run_store != self.backend or record.run_id in active:
                continue
            capabilities = self._capabilities(record)
            if any(
                sum(name in reserved for reserved in active.values()) >= self.admission.limits[name]
                for name in capabilities
            ):
                continue
            claimed = self.control.claim(record)
            if claimed is not None:
                self._spawn(claimed, capabilities)
                if record.run_id in self.children:
                    active[record.run_id] = capabilities

    def _capabilities(self, record: RunRecord) -> frozenset[str]:
        return frozenset({stage.operation for stage in record.spec.stages[record.stages_completed :]} | {"crawler"})

    def _spawn(self, record: RunRecord, capabilities: frozenset[str]) -> None:
        assert record.lease_id is not None
        try:
            process = Popen(
                (*self.worker_command, "--run", str(record.run_id), "--lease", str(record.lease_id)),
                start_new_session=True,
            )
        except OSError as problem:
            self.control.recover(record, type(problem).__name__)
        else:
            self.children[record.run_id] = Child(record.run_id, record.lease_id, capabilities, process)

    @staticmethod
    def _kill_group(child: Child) -> None:
        with suppress(ProcessLookupError):
            killpg(child.process.pid, SIGKILL)

    def _reap(self) -> None:
        for child in tuple(self.children.values()):
            current = self.control.ledger.read(child.run_id)
            if child.process.poll() is not None:
                self._kill_group(child)
                child.process.wait()
                del self.children[child.run_id]
                if current and current.lease_id == child.lease and current.state in ACTIVE:
                    self.control.recover(current, "WorkerExited")
                continue
            if current is None or (current.lease_id != child.lease and current.state in ACTIVE):
                self._kill_group(child)
                continue
            if current.cancel_requested_at and child.terminate_at is None:
                child.process.terminate()
                child.terminate_at = monotonic() + self.grace_seconds
            if child.terminate_at is not None and monotonic() >= child.terminate_at:
                self._kill_group(child)
            if current.lease_expires_at is not None and current.lease_expires_at <= datetime.now(UTC):
                self._kill_group(child)

    def serve(self, stop: Event, *, maintenance: Callable[[], None] | None = None) -> None:
        next_maintenance = monotonic()
        try:
            while not stop.is_set():
                self.step()
                if maintenance is not None and monotonic() >= next_maintenance:
                    maintenance()
                    next_maintenance = monotonic() + MAINTENANCE_INTERVAL_SECONDS
                stop.wait(POLL_SECONDS)
        finally:
            self.close()

    def close(self) -> None:
        for child in self.children.values():
            if child.process.poll() is None:
                child.process.terminate()
        deadline = monotonic() + self.grace_seconds
        for child in self.children.values():
            try:
                child.process.wait(timeout=max(0.0, deadline - monotonic()))
            except TimeoutExpired:
                self._kill_group(child)
                child.process.wait()
        self._reap()
