"""Storage port for run state, append-only events and evidence metadata."""

from typing import Protocol
from uuid import UUID

from mzizi_engine.runtime.runs.contracts.records import ArtifactRecord, RunEvent, RunRecord, RunState, RunSummary


class RunLedger(Protocol):
    def create(self, record: RunRecord) -> None: ...

    def read(self, run_id: UUID) -> RunRecord | None: ...

    def transition(self, record: RunRecord, *, previous: RunState) -> None: ...

    def append(self, event: RunEvent) -> None: ...

    def record_artifact(self, run_id: UUID, record: ArtifactRecord) -> None: ...

    def summarize(self, record: RunSummary) -> None: ...
