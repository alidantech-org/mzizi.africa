"""One worker process owns one claimed run and advances its stage checkpoint."""

from collections.abc import Callable
from dataclasses import dataclass
from enum import IntEnum
from threading import Event, Thread
from uuid import UUID

from mzizi_engine.runtime.runs.contracts.records import RunRecord, RunState
from mzizi_engine.runtime.runs.control import LeaseLost, RunCancelled, RunControl
from mzizi_engine.runtime.runtime import EngineRuntime


class WorkerExit(IntEnum):
    COMPLETED = 0
    RETRY = 2
    FAILED = 3
    CANCELLED = 4
    LEASE_LOST = 5


@dataclass(frozen=True)
class Worker:
    runtime: EngineRuntime
    control: RunControl
    stop: Event
    upload_stage: Callable[[RunRecord, int], None] | None = None

    def execute(self, run_id: UUID, lease: UUID) -> WorkerExit:
        try:
            run = self.control.begin(run_id, lease)
        except RunCancelled:
            return self._settle(run_id, lease)
        except LeaseLost:
            return WorkerExit.LEASE_LOST
        finished = Event()

        def heartbeat() -> None:
            interval = self.control.lease_seconds / 3
            while not finished.wait(interval):
                try:
                    self.control.heartbeat(run_id, lease)
                except Exception:
                    self.stop.set()
                    return

        pulse = Thread(target=heartbeat, name="run-heartbeat", daemon=True)
        pulse.start()
        failure: str | None = None
        try:
            for index in range(run.stages_completed, len(run.spec.stages)):
                if self.stop.is_set():
                    raise RunCancelled("Worker interrupted")
                stage = run.spec.stages[index]
                self.control.event(run, stage.operation)
                if self.upload_stage is None:
                    self.runtime.call_validated(stage.operation, stage.params)
                else:
                    self.upload_stage(run, index)
                if self.stop.is_set():
                    raise RunCancelled("Worker interrupted")
                self.control.checkpoint(run_id, lease, index + 1)
        except Exception as problem:
            failure = type(problem).__name__
        finally:
            finished.set()
            pulse.join()
        return self._settle(run_id, lease, failure)

    def _settle(self, run_id: UUID, lease: UUID, failure: str | None = None) -> WorkerExit:
        try:
            record = self.control.settle(run_id, lease, failure=failure)
        except LeaseLost:
            return WorkerExit.LEASE_LOST
        return {
            RunState.COMPLETED: WorkerExit.COMPLETED,
            RunState.QUEUED: WorkerExit.RETRY,
            RunState.FAILED: WorkerExit.FAILED,
            RunState.CANCELLED: WorkerExit.CANCELLED,
        }[record.state]
