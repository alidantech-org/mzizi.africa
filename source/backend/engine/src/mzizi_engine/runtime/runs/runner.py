"""Execute validated phase-one crawl specifications through an already-started runtime."""

from dataclasses import dataclass
from datetime import UTC, datetime
from io import BytesIO
from uuid import uuid4

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime.runs.context import WorkerContext
from mzizi_engine.runtime.runs.contracts.records import (
    ArtifactProvenance,
    EventLevel,
    RunEvent,
    RunRecord,
    RunState,
    RunSummary,
)
from mzizi_engine.runtime.runs.contracts.spec import JobSpec
from mzizi_engine.runtime.runs.encode import canonical_json, spec_hash
from mzizi_engine.runtime.runs.ledger import RunLedger
from mzizi_engine.runtime.runs.parse import PHASE_ONE_OPERATIONS
from mzizi_engine.runtime.runs.store import RunStore
from mzizi_engine.runtime.runtime import EngineRuntime


@dataclass(frozen=True)
class RunResult:
    record: RunRecord
    outputs: tuple[Payload, ...]


def validate_execution_scope(spec: JobSpec) -> None:
    for stage in spec.stages:
        if stage.operation not in PHASE_ONE_OPERATIONS:
            raise ValueError(f"Operation {stage.operation!r} is outside phase-one spec execution")


def run_in_process(
    runtime: EngineRuntime,
    spec: JobSpec,
    context: WorkerContext,
    ledger: RunLedger,
    store: RunStore,
    *,
    requested_by: str | None = None,
) -> RunResult:
    validate_execution_scope(spec)
    if context.crawler is None:
        raise ValueError("Crawl operations require crawler settings")
    for stage in spec.stages:
        model = runtime.operations.get(stage.operation).request_model
        if model is None or not isinstance(stage.params, model):
            raise ValueError(f"Stage {stage.operation!r} must be parsed against the runtime registry")
    record = RunRecord(
        run_id=uuid4(),
        spec_hash=spec_hash(spec),
        spec=spec,
        state=RunState.QUEUED,
        requested_at=datetime.now(UTC),
        requested_by=requested_by,
    )
    ledger.create(record)

    def event(state: RunState, stage: str | None = None, error: str | None = None) -> None:
        entry = RunEvent(
            event_id=uuid4(),
            run_id=record.run_id,
            time=datetime.now(UTC),
            state=state,
            stage=stage,
            level=EventLevel.ERROR if error else EventLevel.INFO,
            failure_type=error,
        )
        store.put(
            entry.run_id,
            f"logs/{entry.event_id}.json",
            BytesIO(canonical_json(entry)),
            ArtifactProvenance(stage=stage or "run", media_type="application/json"),
        )
        ledger.append(entry)

    def finish(state: RunState, failure_type: str | None = None) -> RunRecord:
        finished_at = datetime.now(UTC)
        final = working.model_copy(update={"state": state, "finished_at": finished_at, "failure_type": failure_type})
        ledger.transition(final, previous=RunState.WORKING)
        ledger.summarize(
            RunSummary(run_id=final.run_id, spec_hash=final.spec_hash, state=state, finished_at=finished_at)
        )
        return final

    event(RunState.QUEUED)
    working = record.model_copy(update={"state": RunState.WORKING, "attempts": 1, "started_at": datetime.now(UTC)})
    ledger.transition(working, previous=RunState.QUEUED)
    outputs = []
    for stage in spec.stages:
        event(RunState.WORKING, stage.operation)
        try:
            outputs.append(runtime.call_validated(stage.operation, stage.params))
        except Exception as problem:
            failure_type = type(problem).__name__
            finish(RunState.FAILED, failure_type)
            event(RunState.FAILED, stage.operation, failure_type)
            raise
    complete = finish(RunState.COMPLETED)
    event(RunState.COMPLETED)
    return RunResult(complete, tuple(outputs))
