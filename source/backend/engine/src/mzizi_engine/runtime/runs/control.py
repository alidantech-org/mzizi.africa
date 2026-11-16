"""Run claims, checkpoints, cancellation and retry transitions shared by supervisors and workers."""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from gzip import compress
from io import BytesIO
from typing import Protocol
from uuid import UUID, uuid4

from mzizi_engine.runtime.runs.contracts.records import (
    ArtifactProvenance,
    EventLevel,
    RunEvent,
    RunRecord,
    RunState,
    RunSummary,
)
from mzizi_engine.runtime.runs.encode import canonical_json
from mzizi_engine.runtime.runs.ledger import RunLedger
from mzizi_engine.runtime.runs.store import RunStore

ACTIVE = frozenset({RunState.LEASED, RunState.WORKING})
TERMINAL = frozenset({RunState.COMPLETED, RunState.FAILED, RunState.CANCELLED})


class WorkerLedger(RunLedger, Protocol):
    def ready(self, now: datetime, *, limit: int) -> tuple[RunRecord, ...]: ...
    def active_leases(self, now: datetime) -> tuple[RunRecord, ...]: ...
    def expired_leases(self, now: datetime, *, limit: int) -> tuple[RunRecord, ...]: ...
    def update_if(self, previous: RunRecord, updated: RunRecord) -> bool: ...


class LeaseLost(RuntimeError):
    """A run is no longer owned by this worker."""


class RunCancelled(RuntimeError):
    """The supervisor or caller requested cancellation."""


@dataclass(frozen=True)
class RunControl:
    ledger: WorkerLedger
    lease_seconds: int
    max_attempts: int
    retry_delay_seconds: float
    store: RunStore | None = None
    gzip_logs: bool = False

    def claim(self, run: RunRecord) -> RunRecord | None:
        now = datetime.now(UTC)
        if run.state != RunState.QUEUED or run.cancel_requested_at or (run.available_at and run.available_at > now):
            return None
        claimed = run.model_copy(
            update={
                "state": RunState.LEASED,
                "lease_id": uuid4(),
                "lease_expires_at": self._expiry(now),
                "heartbeat_at": now,
                "attempts": run.attempts + 1,
                "available_at": None,
                "revision": run.revision + 1,
            }
        )
        if not self.ledger.update_if(run, claimed):
            return None
        self.event(claimed)
        return claimed

    def _expiry(self, now: datetime) -> datetime:
        return now + timedelta(seconds=self.lease_seconds)

    def _owned(self, run_id: UUID, lease: UUID, *, cancellation: bool = False) -> RunRecord:
        current = self.ledger.read(run_id)
        now = datetime.now(UTC)
        if (
            current is None
            or current.lease_id != lease
            or current.state not in ACTIVE
            or current.lease_expires_at is None
            or current.lease_expires_at <= now
        ):
            raise LeaseLost(str(run_id))
        if current.cancel_requested_at and not cancellation:
            raise RunCancelled(str(run_id))
        return current

    def begin(self, run_id: UUID, lease: UUID) -> RunRecord:
        while True:
            current = self._owned(run_id, lease)
            if current.state != RunState.LEASED:
                raise LeaseLost(f"Run {run_id} already has a worker")
            started = current.model_copy(
                update={
                    "state": RunState.WORKING,
                    "started_at": current.started_at or datetime.now(UTC),
                    "revision": current.revision + 1,
                }
            )
            if self.ledger.update_if(current, started):
                return started

    def heartbeat(self, run_id: UUID, lease: UUID) -> None:
        while True:
            current = self._owned(run_id, lease)
            now = datetime.now(UTC)
            if self.ledger.update_if(
                current,
                current.model_copy(
                    update={
                        "heartbeat_at": now,
                        "lease_expires_at": self._expiry(now),
                        "revision": current.revision + 1,
                    }
                ),
            ):
                return

    def checkpoint(self, run_id: UUID, lease: UUID, completed: int) -> None:
        while True:
            current = self._owned(run_id, lease)
            if completed != current.stages_completed + 1 or completed > len(current.spec.stages):
                raise ValueError("Checkpoint must advance one stage")
            updated = current.model_copy(update={"stages_completed": completed, "revision": current.revision + 1})
            if self.ledger.update_if(current, updated):
                return

    def cancel(self, run_id: UUID) -> RunRecord:
        while True:
            current = self.ledger.read(run_id)
            if current is None:
                raise KeyError(run_id)
            if current.state not in ACTIVE and current.state != RunState.QUEUED:
                return current
            if current.cancel_requested_at is not None:
                return current
            now = datetime.now(UTC)
            if current.state == RunState.QUEUED:
                final = self._finish(current, RunState.CANCELLED, None, cancelled_at=now)
                if final:
                    return final
            else:
                updated = current.model_copy(update={"cancel_requested_at": now, "revision": current.revision + 1})
                if self.ledger.update_if(current, updated):
                    return updated

    def settle(self, run_id: UUID, lease: UUID, *, failure: str | None = None) -> RunRecord:
        while True:
            current = self._owned(run_id, lease, cancellation=True)
            if current.cancel_requested_at is not None:
                final = self._finish(current, RunState.CANCELLED, None)
            elif failure:
                final = self.recover(current, failure)
            elif current.stages_completed == len(current.spec.stages):
                final = self._finish(current, RunState.COMPLETED, None)
            else:
                raise ValueError("Cannot complete a run with unfinished stages")
            if final:
                return final

    def recover(self, current: RunRecord, failure: str) -> RunRecord | None:
        """Recover a dead child or expired lease using the same revision guard as its heartbeat."""
        if current.cancel_requested_at:
            return self._finish(current, RunState.CANCELLED, None)
        if current.attempts >= self.max_attempts:
            return self._finish(current, RunState.FAILED, failure)
        delay = self.retry_delay_seconds * 2 ** min(current.attempts - 1, 16)
        retry = current.model_copy(
            update={
                "state": RunState.QUEUED,
                "available_at": datetime.now(UTC) + timedelta(seconds=delay),
                "lease_id": None,
                "lease_expires_at": None,
                "failure_type": failure,
                "revision": current.revision + 1,
            }
        )
        if not self.ledger.update_if(current, retry):
            return None
        self.event(retry)
        return retry

    def _finish(
        self, current: RunRecord, state: RunState, failure: str | None, *, cancelled_at: datetime | None = None
    ) -> RunRecord | None:
        now = datetime.now(UTC)
        final = current.model_copy(
            update={
                "state": state,
                "finished_at": now,
                "failure_type": failure,
                "lease_id": None,
                "lease_expires_at": None,
                "cancel_requested_at": cancelled_at or current.cancel_requested_at,
                "revision": current.revision + 1,
            }
        )
        if not self.ledger.update_if(current, final):
            return None
        self.ledger.summarize(RunSummary(run_id=final.run_id, spec_hash=final.spec_hash, state=state, finished_at=now))
        self.event(final)
        return final

    def event(self, run: RunRecord, stage: str | None = None) -> RunEvent:
        event = RunEvent(
            event_id=uuid4(),
            run_id=run.run_id,
            time=datetime.now(UTC),
            state=run.state,
            stage=stage,
            level=EventLevel.ERROR if run.failure_type else EventLevel.INFO,
            failure_type=run.failure_type,
        )
        if self.store is not None:
            data = canonical_json(event)
            suffix, media_type = "json", "application/json"
            if self.gzip_logs:
                data = compress(data + b"\n", mtime=0)
                suffix, media_type = "jsonl.gz", "application/gzip"
            self.store.put(
                run.run_id,
                f"logs/{event.event_id}.{suffix}",
                BytesIO(data),
                ArtifactProvenance(stage=stage or "run", media_type=media_type),
            )
        self.ledger.append(event)
        return event
